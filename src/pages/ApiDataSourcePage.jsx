import { Alert, Button, Grid, Paper, TextField } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { Select } from '../components/common'
import API from '../server/api'

const ApiDataSourcePage = () => {
  const { isLoading, data: databaseTypes } = useQuery('databaseTypes', API.getResourceDBType)

  return <>
    {!isLoading && <WorkSpaceCreator databaseTypes={databaseTypes || []} />}
  </>
}

const WorkSpaceCreator = ({ databaseTypes }) => {
  const [dataSrcType, setDataSrcType] = useState('new')
  const [isAlertShow, setIsAlertShow] = useState(false)

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      workspace: "",
      databaseName: "",
      databaseType: databaseTypes[0]?.key || '',
      endpoint: "",
      port: "",
      username: "",
      password: "",
    }
  })

  const submit = handleSubmit((value) =>
    API.postResourceMysql({ ...value, dataSrcType })
      .then(() => {
        setIsAlertShow(true)
        reset()
      })
      .finally(() => setTimeout(() => setIsAlertShow(false), 3000))
  )

  return (
    <Paper>
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

        {dataSrcType === 'existed' && (
          <Grid item container sx={{ paddingTop: 2 }} columnSpacing={2} md={12}>
            <Grid item md={2}>
              <TextField {...register("databaseName", { required: true })} label="Database Name" fullWidth />
            </Grid>
            <Grid item md={2}>
              <Controller
                control={control}
                name="databaseType"
                render={({ field: { value, onChange } }) => (
                  <Select
                    disabled
                    label="Type" variant="filled"
                    options={databaseTypes.map(type => ({ value: type.key, name: type.name }))}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Grid>
            <Grid item md={3}>
              <TextField {...register("endpoint", { required: true })} label="Endpoint" fullWidth />
            </Grid>
            <Grid item md={1}>
              <TextField {...register("port", { required: true })} label="Port" fullWidth />
            </Grid>
            <Grid item md={2}>
              <TextField {...register("username", { required: true })} label="Username" fullWidth />
            </Grid>
            <Grid item md={2}>
              <TextField {...register("password", { required: true })} label="Password" fullWidth />
            </Grid>
          </Grid>
        )}
      </Grid>

      {isAlertShow && <Alert severity="success">Success</Alert>}
    </Paper>
  )
}

export default ApiDataSourcePage