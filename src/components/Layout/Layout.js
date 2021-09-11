import React from "react";
import {
    Route,
    Switch,
    withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import StorageS3 from "../../pages/storages3";
import Log from "../../pages/log";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";
import Erd from "../../pages/erd";
import DataManageSource from "../../pages/datamanagesource";
import TableManage from "../../pages/tablemanage";
import ApiList from "../../pages/apilist";
import Auth from "../../pages/auth";
import Verify from "../../pages/verify";

// context
import {useLayoutState} from "../../context/LayoutContext";


function Layout(props) {
    const classes = useStyles();

    // global
    const layoutState = useLayoutState();

    return (
        <div className={classes.root}>
            <Header history={props.history}/>
            <Sidebar/>
            <div
                className={classnames(classes.content, {
                    [classes.contentShift]: layoutState.isSidebarOpened,
                })}
            >
                <div className={classes.fakeToolbar}/>
                <Switch>
                    <Route exact path="/app/dashboard"/>
                    <Route path="/app/dashboard/test" component={Dashboard}/>
                    <Route path="/app/dashboard/storage" component={StorageS3}/>
                    <Route path="/app/dashboard/log" component={Log}/>
                    <Route path="/app/dashboard/erd" component={Erd}/>
                    <Route exact path="/app/data-management"/>
                    <Route path="/app/data-management/data-source" component={DataManageSource}/>
                    <Route path="/app/data-management/table-management" component={TableManage}/>
                    <Route path="/app/data-management/api-list" component={ApiList}/>
                    <Route path="/app/data-management/auth" component={Auth}/>
                    <Route path="/app/data-management/verify" component={Verify}/>
                    <Route path="/app/typography" component={Typography}/>
                    <Route path="/app/tables" component={Tables}/>
                    <Route path="/app/notifications" component={Notifications}/>
                    <Route exact path="/app/ui"/>
                    <Route path="/app/ui/maps" component={Maps}/>
                    <Route path="/app/ui/icons" component={Icons}/>
                    <Route path="/app/ui/charts" component={Charts}/>
                </Switch>
            </div>
        </div>
    );
}

export default withRouter(Layout);
