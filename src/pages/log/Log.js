import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import moment from "moment"
import API from "../../server/api";
import {Button, Grid} from "@material-ui/core";
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import {Typography} from "../../components/Wrappers";
import useStyles from "../dashboard/styles";
import {Select} from "antd";
import "antd/dist/antd.css";
import "react-datepicker/dist/react-datepicker.css";
import {useUserDispatch, signOut} from "../../context/UserContext";
import MUIDataTable from "mui-datatables";

const diffDays = (days) => {
    let result = new Date();
    result.setDate(result.getDate() - days);
    return result;
}

const Log = (props) => {
    const Option = Select.Option;
    const nowDate = new Date();
    const difDate = diffDays(10);
    const resourceData = [{id: '0', name: "請選擇"}];
    const subdomainData = [{id: '0', name: "請選擇"}];
    const userDispatch = useUserDispatch();
    const [startDate, setStartDate] = useState(difDate);
    const [endDate, setEndDate] = useState(nowDate);
    const [startStrDate, setStartStrDate] = useState(moment(new Date(difDate)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"));
    const [endStrDate, setEndStrDate] = useState(moment(new Date(nowDate)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"));
    const [metricsData, setMetricsData] = useState({
        request_count: 0,
        request_total: 0,
        response_seconds: 0.0,
        response_total: 0
    });
    const [logsData, setLogsData] = useState([])
    const [resources, setResources] = useState(resourceData);
    const [subdomain, setSubDomainData] = useState(subdomainData);
    const [selectSubdomain, setSelectSubdomain] = useState()
    const classes = useStyles();
    const history = props.history

    const startDataChangeHandle = (date) => {
        setStartDate(date);
        setStartStrDate(moment(new Date(date)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"));
    };

    const endDataChangeHandle = (date) => {
        setEndDate(date);
        setEndStrDate(moment(new Date(date)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"));
    };

    const searchLogsHandle = (e) => {
        API.getLogsMetrics({start_time: startStrDate, end_time: endStrDate})
            .then(metrics => {
                setMetricsData(metrics)
            });

        API.getLogs({subdomain_name: selectSubdomain, type: 'request', start_time: startStrDate, end_time: endStrDate})
            .then((Logs) => {
                if (Logs.error === 401) {
                    signOut(userDispatch, history)
                } else {
                    setLogsData(Logs.logs)
                }
            });
    }

    const resourcesChangeHandle = (e) => {
        console.log(e)
    };

    const subdomainChangeHandle = (value) => {
        setSelectSubdomain(value);
    };

    useEffect(() => {
        console.log(`useEffect只執行一次`)
        Promise.all([
            API.getLogsMetrics({start_time: startStrDate, end_time: endStrDate}),
            API.getResourcesMysql({page: 1, per_page: 10}),
            API.getResourcesSubdomain({page: 1, per_page: 10}),
        ]).then(([Metrics, ResourcesMysql, ResourcesSubdomain]) => {
            if (Metrics.error === 401 || ResourcesMysql.error === 401 || ResourcesSubdomain.error === 401) {
                signOut(userDispatch, history)
            } else {
                ResourcesMysql.resources.map(arr => {
                    resourceData.push({id: arr.id, name: arr.name})
                })
                ResourcesSubdomain.resources.map(arr => {
                    subdomainData.push({id: arr.id, name: arr.name})
                })
                setMetricsData(Metrics)
                setResources(resourceData);
                setSubDomainData(subdomainData)
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [])

    return (
        <>
            <PageTitle title="LOG"
                       button={<Button variant="contained" size="medium" color="secondary" onClick={searchLogsHandle}>Latest
                           Reports</Button>}/>

            <Select defaultValue={resources[0].name} style={{width: 120}} onChange={resourcesChangeHandle}>
                {resources.map(resData => (
                    <Option key={resData.id} value={resData.name}>{resData.name}</Option>
                ))}
            </Select>
            <Select defaultValue={subdomain[0].name} style={{width: 120}} onChange={subdomainChangeHandle}>
                {subdomain.map(subData => (
                    <Option key={subData.id} value={subData.name}>{subData.name}</Option>
                ))}
            </Select>
            <DatePicker
                showTimeSelect
                selected={startDate}
                onChange={startDataChangeHandle}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy/MM/d h:mm aa"
            />
            <DatePicker
                showTimeSelect
                selected={endDate}
                onChange={endDataChangeHandle}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="yyyy/MM/d h:mm aa"
            />
            <Grid container spacing={4}>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Widget
                        title="Request Count"
                        upperTitle
                        bodyClass={classes.fullHeightBody}
                        className={classes.card}
                    >
                        <div className={classes.visitsNumberContainer}>
                            <Grid container item alignItems={"center"}>
                                <Grid item xs={6}>
                                    <Typography size="xl" weight="medium" noWrap>
                                        {metricsData.request_count}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Widget>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Widget
                        title="Request Total"
                        upperTitle
                        bodyClass={classes.fullHeightBody}
                        className={classes.card}
                    >
                        <div className={classes.visitsNumberContainer}>
                            <Grid container item alignItems={"center"}>
                                <Grid item xs={6}>
                                    <Typography size="xl" weight="medium" noWrap>
                                        {metricsData.request_total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Widget>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Widget
                        title="Response Total Seconds"
                        upperTitle
                        bodyClass={classes.fullHeightBody}
                        className={classes.card}
                    >
                        <div className={classes.visitsNumberContainer}>
                            <Grid container item alignItems={"center"}>
                                <Grid item xs={6}>
                                    <Typography size="xl" weight="medium" noWrap>
                                        {metricsData.response_seconds}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Widget>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Widget
                        title="Response Count Total"
                        upperTitle
                        bodyClass={classes.fullHeightBody}
                        className={classes.card}
                    >
                        <div className={classes.visitsNumberContainer}>
                            <Grid container item alignItems={"center"}>
                                <Grid item xs={6}>
                                    <Typography size="xl" weight="medium" noWrap>
                                        {metricsData.response_total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Widget>
                </Grid>
                <Grid item xs={12}>
                    <MUIDataTable
                        title="Log List"
                        data={logsData}
                        columns={["api_response_time", "host", "ip", "level", "message", "method", "post_body", "query_string", "request_length", "response_length", "type", "uri"]}
                        options={{
                            filterType: "checkbox",
                        }}
                    />
                </Grid>
            </Grid>

        </>
    )
}

export default Log
