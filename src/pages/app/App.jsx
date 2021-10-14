import React from "react"
import { Route, Switch, withRouter } from "react-router-dom"
import classnames from "classnames"
import useStyles from "./styles"
import {
  DashboardPage,
  StorageS3Page,
  LogPage,
  TypographyPage,
  NotificationsPage,
  MapsPage,
  TablesPage,
  IconsPage,
  ChartsPage,
  ErdPage,
  DataManageSourcePage,
  TableManagePage,
  ApiListPage,
  AuthPage,
  VerifyPagePage,
  DomainPage,
  DataTableListPage,
  DataModulePage,
  MarketplacePage,
  UseMarketplacePage,
} from "../pages"
import { Header, Sidebar } from "../../components"

// context
import { useLayoutState } from "../../contexts/LayoutContext"

const routes = [
  { path: "/app/dashboard", exact: true },
  { path: "/app/dashboard/test", component: DashboardPage },
  { path: "/app/dashboard/storage", component: StorageS3Page },
  { path: "/app/dashboard/log", component: LogPage },
  { path: "/app/dashboard/erd", component: ErdPage },

  { path: "/app/api-management", exact: true },
  { path: "/app/api-management/data-source", component: DataManageSourcePage },
  { path: "/app/api-management/table-management", component: TableManagePage },
  { path: "/app/api-management/api-list", component: ApiListPage },
  { path: "/app/api-management/auth", component: AuthPage },
  { path: "/app/api-management/verify", component: VerifyPagePage },

  { path: "/app/domain-management", exact: true },
  { path: "/app/domain-management/create", component: DomainPage },

  { path: "/app/data-management", exact: true },
  { path: "/app/data-management/table-list", component: DataTableListPage },
  { path: "/app/data-management/module-list", component: DataModulePage },

  { path: "/app/marketplace", exact: true },
  { path: "/app/marketplace/use-list", component: UseMarketplacePage },
  { path: "/app/marketplace/module-list", component: MarketplacePage },

  { path: "/app/typography", component: TypographyPage },
  { path: "/app/tables", component: TablesPage },
  { path: "/app/notifications", component: NotificationsPage },

  { path: "/app/ui", exact: true },
  { path: "/app/ui/maps", component: MapsPage },
  { path: "/app/ui/icons", component: IconsPage },
  { path: "/app/ui/charts", component: ChartsPage },
]

function Layout(props) {
  const classes = useStyles()

  // global
  const layoutState = useLayoutState()

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        <Switch>
          {routes.map((route) => (
            <Route {...route} />
          ))}
        </Switch>
      </div>
    </div>
  )
}

export default withRouter(Layout)
