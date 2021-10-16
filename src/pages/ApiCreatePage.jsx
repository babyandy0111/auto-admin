import { useState } from 'react'
import { useQuery } from 'react-query'
import { project } from 'ramda'
import Select from '../components/basic/Select'
import API from '../server/api.js'


function ApiCreatePage() {
  const { isLoading, data: workspaces } = useQuery('workspace', () => API.getResourcesMysql({ page: 1, per_page: 20 })
    .then(response => project(['id', 'name'], response.resources))
    .catch(err => console.log(err)))

  const [workspaceId, setWorkspaceId] = useState(undefined)

  return <Select
    label="Workspace"
    disabled={isLoading}
    value={workspaceId}
    options={workspaces?.map(workspace => ({ value: workspace.id, name: workspace.name })) || []}
    onChange={(value) => setWorkspaceId(value)}
  />
}

export default ApiCreatePage