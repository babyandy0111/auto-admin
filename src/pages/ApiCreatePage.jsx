import { useState } from 'react'
import { useQuery } from 'react-query'
import { project } from 'ramda'
import { Paper, Grid, Tab, TextField, Button } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Select, Table } from '../components/common'
import API from '../server/api'
import { useForm, useFieldArray } from 'react-hook-form'

function ApiCreatePage() {
  const { isLoading, data: workspaces } = useQuery('workspace', () => API.getResourcesMysql()
    .then(res => project(["id", "name"], res.resources))
    .catch(err => console.log(err))
  )
  const { data: domains } = useQuery('domain', API.getResourcesSubdomain)
  const [workspaceId, setWorkspaceId] = useState(undefined)
  const [domainId, setDomainId] = useState(undefined)

  return (
    <AppPageLayout>
      <Paper sx={{ marginBottom: 4 }}>
        <Grid container padding={3} spacing={2}>
          <Grid item md={6}>
            <Select
              label="Workspace"
              disabled={isLoading}
              value={workspaceId}
              options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
              onChange={(value) => setWorkspaceId(value)}
            />
          </Grid>
          <Grid item md={6}>
            <Select
              label="Domain"
              disabled={false}
              value={domainId}
              options={domains?.map(domain => ({ value: domain.id, name: domain.name })) || []}
              onChange={(value) => setDomainId(value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ marginBottom: 4 }}>
        <ApiModifyForm workspaceId={workspaceId} domainId={domainId} />
      </Paper>

      <Paper sx={{ marginBottom: 4 }}>
        <ApiKeySettingSelector />
      </Paper>
    </AppPageLayout>
  )
}

const httpMethods = ['GET', 'POST', "PUT", 'DELETE']

const ApiModifyForm = ({ workspaceId, domainId }) => {
  const { data: tables = [] } = useQuery('tables', () => API.getResourcesMysqlTable(workspaceId)
    .then(res => res)
    .catch(err => console.log(err)))
  const [tableName, setTableName] = useState(undefined)
  const [httpMethod, setHttpMethod] = useState(undefined)
  const { data: cols = [] } = useQuery('cols', () => API.getResourcesMysqlTableInfo(workspaceId, tableName)
    .then(res => res)
    .catch(err => console.log(err)))
  const [tab, setTab] = useState('normal')

  console.log({ cols })

  return (
    <TabContext value={tab} >
      <TabList sx={{ padding: 3 }} onChange={(e, newValue) => setTab(newValue)} padding={3} >
        <Tab label="Normal" value="normal" />
        <Tab label="Extensible" value="extensible" />
        <Tab label="Custom" value="custom" />
        <Tab label="Upload" value="upload" />
      </TabList>

      <TabPanel value="normal">
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Select
              label="HTTP methods"
              options={httpMethods.map(method => ({ value: method, name: method }))}
              value={httpMethod}
              onChange={(value) => setHttpMethod(value)}
            />
          </Grid>
          <Grid item md={6}>
            <Select
              label="Basic API"
              disabled={!workspaceId || !domainId || tables.length === 0}
              value={tableName}
              options={tables?.map(table => ({ value: table, name: table }))}
              onChange={(value) => setTableName(value)}
            />
          </Grid>
        </Grid>

        <div>
          <Table />
        </div>
      </TabPanel>

      <TabPanel value="extensible">
        <APIBlock />
        <Grid container sx={{ marginTop: 2 }} spacing={2}>
          {/* <Grid item md={4}>
            <Select
              label="From (Table Name)"
              disabled={isLoading}
              value={workspaceId}
              options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
              onChange={(value) => setWorkspaceId(value)}
            />
          </Grid>
          <Grid item md={4}>
            <Select
              label="Join"
              disabled={isLoading}
              value={workspaceId}
              options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
              onChange={(value) => setWorkspaceId(value)}
            />
          </Grid>
          <Grid item md={4}>
            <Select
              label="To (Table Name)"
              disabled={isLoading}
              value={workspaceId}
              options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
              onChange={(value) => setWorkspaceId(value)}
            />
          </Grid> */}
        </Grid>
        <ApiForm />
      </TabPanel>
      <TabPanel value="custom">
        <APIBlock />
        <TextField
          sx={{ marginTop: 2 }}
          label="SQL"
          fullWidth
          multiline
          rows={6}
          placeholder={`SELECT v.name, v.image_url, v.point, v.country 
FROM voucher_user INNER JOIN voucher v ON v.id = voucher_user.voucher_id 
WHERE voucher_user.user_id = :voucher_user.user_id`}
        />
      </TabPanel>
      <TabPanel value="upload">
        <APIBlock />
      </TabPanel>
    </TabContext >
  )
}


const ApiForm = () => {
  const { control,
    // register 
  } = useForm();
  const { fields, append, remove,
    // prepend, swap, move, insert 
  } = useFieldArray({
    control,
    name: "field",
  })
  const { isLoading, data: workspaces } = useQuery('workspace', () => API.getResourcesMysql({ page: 1, per_page: 20 })
    .then(response => project(['id', 'name'], response.resources))
    .catch(err => console.log(err)))
  const [workspaceId, setWorkspaceId] = useState(undefined)
  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Select
            label="Field"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
          <Select
            label="Field"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
          <Select
            label="Action"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
          <Select
            label="Field"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
          <Select
            label="Field"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
          <Button onClick={remove}>x</Button>
        </div>
      ))}
      <Button onClick={append}>add</Button>
    </>
  )
}

const APIBlock = () => {

  return (
    <Grid container spacing={2}>
      <Grid item md={6}>
        <Select
          label="HTTP methods"
          disabled={false}
          options={[]}
        />
      </Grid>
      <Grid item md={6}>
        <TextField label="Path" />
      </Grid>
    </Grid>
  )
}

const ApiKeySettingSelector = () => {
  const { isLoading, data: workspaces } = useQuery('workspace', () => API.getResourcesMysql({ page: 1, per_page: 20 })
    .then(response => project(['id', 'name'], response.resources))
    .catch(err => console.log(err)))
  const [workspaceId, setWorkspaceId] = useState(undefined)
  const { control,
    // register 
  } = useForm();
  const { fields, append, remove,
    //  prepend, swap, move, insert
  } = useFieldArray({
    control,
    name: "field",
  })

  return (
    <>
      <Grid container padding={3} spacing={2}>
        <Grid item md={6}>
          <Select
            label="Use Key"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
        </Grid>
        <Grid item md={6}>
          <Select
            label="Rule"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
        </Grid>
      </Grid>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Select
            label="Field"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
          <Select
            label="Field"
            disabled={isLoading}
            value={workspaceId}
            options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
            onChange={(value) => setWorkspaceId(value)}
          />
          <Button onClick={remove}>x</Button>
        </div>
      ))}
      <Button onClick={append}>add</Button>
    </>
  )
}

const AppPageLayout = ({ children }) => {
  return <main>
    {children}
  </main>
}

export default ApiCreatePage