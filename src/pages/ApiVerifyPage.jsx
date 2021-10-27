import { Autocomplete, Grid, Paper, TextField } from '@mui/material'
import { project } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Select } from '../components/common'
import API, { ApiResource } from '../server/api'
import { apiGet } from '../server/http'
import { useForm, Controller } from 'react-hook-form';
import FormTable from '../components/common/FormTable';

const ApiVerifyPage = () => {
  const { t } = useTranslation()
  const { isLoading, data: endpointVerifications = [] } = useQuery('endpointVerifications', () => ApiResource.endpointVerifications.get())
  const [value, setValue] = useState('')

  useEffect(() => {
    const id = endpointVerifications[0]?.id
    if (id) {
      setValue(id)
    }
  }, [endpointVerifications])

  return <>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        {!isLoading && <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={endpointVerifications.map(verification => ({
            id: verification.id,
            label: verification.name
          }))}
          sx={{ width: 300 }}
          renderInput={(params) =>
            <TextField {...params}
              variant="filled"
              label={t('label.verification')}
            />}
        />}
      </Grid>
    </Grid>
    {!isLoading && value && <Grid container spacing={2}>
      <Grid item xs={12}>
        <VerificationSettingBlock id={value} />
      </Grid>
    </Grid>}
  </>
}

const VerificationSettingBlock = ({ id }) => {
  const { t } = useTranslation()

  const { register, control, setValue, getValues, watch } = useForm({
    defaultValues: {
      name: '',
      subdomainId: '',
      resourceId: '',
      tableName: ''
    }
  })
  const [resourceId, tableName] = watch(["resourceId", "tableName"])

  const { data } = useQuery('endpointVerification', () => ApiResource.endpointVerification.get(id).then(res => ({
    id: res.id,
    name: res.name,
    fields: res.request_info.map(v => ({
      fieldName: v.filed_name,
      aliasName: v.alias_name
    }))
  })), {
    onSuccess: (data) => setValue('name', data.name)
  })
  const { data: subdomains = [] } = useQuery('subdomains', () => apiGet("resources/subdomain", {
    page: 1,
    per_page: 20,
  })
    .then(res => project(["id", "name"], res.resources))
    .catch(err => console.log(err)))
  const { data: resources = [] } = useQuery('resources', () => API.getResourcesMysql()
    .then(res => project(["id", "name"], res.resources))
    .catch(err => console.log(err))
  )
  const { data: tableNames = [] } = useQuery('tables', () => apiGet(`resources/mysql/${getValues('resourceId')}/tables`), {
    // The query will not execute until the userId exists
    enabled: !!getValues('resourceId'),
  })

  return <>
    <Paper>
      <Grid container columnSpacing={2} padding={3}>
        <Grid item md={4}>
          <TextField
            fullWidth
            {...register('name')}
          />
        </Grid>
        <Grid item md={2}>
          <Controller
            control={control}
            name="subdomainId"
            render={({ field: { value, onChange } }) => (
              <Select
                variant="filled"
                label={t('label.dataSourceAdd')}
                options={subdomains.map(domain => ({
                  value: domain.id,
                  name: domain.name
                }))}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Grid>
      </Grid>
    </Paper>
    <Paper mt={2}>
      <Grid container columnSpacing={2} padding={3}>
        <Grid item md={4}>
          <Controller
            control={control}
            name="resourceId"
            render={({ field: { value, onChange } }) => (
              <Select
                variant="filled"
                label={t('label.dataSourceAdd')}
                options={resources.map(domain => ({
                  value: domain.id,
                  name: domain.name
                }))}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Grid>
        <Grid item md={2}>
          <Controller
            control={control}
            name="tableName"
            render={({ field: { value, onChange } }) => (
              <Select
                variant="filled"
                label={t('label.dataSourceAdd')}
                options={tableNames?.map(tableName => ({
                  value: tableName,
                  name: tableName
                })) || []}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Grid>
        <Grid item md={12}>
          {!!(resourceId && tableNames && data) && <ApiFormTable resourceId={resourceId} tableName={tableName} fields={data.fields} />}
        </Grid>
      </Grid>
    </Paper>
  </>
}

const ApiFormTable = ({ resourceId, tableName, fields }) => {
  const { t } = useTranslation()
  const { data: rows = [] } = useQuery('table', () => apiGet(`resources/mysql/${resourceId}/tables/${tableName}`)
    .then((res) => res.columns.map(v => ({
      name: v.name,
      fieldType: v.field_type,
      comment: v.comment,
      defaultValue: v.default_value
    }))), {

  })

  console.log({ rows, fields })
  // return <></>
  return <FormTable columns={
    [
      {
        title: t('table.name'),
        key: "name"
      },
      {
        title: t('table.fieldType'),
        key: "fieldType"
      },
      {
        title: t('table.comment'),
        key: "comment"
      },
      {
        title: t('table.defaultValue'),
        key: "defaultValue"
      }
    ]}
    data={rows}
  />
}

// utils camelCase to snakeCase

export default ApiVerifyPage