import MockAdapter from 'axios-mock-adapter'
import { API } from './api'

export function activateMockApi(api: API) {
  const mock = new MockAdapter(api.axiosInstance, {
    delayResponse: 300,
  })

  mock.onPost(`/community/connection`).reply(200, {
    uuid: 'test_uuid',
    jwt: 'test_jwt',
  })
}
