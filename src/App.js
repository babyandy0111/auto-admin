import React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { useUserState } from "./contexts/UserContext"
import { AppPage, ErrorPage, LoginPage } from "./pages"

export default function App() {
  // global
  const { isAuthenticated } = useUserState()

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="app/api-management/data-source" />} />
        <Route exact path="/app" render={() => <Redirect to="app/api-management/data-source" />} />
        <PrivateRoute path="/app" component={AppPage} />
        <PublicRoute path="/login" component={LoginPage} />
        <Route component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  )

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    )
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    )
  }
}
