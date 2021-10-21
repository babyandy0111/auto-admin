import { useState } from 'react'
import { Select } from '../components/basic'
import { Button, Table, TextField, Grid, Paper } from '@mui/material'
import { useForm } from 'react-hook-form'
import API from '../server/api'


const ApiDataSourcePage = () => {

  return <>
    <WorkSpaceCreator />
    <Table />
  </>
}

const WorkSpaceCreator = () => {
  const [dataSrcType, setDataSrcType] = useState('new')
  const { register, handleSubmit } = useForm({
    defaultValue: {
      workspace: "",
      databaseName: "abc",
      endpoint: "127.0.0.1",
      port: "3306",
      username: "wen",
      password: "123456",
    }
  })

  const submit = handleSubmit((value) => API.postResourceMysql({ ...value, dataSrcType }))

  return <Paper>
    <Grid container columnSpacing={2} padding={3}>
      <Grid item md={2}>
        <Select label="Add Data Source" variant="filled" value={dataSrcType} onChange={value => setDataSrcType(value)} options={[{
          value: "new",
          name: 'Create'
        }, {
          value: "existed",
          name: 'Connect'
        }]} />
      </Grid>
      <Grid item md={4}>
        <TextField  {...register("workspace", { required: true })} label="Workspace" fullWidth />
      </Grid>
      <Grid item md={1}>
        <Button onClick={submit} sx={{ height: "100%" }} variant="contained" size="large" fullWidth>
          {dataSrcType === 'new' && 'Generate'}
          {dataSrcType === 'existed' && 'Connect'}
        </Button>
      </Grid>
      {dataSrcType === 'existed' && (<Grid item container sx={{ paddingTop: 2 }} columnSpacing={2} md={12}>
        <Grid item md={2}><TextField {...register("databaseName", { required: true })} label="Database Name" fullWidth /></Grid>
        <Grid item md={2}>
          <Select label="Type" variant="filled" value={"mysql"} options={[{
            value: "mysql",
            name: 'MySQL'
          }, {
            value: "mariadb",
            name: 'MariaDB'
          }]} />
        </Grid>
        <Grid item md={3}><TextField {...register("endpoint", { required: true })} label="Endpoint" fullWidth /></Grid>
        <Grid item md={1}><TextField {...register("port", { required: true })} label="Port" fullWidth /></Grid>
        <Grid item md={2}><TextField {...register("username", { required: true })} label="Username" fullWidth /></Grid>
        <Grid item md={2}><TextField {...register("password", { required: true })} label="Password" fullWidth /></Grid>
      </Grid>)}
    </Grid>
  </Paper>
}

export default ApiDataSourcePage