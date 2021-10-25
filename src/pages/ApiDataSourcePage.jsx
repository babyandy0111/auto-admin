import { LoadingButton } from '@mui/lab'
import {
  Alert, Box, Button, Grid, Paper, TextField, Typography
} from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Select } from '../components/common'
import ApiTable from '../components/common/ApiTable'
import Modal from '../components/common/Modal'
import { useDatabaseTest } from '../hooks'
import API from '../server/api'

const ApiDataSourcePage = () => {
  const { isLoading, data: databaseTypes } = useQuery('databaseTypes', API.getResourceDBType)
  const { data: dataResource = [], refetch } = useQuery('dataResource', API.getResourceMysql)
  const { t } = useTranslation(["api"])

  return <>
    <Grid container spacing={2}>
      <Grid item md={12}>
        {!isLoading && <WorkSpaceCreator databaseTypes={databaseTypes || []} onRefetch={refetch} />}
      </Grid>
      <Grid item md={12}>
        <ApiTable
          columns={[
            {
              title: t('table.workspaceName'),
              key: 'workspaceName'
            },
            {
              title: t('table.databaseType'),
              key: "databaseType"
            },
            {
              title: t('table.createTime'),
              key: 'createTime'
            },
            {
              title: t('table.updateTime'),
              key: 'updateTime'
            },
            {
              title: t('table.isSelfConnect'),
              key: 'isSelfConnect'
            },
            {
              title: '',
              key: 'mutation',
              render: (row) => {
                return <>
                  {row.isSelfConnect === 'YES' && <Modal renderOpenButton={(onOpen) => <Button component="span" variant="contained" onClick={onOpen}>{t('interface.edit')}</Button>}>
                    {(onClose) => {
                      return <>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          {t('heading.workspaceEdit', { name: row.workspaceName })}
                        </Typography>
                        <WorkspaceEditForm id={row.id} onRefetch={refetch} onClose={onClose} />
                      </>
                    }}
                  </Modal>}

                  <Modal renderOpenButton={(onOpen) => <Button sx={{ ml: 1 }} component="span" variant="contained" color="error" onClick={onOpen}>{t('interface.delete')}</Button>}>
                    {(onClose) => <>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('heading.workspaceDelete')}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {t('text.workspaceDeleteWarming')}
                      </Typography>

                      <Box sx={{ textAlign: 'right', mt: 2 }}>
                        <Button variant="contained" onClick={onClose}>{t('interface.cancel')}</Button>
                        <Button variant="outlined" sx={{ ml: 1 }} color="error" onClick={() => API.deleteResourceMysql(row.id).then(refetch)}>{t('interface.delete')}</Button>
                      </Box>
                    </>}
                  </Modal>
                </>
              }
            }
          ]}
          data={dataResource.map(data => ({
            id: data.id,
            workspaceName: data.name,
            databaseType: data.type,
            createdTime: data.createdAt,
            updatedTime: data.updatedAt,
            isSelfConnect: data.isSelfConnect ? "YES" : "NO",
            mutation: ''
          }))}
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


const WorkspaceEditForm = ({ id, onRefetch, onClose }) => {
  const { t } = useTranslation(["api"])
  const { register, handleSubmit, watch, getValues, reset } = useForm({
    defaultValues: {
      databaseName: "",
      endpoint: "",
      port: "",
      username: "",
      password: "",
    }
  })
  const { test, status } = useDatabaseTest(getValues, watch)

  const submit = handleSubmit((value) =>
    API.updateResourceMysql(id, value)
      .then(() => {
        onRefetch?.()
        onClose?.()
        reset()
      })
      .catch(() => { })
      .finally(() => { })
  )

  return <>
    <Grid container sx={{ paddingTop: 2 }} rowSpacing={2} >
      <Grid item md={12}>
        <TextField {...register("databaseName", { required: true })} label={t('label.databaseName')} fullWidth />
      </Grid>
      <Grid item md={12}>
        <TextField {...register("endpoint", { required: true })} label="Endpoint" fullWidth />
      </Grid>
      <Grid item md={12}>
        <TextField {...register("port", { required: true })} label="Port" fullWidth />
      </Grid>
      <Grid item md={12}>
        <TextField {...register("username", { required: true })} label="Username" fullWidth />
      </Grid>
      <Grid item md={12}>
        <TextField {...register("password", { required: true })} label="Password" fullWidth />
      </Grid>
    </Grid>

    <Box sx={{ textAlign: 'right', mt: 2 }}>
      {status === "success" ? <Button variant="contained" onClick={submit} fullWidth>{t('interface.update')}</Button> : <LoadingButton
        variant="outlined" fullWidth
        color={status === 'fail' ? 'error' : undefined}
        loading={status === "loading"}
        onClick={test}
      >
        {t('interface.test')}
      </LoadingButton>}
    </Box>
  </>
}


export default ApiDataSourcePage