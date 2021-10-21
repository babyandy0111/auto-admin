import { useState } from 'react'
import { Select } from '../components/basic'
import { Button, Table, TextField, Grid, Paper } from '@mui/material'
import { useForm } from 'react-hook-form'


const ApiDataSourcePage = () => {


  return <>
    <WorkSpaceCreator />
    <Table />
  </>
}

const WorkSpaceCreator = () => {
  const [dataSrcType, setDataSrcType] = useState('new')

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
        <TextField label="Workspace" fullWidth />
      </Grid>
      <Grid item md={1}>
        <Button sx={{ height: "100%" }} variant="contained" size="large" fullWidth>
          {dataSrcType === 'new' && 'Generate'}
          {dataSrcType === 'existed' && 'connect'}
        </Button>
      </Grid>
      {dataSrcType === 'existed' && (<Grid item container sx={{ paddingTop: 2 }} columnSpacing={2} md={12}>
        <Grid item md={2}><TextField label="Database Name" fullWidth /></Grid>
        <Grid item md={2}>
          <Select label="Type" variant="filled" value={"mysql"} options={[{
            value: "mysql",
            name: 'MySQL'
          }, {
            value: "mariadb",
            name: 'MariaDB'
          }]} />
        </Grid>
        <Grid item md={3}><TextField label="Endpoint" fullWidth /></Grid>
        <Grid item md={1}><TextField label="Port" fullWidth /></Grid>
        <Grid item md={2}><TextField label="Username" fullWidth /></Grid>
        <Grid item md={2}><TextField label="Password" fullWidth /></Grid>
      </Grid>)}
    </Grid>
  </Paper>
}

export default ApiDataSourcePage