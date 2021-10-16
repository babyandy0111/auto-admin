import { useEffect } from 'react'
import Select from '../components/basic/Select'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import ky from 'ky'

const api = ky.extend({
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set('bearer', localStorage.getItem("id_token"))
      }
    ]
  }
});




function ApiCreatePage() {
  // useQuery('workspace')

  // const response = ky.get('https://app-api.codegenapps.com/v1/resources/mysql?page=1&per_page=20')
  // console.log(response)

  return <div>
    <Select value={'value'} onChange={(value) => console.log(value)} label="Workspace" options={[{ value: 'value', name: 'name' }, { value: 'value1', name: 'name2' }]} />
  </div>
}

export default ApiCreatePage