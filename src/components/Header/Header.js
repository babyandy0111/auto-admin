import React, {useState} from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    InputBase,
    Menu,
    MenuItem,
    Fab,
    Link
} from "@material-ui/core";
import {
    Menu as MenuIcon,
    MailOutline as MailIcon,
    NotificationsNone as NotificationsIcon,
    Person as AccountIcon,
    Search as SearchIcon,
    Send as SendIcon,
    ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import {Badge, Typography, Button} from "../Wrappers";
import Notification from "../Notification/Notification";
import UserAvatar from "../UserAvatar/UserAvatar";

// context
import {
    useLayoutState,
    useLayoutDispatch,
    toggleSidebar,
} from "../../context/LayoutContext";
import {useUserDispatch, signOut} from "../../context/UserContext";

export default function Header(props) {
    let classes = useStyles();

    // global
    const layoutState = useLayoutState();
    const layoutDispatch = useLayoutDispatch();
    const userDispatch = useUserDispatch();

    // local
    const [profileMenu, setProfileMenu] = useState(null);

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    color="inherit"
                    onClick={() => toggleSidebar(layoutDispatch)}
                    className={classNames(
                        classes.headerMenuButtonSandwich,
                        classes.headerMenuButtonCollapse,
                    )}
                >
                    {layoutState.isSidebarOpened ? (
                        <ArrowBackIcon
                            classes={{
                                root: classNames(
                                    classes.headerIcon,
                                    classes.headerIconCollapse,
                                ),
                            }}
                        />
                    ) : (
                        <MenuIcon
                            classes={{
                                root: classNames(
                                    classes.headerIcon,
                                    classes.headerIconCollapse,
                                ),
                            }}
                        />
                    )}
                </IconButton>
                <Typography variant="h6" weight="medium" className={classes.logotype}>
                    CodeGenApps
                </Typography>
                <div className={classes.grow}/>

                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.headerMenuButton}
                    aria-controls="profile-menu"
                    onClick={e => setProfileMenu(e.currentTarget)}
                >
                    <AccountIcon classes={{root: classes.headerIcon}}/>
                </IconButton>
                <Menu
                    id="profile-menu"
                    open={Boolean(profileMenu)}
                    anchorEl={profileMenu}
                    onClose={() => setProfileMenu(null)}
                    className={classes.headerMenu}
                    classes={{paper: classes.profileMenu}}
                    disableAutoFocusItem
                >
                    <div className={classes.profileMenuUser}>
                        <Typography variant="h4" weight="medium">
                            John Smith
                        </Typography>
                    </div>
                    <MenuItem
                        className={classNames(
                            classes.profileMenuItem,
                            classes.headerMenuItem,
                        )}
                    >
                        <AccountIcon className={classes.profileMenuIcon}/> Profile
                    </MenuItem>
                    <div className={classes.profileMenuUser}>
                        <Typography
                            className={classes.profileMenuLink}
                            color="primary"
                            onClick={() => signOut(userDispatch, props.history)}
                        >
                            Sign Out
                        </Typography>
                    </div>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
