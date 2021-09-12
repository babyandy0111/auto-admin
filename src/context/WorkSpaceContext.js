import React, {createContext, useContext, useEffect, useReducer} from "react";
import API from "../server/api";
import {Select} from "antd";
import {Grid} from "@material-ui/core";
import {useUserDispatch, signOut} from "./UserContext";

const WorkSpaceStateContext = createContext();
const WorkSpaceDispatchContext = createContext();
const Option = Select.Option;

const initialState = {
    resource: [{id: '0', name: "請選擇"}],
}

function WorkSpaceReducer(state, action) {
    switch (action.type) {
        case "GET_DATA":
            return {...state, resource: action.data};
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function WorkSpaceProvider({children, props}) {
    const [state, dispatch] = useReducer(WorkSpaceReducer, initialState);
    const userDispatch = useUserDispatch();
    useEffect(() => {
        getData(state, dispatch, userDispatch, props)
    }, [])

    return (
        <WorkSpaceStateContext.Provider value={state}>
            <WorkSpaceDispatchContext.Provider value={dispatch}>
                {children}
                <Grid item>
                    <Select defaultValue={state.resource[0].name} style={{width: 120}} onChange={resourcesChangeHandle}>
                        {state.resource.map(resData => (
                            <Option key={resData.id} value={resData.name}>{resData.name}</Option>
                        ))}
                    </Select>
                </Grid>
            </WorkSpaceDispatchContext.Provider>
        </WorkSpaceStateContext.Provider>
    );
}

function useWorkSpaceState() {
    const context = useContext(WorkSpaceStateContext);
    if (context === undefined) {
        throw new Error("useWorkSpaceState must be used within a WorkSpaceProvider");
    }
    return context;
}

function useWorkSpaceDispatch() {
    const context = useContext(WorkSpaceDispatchContext);
    if (context === undefined) {
        throw new Error("useWorkSpaceDispatch must be used within a WorkSpaceProvider");
    }
    return context;
}

export {WorkSpaceProvider, useWorkSpaceState, useWorkSpaceDispatch, getData};

function getData(state, dispatch, userDispatch, props) {
    API.getResourcesMysql({page: 1, per_page: 10})
        .then((res) => {
            if (res.error === 401) {
                // console.log(props)
                signOut(userDispatch, props.history);
            } else {
                // let data = state.resource
                res.resources.map(arr => {
                    state.resource.push({id: arr.id, name: arr.name});
                })
                dispatch({type: "GET_DATA", data: state.resource})
            }
        })
}

function resourcesChangeHandle(e) {
    console.log(e);
}
