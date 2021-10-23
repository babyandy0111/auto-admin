import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@material-ui/styles"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { LayoutProvider } from "./contexts/LayoutContext"
import { UserProvider } from "./contexts/UserContext"
import * as serviceWorker from "./serviceWorker"
import Themes from "./themes"
import { QueryClient, QueryClientProvider } from "react-query"
import "./i18n"

const queryClient = new QueryClient()

ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={Themes.default}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </UserProvider>
  </LayoutProvider>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
