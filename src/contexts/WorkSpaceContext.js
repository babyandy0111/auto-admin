import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  useImperativeHandle,
} from "react"
import API from "../server/api"
import { Grid, Select } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"

const WorkSpaceStateContext = createContext()
const WorkSpaceDispatchContext = createContext()

const initialState = {
  resource: [{ id: "0", name: "請選擇" }],
  subdomain: [{ id: "0", name: "請選擇" }],
}

function WorkSpaceReducer(state, action) {
  switch (action.type) {
    case "GET_RESOURCE_DATA":
      return { ...state, resource: action.data }
    case "GET_SUBDOMAIN_DATA":
      return { ...state, subdomain: action.data }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export const WorkSpaceProvider = ({ children, props, cRef }) => {
  const [state, dispatch] = useReducer(WorkSpaceReducer, initialState)
  const [selectSubdomain, setSelectSubdomain] = useState()
  const [selectResource, setSelectResource] = useState()

  const resourcesChangeHandle = (e) => {
    console.log(e.target.value)
    setSelectResource(e.target.value)
  }

  const subdomainChangeHandle = (e) => {
    console.log(e.target.value)
    setSelectSubdomain(e.target.value)
  }

  useImperativeHandle(cRef, () => ({
    getSubdomainValue: () => selectSubdomain,
    getResourceValue: () => selectResource,
  }))

  useEffect(() => {
    getData(state, dispatch)
  }, [state])

  return (
    <WorkSpaceStateContext.Provider value={state}>
      <WorkSpaceDispatchContext.Provider value={dispatch}>
        {children}
        <Grid container spacing={3}>
          <Grid item>
            <Select
              defaultValue={state.resource[0].name}
              style={{ width: 120 }}
              onChange={resourcesChangeHandle}
            >
              {state.resource.map((resData) => (
                <MenuItem key={resData.id} value={resData.name}>
                  {resData.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              defaultValue={state.subdomain[0].name}
              style={{ width: 120 }}
              onChange={subdomainChangeHandle}
            >
              {state.subdomain.map((subData) => (
                <MenuItem key={subData.id} value={subData.name}>
                  {subData.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </WorkSpaceDispatchContext.Provider>
    </WorkSpaceStateContext.Provider>
  )
}

export const useWorkSpaceState = () => {
  const context = useContext(WorkSpaceStateContext)
  if (context === undefined) {
    throw new Error("useWorkSpaceState must be used within a WorkSpaceProvider")
  }
  return context
}

export const useWorkSpaceDispatch = () => {
  const context = useContext(WorkSpaceDispatchContext)
  if (context === undefined) {
    throw new Error(
      "useWorkSpaceDispatch must be used within a WorkSpaceProvider",
    )
  }
  return context
}

const getData = (state, dispatch) => {
  API.getResourcesMysql({ page: 1, per_page: 10 }).then((res) => {
    res.resources.forEach(({ id, name }) => {
      state.resource.push({ id, name })
    })
    dispatch({ type: "GET_RESOURCE_DATA", data: state.resource })
  })

  API.getResourcesSubdomain({ page: 1, per_page: 10 }).then((res) => {
    res.resources.forEach(({ id, name }) => {
      state.subdomain.push({ id, name })
    })
    dispatch({ type: "GET_SUBDOMAIN_DATA", data: state.subdomain })
  })
}
