import { useState } from 'react'
import Select from '../components/basic/Select'
import { useQuery } from 'react-query'
import ky from 'ky'
import { project } from 'ramda'

const api = ky.extend({
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set('bearer', localStorage.getItem("id_token"))
      }
    ]
  }
})

function ApiCreatePage() {
  const { isLoading, data: workspaces } = useQuery('workspace', () => api.get('https://app-api.codegenapps.com/v1/resources/mysql?page=1&per_page=20').json()
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