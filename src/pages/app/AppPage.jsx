import {
  AppBar,
  Box, Collapse,
  Divider,
  Drawer,
  IconButton,
  List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar,
  Tooltip,
  Typography
} from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"
import { flatten } from 'ramda'
import { useState } from "react"
import { Link, Route, Switch } from "react-router-dom"
import {
  ApiIcon, ChevronLeftIcon,
  ChevronRightIcon, ExpandLessIcon,
  ExpandMoreIcon, MenuIcon,
  AddIcon, StorageIcon
} from '../../images/icons'
import {
  ApiCreatePage, ApiListPage,
  ApiDataSourcePage,
  AuthPage, DashboardPage,
  DataModulePage,
  DataTableListPage,
  DomainPage,
  ErdPage,
  MarketplacePage,
  UseMarketplacePage,
  VerifyPagePage
} from "../pages"
const AppPage = () => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const appRoutes = [
    {
      rootPath: "/app/api-management",
      leafPaths: [
        { path: "/data-source", component: ApiDataSourcePage },
        { path: "/create", component: ApiCreatePage },
        { path: "/api-list", component: ApiListPage },
        { path: "/auth", component: AuthPage },
        { path: "/verify", component: VerifyPagePage },
      ]
    },
    {
      rootPath: "/app/domain-management",
      leafPaths: [
        { path: "/create", component: DomainPage },
      ]
    },
    {
      rootPath: "/app/data-management",
      leafPaths: [
        { path: "/table-list", component: DataTableListPage },
        { path: "/module-list", component: DataModulePage }
      ]
    },
    {
      rootPath: "/app/dashboard",
      leafPaths: [
        { path: "/test", component: DashboardPage },
        { path: "/erd", component: ErdPage },
      ]
    },
    {
      rootPath: "/app/marketplace",
      leafPaths: [
        { path: "/use-list", component: UseMarketplacePage },
        { path: "/module-list", component: MarketplacePage }
      ]
    },
    {
      rootPath: "/app/marketplace",
      leafPaths: [
        { path: "/use-list", component: UseMarketplacePage },
        { path: "/module-list", component: MarketplacePage }
      ]
    },
    {
      rootPath: "/app/marketplace",
      leafPaths: [
        { path: "/use-list", component: UseMarketplacePage },
        { path: "/module-list", component: MarketplacePage }
      ]
    },
    { rootPath: "/app/marketplace" },
  ]


  const routes = flatten(appRoutes.map(appRoute => [
    {
      path: appRoute.rootPath,
      exact: true,
    },
    ...(appRoute.leafPaths || []).map(({ path, component }) => ({
      path: `${appRoute.rootPath}${path}`,
      component
    }))
  ]
  ))

  return (
    <Box sx={{ display: "flex" }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            CodeGenApps
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Sidebar />

      </StyledDrawer>
      <Box component='main' mt={8} sx={{ flexGrow: 1, p: 3 }}>
        <Switch>
          {routes.map(
            ({ path, exact, component }) => <Route key={path} path={path} exact={exact} component={component} />
          )}
        </Switch>
      </Box>
    </Box>
  )
}

const sidebar = [
  {
    text: 'API Management',
    icon: <ApiIcon />,
    path: "/app/api-management",
    routes: [
      { text: 'Data Source', icon: <StorageIcon />, path: "/data-source" },
      // { text: '', path: "/table-management" },
      { text: 'Create API', icon: <AddIcon />, path: "/create" },
      // { text: '', path: "/api-list" },
      // { text: '', path: "/auth" },
      // { text: '', path: "/verify" },
    ]
  },
  // {
  //   text: 'Domain Management',
  //   icon: <SendIcon />,
  //   path: "/app/domain-management",
  //   routes: [
  //     { text: '', path: "/create" },
  //   ]
  // },
  // {
  //   text: 'Data Management',
  //   path: "/app/data-management",
  //   icon: <SendIcon />,
  //   routes: [
  //     { text: '', path: "/table-list" },
  //     { text: '', path: "/module-list" }
  //   ]
  // },
  // {
  //   text: 'Dashboard',
  //   icon: <SendIcon />,
  //   path: "/app/dashboard",
  //   routes: [
  //     { text: '', path: "/test" },
  //     { text: '', path: "/storage" },
  //     { text: '', path: "/log" },
  //     { text: '', path: "/erd" },
  //   ]
  // },
  // {
  //   text: 'Marketplace',
  //   icon: <SendIcon />,
  //   path: "/app/marketplace",
  //   routes: [
  //     { text: '', path: "/use-list" },
  //     { text: '', path: "/module-list" }
  //   ]
  // },
  // {
  //   text: 'Account Management',
  //   path: "/app/marketplace",
  //   icon: <SendIcon />,
  //   routes: [
  //     { text: '', path: "/use-list" },
  //     { text: '', path: "/module-list" }
  //   ]
  // },
  // {
  //   text: 'Billing',
  //   path: "/app/marketplace",
  //   icon: <SendIcon />,
  //   routes: [
  //     { text: '', icon: <StarBorder />, path: "/use-list" },
  //     { text: '', path: "/module-list" }
  //   ]
  // },
  // { text: 'Auto Form', icon: <SendIcon />, path: "/app/marketplace" },
]

function Sidebar() {
  const [active, setActive] = useState(0)

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {sidebar.map((appRoute, i) =>
        <div key={i}>
          <ListItemButton onClick={() => setActive(i)}>
            <Tooltip title={appRoute.text}>
              <ListItemIcon sx={{ color: active === i ? 'primary.main' : null }}>
                {appRoute.icon}
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary={appRoute.text} />
            {appRoute?.routes && (active === i ? <ExpandLessIcon /> : <ExpandMoreIcon />)}

          </ListItemButton>
          {appRoute?.routes && (
            <Collapse in={active === i} timeout="auto" unmountOnExit>
              {appRoute.routes.map(route =>
                <List key={`${appRoute.path}${route.path}`} component="div" disablePadding>
                  <ListItemButton component={Link} to={`${appRoute.path}${route.path}`}>
                    <Tooltip title={`${route.text} / ${appRoute.text}`}>
                      <ListItemIcon sx={{ color: active === i ? 'primary.light' : null }}>
                        {route.icon}
                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary={route.text} />
                  </ListItemButton>
                </List>
              )}
              <Divider />
            </Collapse>
          )}
        </div>
      )}
    </List>
  )
}

const drawerWidth = 280

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(5)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
})

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}))

export default AppPage
