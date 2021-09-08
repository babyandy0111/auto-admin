import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import moment from "moment"
import API from "../../server/api";
import {Button, Grid} from "@material-ui/core";
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import {Typography} from "../../components/Wrappers";
import useStyles from "../dashboard/styles";
import {ToastContainer} from "react-toastify";
import {Select} from "antd";
import 'react-toastify/dist/ReactToastify.css';
import "antd/dist/antd.css";
import "react-datepicker/dist/react-datepicker.css";

const metrics = {
    request_count: 0,
    request_total: 0,
    response_seconds: 0.0,
    response_total: 0
}
const resourceData = [{id: '0', name: "請選擇"}];
const subdomainData = [{id: '0', name: "請選擇"}];

const Log = (props) => {
    const Option = Select.Option;
    const nowDate = new Date();
    const [startDate, setStartDate] = useState(nowDate);
    const [endDate, setEndDate] = useState(nowDate);
    const [startStrDate, setStartStrDate] = useState(moment(new Date(nowDate)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"));
    const [endStrDate, setEndStrDate] = useState(moment(new Date(nowDate)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"));
    const [logsData, setLogsData] = useState(metrics)
    const [resources, setResources] = useState(resourceData);
    const [subdomain, setSubDomainData] = useState(subdomainData);
    const classes = useStyles();

    const startDataChangeHandle = (date) => {
        setStartDate(date);
        setStartStrDate(moment(new Date(date)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"));
    };

    const endDataChangeHandle = (date) => {
        setEndDate(date);
        setEndStrDate(moment(new Date(date)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"));
    };

    const searchLogsHandle = (e) => {
        API.getLogsMetrics({start_time: startStrDate, end_time: endStrDate}).then(data => {
            setLogsData(data)
        })
    }

    const resourcesChangeHandle = value => {
        console.log(value)
    };

    const subdomainChangeHandle = value => {
        console.log(value)
    };

    useEffect(() => {
        console.log(`useEffect只執行一次`)
        Promise.all([
            API.getLogsMetrics({start_time: startStrDate, end_time: endStrDate}),
            API.getResourcesMysql({page: 1, per_page: 10}),
            API.getResourcesSubdomain({page: 1, per_page: 10})
        ]).then(([LogsMetrics, ResourcesMysql, ResourcesSubdomain]) => {
            ResourcesMysql.resources.map(arr => {
                resourceData.push({id: arr.id, name: arr.name})
            })
            ResourcesSubdomain.resources.map(arr => {
                subdomainData.push({id: arr.id, name: arr.name})
            })
            setLogsData(LogsMetrics)
            setResources(resourceData);
            setSubDomainData(subdomainData)
        }).catch((err) => {
            console.log(err);
        });
    }, [])

    return (
        <>
            <PageTitle title="LOG"
                       button={<Button variant="contained" size="medium" color="secondary" onClick={searchLogsHandle}>Latest
                           Reports</Button>}/>
            <ToastContainer/>
            <Select defaultValue={resources[0].name} style={{width: 120}} onChange={resourcesChangeHandle}>
                {resources.map(resData => (
                    <Option key={resData.id}>{resData.name}</Option>
                ))}
            </Select>
            <Select defaultValue={subdomain[0].name} style={{width: 120}} onChange={subdomainChangeHandle}>
                {subdomain.map(resData => (
                    <Option key={resData.id}>{resData.name}</Option>
                ))}
            </Select>
            <div>
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
            </div>

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
                                        {logsData.request_count}
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
                                        {logsData.request_total}
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
                                        {logsData.response_seconds}
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
                                        {logsData.response_total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Widget>
                </Grid>
            </Grid>

        </>
    )
}

export default Log
