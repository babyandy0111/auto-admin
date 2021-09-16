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
    subdomain: [{id: '0', name: "請選擇"}],
}

function WorkSpaceReducer(state, action) {
    switch (action.type) {
        case "GET_RESOURCE_DATA":
            return {...state, resource: action.data};
        case "GET_SUBDOMAIN_DATA":
            return {...state, subdomain: action.data};
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function WorkSpaceProvider({children, props}) {
    const [state, dispatch] = useReducer(WorkSpaceReducer, initialState);
    const userDispatch = useUserDispatch();
    useEffect(() => {
        if (state.resource.length <= 2) {
            getData(state, dispatch, userDispatch, props)
        }
    }, [])

    return (
        <WorkSpaceStateContext.Provider value={state}>
            <WorkSpaceDispatchContext.Provider value={dispatch}>
                {children}
                <Grid container spacing={3}>
                    <Grid item>
                        <Select defaultValue={state.resource[0].name} style={{width: 120}}
                                onChange={resourcesChangeHandle}>
                            {state.resource.map(resData => (
                                <Option key={resData.id} value={resData.name}>{resData.name}</Option>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item>
                        <Select defaultValue={state.subdomain[0].name} style={{width: 120}}
                                onChange={subdomainChangeHandle}>
                            {state.subdomain.map(subData => (
                                <Option key={subData.id} value={subData.name}>{subData.name}</Option>
                            ))}
                        </Select>
                    </Grid>
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
                dispatch({type: "GET_RESOURCE_DATA", data: state.resource})
            }
        })

    API.getResourcesSubdomain({page: 1, per_page: 10})
        .then((res) => {
            if (res.error === 401) {
                // console.log(props)
                signOut(userDispatch, props.history);
            } else {
                // let data = state.resource
                res.resources.map(arr => {
                    state.subdomain.push({id: arr.id, name: arr.name});
                })
                dispatch({type: "GET_SUBDOMAIN_DATA", data: state.subdomain})
            }
        })
}

function resourcesChangeHandle(e) {
    console.log(e);
}

function subdomainChangeHandle(e) {
    console.log(e);
}
