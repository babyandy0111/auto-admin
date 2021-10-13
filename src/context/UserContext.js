import React, {useContext, useReducer} from "react";
import API from "../server/api"

const UserStateContext = React.createContext({});
const UserDispatchContext = React.createContext({});

function userReducer(state, action) {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {...state, isAuthenticated: true};
        case "SIGN_OUT_SUCCESS":
            return {...state, isAuthenticated: false};
        case "LOGIN_FAILURE":
            return {...state, isAuthenticated: false};
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function UserProvider({children}) {
    const [state, dispatch] = useReducer(userReducer, {
        isAuthenticated: !!localStorage.getItem("id_token"),
    });

    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
}

function useUserState() {
    const context = useContext(UserStateContext);
    if (context === undefined) {
        throw new Error("useUserState must be used within a UserProvider");
    }
    return context;
}

function useUserDispatch() {
    const context = useContext(UserDispatchContext);
    if (context === undefined) {
        throw new Error("useUserDispatch must be used within a UserProvider");
    }
    return context;
}

export {UserProvider, useUserState, useUserDispatch, loginUser, signOut, createUser};

function loginUser(dispatch, companyName, email, password, history, setIsLoading, setError) {
    setError(false);
    setIsLoading(true);

    if (!!companyName && !!email && !!password) {
        const params = {'name': companyName, 'account': email, 'password': password}
        API.postLogin(params).then(res => {
            if (res.token != null) {
                localStorage.setItem('id_token', res.token)
                setError(null)
                setIsLoading(false)
                dispatch({type: 'LOGIN_SUCCESS'})
                history.push('/app/dashboard')
            } else {
                dispatch({type: "LOGIN_FAILURE"});
                setError(true);
                setIsLoading(false);
            }
        }).catch((e) => {
            console.log(e);
        })
    }
}

function createUser(dispatch, companyName, email, password, history, setIsLoading, setError) {
    setError(false);
    setIsLoading(true);

    if (!!companyName && !!email && !!password) {
        const params = {'name': companyName, 'account': email, 'password': password}
        API.postAccount(params).then(res => {
            if(res.id != null){
                loginUser(dispatch, companyName, email, password, history, setIsLoading, setError);
            }
        }).catch((e) => {
            console.log(e);
        })
    }
}

function signOut(dispatch, history) {
    localStorage.removeItem("id_token");
    dispatch({type: "SIGN_OUT_SUCCESS"});
    history.push("/login");
}
