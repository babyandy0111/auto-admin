import React, { useState, useEffect } from "react"
import { Drawer, IconButton, List } from "@material-ui/core"
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  TableChart,
  Domain as DomainIcon,
  FileCopy as FileCopyIcon,
} from "@mui/icons-material"
import { useTheme } from "@material-ui/styles"
import { withRouter } from "react-router-dom"
import classNames from "classnames"

// styles
import useStyles from "./styles"

// components
import SidebarLink from "./components/SidebarLink/SidebarLink"
// import Dot from "./components/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../contexts/LayoutContext"

const structure = [
  {
    id: 0,
    label: "Dashboard",
    link: "/app/dashboard",
    icon: <HomeIcon />,
    children: [
      { label: "API LOG", link: "/app/dashboard/log" },
      { label: "Storage", link: "/app/dashboard/storage" },
      { label: "Erd", link: "/app/dashboard/erd" },
    ],
  },
  {
    id: 1,
    label: "API Management",
    link: "/app/data-management",
    icon: <TableChart />,
    children: [
      { label: "Data Source", link: "/app/api-management/data-source" },
      { label: "Table Manage", link: "/app/api-management/table-management" },
      { label: "API List", link: "/app/api-management/api-list" },
      { label: "Authentication", link: "/app/api-management/auth" },
      { label: "Verification", link: "/app/api-management/verify" },
    ],
  },
  {
    id: 2,
    label: "Domain Management",
    link: "/app/domain-management",
    icon: <DomainIcon />,
    children: [
      { label: "Create Domain", link: "/app/domain-management/create" },
    ],
  },
  {
    id: 3,
    label: "Data Management",
    link: "/app/data-management",
    icon: <FileCopyIcon />,
    children: [
      { label: "Table List", link: "/app/data-management/table-list" },
      { label: "Data Module", link: "/app/data-management/module-list" },
    ],
  },
  {
    id: 4,
    label: "Marketplace",
    link: "/app/marketplace",
    icon: <ShoppingCartIcon />,
    children: [
      { label: "Use Module", link: "/app/marketplace/use-list" },
      { label: "Module List", link: "/app/marketplace/module-list" },
    ],
  },
  {
    id: 20,
    label: "Tables",
    link: "/app/tables",
    icon: <TableIcon />,
  },
  {
    id: 30,
    label: "Notifications",
    link: "/app/notifications",
    icon: <NotificationsIcon />,
  },
  {
    id: 40,
    label: "UI Elements",
    link: "/app/ui",
    icon: <UIElementsIcon />,
    children: [
      {
        label: "Icons",
        link: "/app/ui/icons",
      },
      {
        label: "Charts",
        link: "/app/ui/charts",
      },
      {
        label: "Maps",
        link: "/app/ui/maps",
      },
    ],
  },
  {
    id: 50,
    type: "divider",
  },
  // {
  //     id: 6,
  //     type: "title",
  //     label: "HELP"
  // },
  {
    id: 15,
    label: "Typography",
    link: "/app/typography",
    icon: <TypographyIcon />,
  },
]

function Sidebar({ location }) {
  const classes = useStyles()
  const theme = useTheme()

  // global
  const { isSidebarOpened } = useLayoutState()
  const layoutDispatch = useLayoutDispatch()

  // local
  const [isPermanent, setPermanent] = useState(true)

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange)
    handleWindowWidthChange()
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange)
    }
  })

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map((link) => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  )

  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth
    const breakpointWidth = theme.breakpoints.values.md
    const isSmallScreen = windowWidth < breakpointWidth

    if (isSmallScreen && isPermanent) {
      setPermanent(false)
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true)
    }
  }
}

export default withRouter(Sidebar)
