import React from "react"
import { HashRouter, Route, Switch, Redirect } from "react-router-dom"

// components
import Layout from "./layouts/Layout"

// pages
import Error from "./pages/error/Error"
import Login from "./pages/login/Login"

// context
import { useUserState } from "./contexts/UserContext"

export default function App() {
  // global
  const { isAuthenticated } = useUserState()

  return (
    <HashRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Redirect to="/app/dashboard/test" />}
        />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/dashboard" />}
        />
        <PrivateRoute path="/app" component={Layout} />
        <PublicRoute path="/login" component={Login} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  )

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
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
        render={(props) =>
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
