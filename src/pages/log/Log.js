import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"
import API from "../../server/api";
import {Button, Grid} from "@material-ui/core";
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import {Typography} from "../../components/Wrappers";
import useStyles from "../dashboard/styles";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Log = (props) => {
    const utcDate = new Date();
    const [startDate, setStartDate] = useState(utcDate);
    const [endDate, setEndDate] = useState(utcDate);
    const [logsData, setLogsData] = useState({
        request_count: 0,
        request_total: 0,
        response_seconds: 0.0,
        response_total: 0
    })
    const classes = useStyles();

    const startDataChangeHandle = (date) => {
        setStartDate(date);
    };

    const endDataChangeHandle = (date) => {
        setEndDate(date);
    };

    const searchLogsHandle = (e) => {
        const st = moment(new Date(startDate)).utc().format("YYYY-MM-DDThh:mm:ss[Z]");
        const et = moment(new Date(endDate)).utc().format("YYYY-MM-DDThh:mm:ss[Z]");
        const params = {start_time: st, end_time: et}
        console.log(params)
        API.getLogsMetrics(params).then(data => {
            console.log(data)
            setLogsData(data)
            toast('Toast Message')
        })
    }

    useEffect(() => {
        //componentDidMount 及 componentDidUpdate
        console.log(`更新後的 State ${logsData}`)
    })

    useEffect(() => {
        //componentDidUpdate 及 componentWillUnmount
        return (() => {
            console.log(`更新前的 State ${logsData}`)
        })
    })

    return (
        <>
            <PageTitle title="LOG"
                       button={<Button variant="contained" size="medium" color="secondary" onClick={searchLogsHandle}>Latest
                           Reports</Button>}/>
            <ToastContainer />
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
