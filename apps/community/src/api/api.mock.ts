import MockAdapter from 'axios-mock-adapter'
import type { API } from './api'
import { DEFAULT_LIST_ITEM_COUNT } from '../constants/env/config'

export function activateMockApi(api: API) {
  const mock = new MockAdapter(api.axiosInstance, {
    delayResponse: 300,
  })

  mock.onPost(`/community/connection`).reply(200, {
    uuid: 'test_uuid',
    jwt: 'test_jwt',
  })

  const messageList = new Array(100).fill(0).map((_, i) => ({
    created_at: new Date().toDateString(),
    read_count: i * 10,
    subject: `Test Subject ${i}`,
    uuid: `${i}_uuid`,
  }))

  const itemCount = DEFAULT_LIST_ITEM_COUNT
  const messageSlice = new Array(messageList.length / DEFAULT_LIST_ITEM_COUNT)
    .fill(0)
    .map((_, i) => messageList.slice(i * itemCount, (i + 1) * itemCount))

  messageSlice.forEach((item, i) => {
    mock
      .onGet(`/community/messages`, {
        params: {
          cursor: `${i}`,
          count: itemCount,
        },
      })
      .reply(200, {
        messages: item,
        next_cursor: i === messageSlice.length - 1 ? '' : `${i + 1}`,
      })
  })

  mock.onGet(`/community/messages`).reply(200, {
    messages: messageSlice[0],
    next_cursor: '',
  })
}
