import React, { useState, useEffect, useRef } from "react"
import DatePicker from "react-datepicker"
import moment from "moment"
import API from "../../server/api"
import { Button, Grid } from "@material-ui/core"
import PageTitle from "../../components/PageTitle"
import Widget from "../../components/Widget"
import { Typography } from "../../components/Wrappers"
import useStyles from "../dashboard/styles"
import "react-datepicker/dist/react-datepicker.css"
import MUIDataTable from "mui-datatables"
import { WorkSpaceProvider } from "../../context/WorkSpaceContext"
import { diffDays, getUTCDate } from "../../utils/formatTime"

const Log = (props) => {
  const nowDate = new Date()
  const difDate = diffDays(10)
  const [startDate, setStartDate] = useState(difDate)
  const [endDate, setEndDate] = useState(nowDate)
  const [startStrDate, setStartStrDate] = useState(getUTCDate(difDate))
  const [endStrDate, setEndStrDate] = useState(getUTCDate(nowDate))
  const [metricsData, setMetricsData] = useState({
    request_count: 0,
    request_total: 0,
    response_seconds: 0.0,
    response_total: 0,
  })
  const logsDataFromAPI = []
  const [logsData, setLogsData] = useState([])
  const classes = useStyles()
  const childRef = useRef()

  const startDataChangeHandle = (date) => {
    setStartDate(date)
    setStartStrDate(
      moment(new Date(date)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"),
    )
  }

  const endDataChangeHandle = (date) => {
    setEndDate(date)
    setEndStrDate(moment(new Date(date)).utc().format("YYYY-MM-DDThh:mm:ss[Z]"))
  }

  const searchLogsHandle = (e) => {
    API.getLogsMetrics({ start_time: startStrDate, end_time: endStrDate }).then(
      (res) => {
        setMetricsData(res.data)
      },
    )
    let subdomainValue = childRef.current.getSubdomainValue()
    // let resourceValue = childRef.current.getResourceValue();
    // console.log(subdomainValue, resourceValue)
    fetchLogsData("", subdomainValue)
  }

  const fetchLogsData = function (next_token, domain) {
    API.getLogs({
      subdomain_name: domain,
      type: "request",
      start_time: startStrDate,
      end_time: endStrDate,
      next_token: next_token,
    }).then((res) => {
      for (let i = 0; i < res.data.logs.length; i++) {
        logsDataFromAPI.push(res.data.logs[i])
      }

      if (res.data.next_token !== "") {
        fetchLogsData(res.data.next_token, domain)
      } else {
        setLogsData(logsDataFromAPI)
      }
    })
  }

  useEffect(() => {
    console.log(`useEffect只執行一次`)
  }, [])

  return (
    <>
      <PageTitle
        title="API LOG"
        button={
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            onClick={searchLogsHandle}
          >
            ReFresh
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item>
          <DatePicker
            showTimeSelect
            selected={startDate}
            onChange={startDataChangeHandle}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy/MM/d h:mm aa"
          />
        </Grid>
        <Grid item>
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
        </Grid>
        <Grid item>
          <WorkSpaceProvider props={props} cRef={childRef} />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Widget
            title="Request Count"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
            disableWidgetMenu
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
            disableWidgetMenu
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
            disableWidgetMenu
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
            disableWidgetMenu
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
            columns={[
              "api_response_time",
              "host",
              "ip",
              "level",
              "message",
              "method",
              "post_body",
              "query_string",
              "request_length",
              "response_length",
              "type",
              "uri",
            ]}
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
