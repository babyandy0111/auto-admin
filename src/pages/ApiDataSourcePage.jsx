import { LoadingButton } from '@mui/lab'
import { Alert, Button, Grid, Paper, TextField } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { DataSourceTable, Select } from '../components/common'
import { useDatabaseTest } from '../hooks'
import API from '../server/api'

const ApiDataSourcePage = () => {
  const { isLoading, data: databaseTypes } = useQuery('databaseTypes', API.getResourceDBType)
  const { data: dataResource, refetch } = useQuery('dataResource', API.getResourceMysql)
  const { t } = useTranslation(["api"])

  return <>
    <Grid container spacing={2}>
      <Grid item md={12}>
        {!isLoading && <WorkSpaceCreator databaseTypes={databaseTypes || []} onRefetch={refetch} />}
      </Grid>
      <Grid item md={12}>
        <DataSourceTable
          columns={
            [
              {
                title: t('table.workspaceName'),
              },
              {
                title: t('table.databaseType'),
              },
              {
                title: t('table.createTime'),
              },
              {
                title: t('table.updateTime'),
              },
              {
                title: t('table.isSelfConnect'),
              }
            ]
          }
          data={dataResource || []}
          onRefetch={refetch}
          onDelete={id => API.deleteResourceMysql(id).then(refetch)}
        />
      </Grid>
    </Grid>
  </>
}

const WorkSpaceCreator = ({ databaseTypes, onRefetch }) => {
  const { t } = useTranslation(["api", "common"])
  const { register, control, handleSubmit, watch, getValues, reset } = useForm({
    defaultValues: {
      databaseName: "",
      endpoint: "",
      port: "",
      username: "",
      password: "",
    }
  })
  const [dataSrcType, setDataSrcType] = useState('new')
  const [isAlertShow, setIsAlertShow] = useState(false)

  const { test, status } = useDatabaseTest(getValues, watch)

  const submit = handleSubmit((value) =>
    API.postResourceMysql({ ...value, dataSrcType })
      .then(() => {
        setIsAlertShow(true)
        onRefetch?.()
        reset()
      })
      .finally(() => setTimeout(() => setIsAlertShow(false), 3000))
  )

  return (
    <Paper>
      <Grid container columnSpacing={2} padding={3}>
        <Grid item md={4}>
          <TextField  {...register("workspace", { required: true })} label={t('label.workspace')} fullWidth />
        </Grid>
        <Grid item md={2}>
          <Select
            variant="filled"
            label={t('label.dataSourceAdd')}
            options={[{
              value: "new",
              name: t('interface.createDatabase')
            }, {
              value: "existed",
              name: t('interface.connectDatabase')
            }]}
            value={dataSrcType}
            onChange={e => setDataSrcType(e.target.value)}
          />
        </Grid>
        <Grid item md={1}>
          {dataSrcType === "existed" && status !== 'success' && (
            <LoadingButton
              variant="outlined" size="large" fullWidth
              color={status === 'fail' ? 'error' : undefined}
              loading={status === "loading"}
              onClick={test}
              sx={{ height: "100%" }}
            >
              {t('interface.test')}
            </LoadingButton>
          )}
          {(dataSrcType === "new" || (dataSrcType === "existed" && status === 'success')) && <Button onClick={submit} sx={{ height: "100%" }} variant="contained" size="large" fullWidth>
            {t('interface.create')}
          </Button>}
        </Grid>

        {dataSrcType === 'existed' && (
          <Grid item container sx={{ paddingTop: 2 }} columnSpacing={2} md={12}>
            <Grid item md={2}>
              <TextField {...register("databaseName", { required: true })} label={t('label.databaseName')} fullWidth />
            </Grid>
            <Grid item md={2}>
              <Controller
                control={control}
                name="databaseType"
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={t('label.databaseType')} variant="filled"
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

      {isAlertShow && <Alert severity="success">{t("common:status.success")}</Alert>}
    </Paper>
  )
}

export default ApiDataSourcePage