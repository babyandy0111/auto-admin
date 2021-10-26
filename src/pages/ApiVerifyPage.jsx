import { Autocomplete, Grid, Paper, TextField } from '@mui/material'
import { project } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Select } from '../components/common'
import API, { ApiResource } from '../server/api'
import { apiGet } from '../server/http'
import { useForm, Controller } from 'react-hook-form';

const ApiVerifyPage = () => {
  const { t } = useTranslation()
  const { isLoading, data: endpointVerifications = [] } = useQuery('endpointVerifications', ApiResource.endpointVerifications.get)
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

  const { register, control, setValue, getValues } = useForm({
    defaultValues: {
      name: '',
      subdomainId: '',
      resourceId: '',
      tableName: ''
    }
  })
  useQuery('endpointVerification', () => ApiResource.endpointVerification.get(id), {
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

  useEffect(() => {
    if (subdomains[0]) {
      setValue('subdomainId', subdomains[0].id)
    }
  })
  useEffect(() => {
    if (resources[0]) {
      setValue('resourceId', resources[0].id)
    }
  }, [resources, setValue])
  useEffect(() => {
    if (tableNames?.[0]) {
      setValue('tableName', tableNames[0].id)
    }
  }, [tableNames, setValue])

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
          {/* table */}
        </Grid>
      </Grid>
    </Paper>
  </>
}

// const VerifyTable = () => {
//   const { data: table = [] } = useQuery('table', () => apiGet(`resources/mysql/${resourceId}/tables/${tables[0].name}`))

//   return <div></div>
// }

// utils camelCase to snakeCase

export default ApiVerifyPage