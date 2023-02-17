import MockAdapter from 'axios-mock-adapter'
import { AxiosRequestConfig } from 'axios'
import type { API } from './api'
import {
  DEFAULT_DOWNLOAD_LIST_ITEM_COUNT,
  DEFAULT_LIST_ITEM_COUNT,
} from '../constants/env/config'
import { UserPremiumSettingState } from './modals/UserPremiumSetting'
import { ErrorCode } from './ErrorCode'

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

  const subscriberList = new Array(3000).fill(0).map((_, i, arr) => {
    const baseAddress = '0x10576ea1a4cE9F13EA66c49099f46c596D0fE7BA'
    const indexStr = `${i}`
    const indexLength = indexStr.length
    const endText =
      new Array(`${arr.length}`.length - indexLength).fill('0').join('') +
      indexStr
    return (
      baseAddress.substring(0, baseAddress.length - endText.length) + endText
    )
  })

  const subscriberListItemCount = DEFAULT_DOWNLOAD_LIST_ITEM_COUNT
  const subscriberSlice = new Array(
    subscriberList.length / subscriberListItemCount
  )
    .fill(0)
    .map((_, i) =>
      subscriberList.slice(
        i * subscriberListItemCount,
        (i + 1) * subscriberListItemCount
      )
    )

  subscriberSlice.forEach((item, i) => {
    mock
      .onGet(`/community/subscribers`, {
        params: {
          cursor: `${i}`,
          count: subscriberListItemCount,
        },
      })
      .reply(200, {
        subscribers: item,
        next_cursor: i === subscriberSlice.length - 1 ? '' : `${i + 1}`,
      })
  })

  mock
    .onGet(`/community/subscribers`, {
      params: {
        cursor: undefined,
        count: subscriberListItemCount,
      },
    })
    .reply(200, {
      subscribers: subscriberSlice[0],
      next_cursor: `1`,
    })

  const premiumSetting = {
    dot_bit_account: '',
    state: UserPremiumSettingState.Disabled,
  }
  const premiumSettingKey = 'mock_api:/community/premium_setting'

  mock.onGet(`/community/premium_setting`).reply(() => {
    let item = localStorage.getItem(premiumSettingKey)
    if (!item) {
      item = JSON.stringify(premiumSetting)
      localStorage.setItem(premiumSettingKey, item)
    }
    return [200, JSON.parse(item)]
  })

  mock
    .onPut(`/community/premium_setting`, {
      dot_bit_account: '123',
    })
    .reply(400, {
      reason: ErrorCode.DOT_BIT_ACCOUNT_NOT_OPENED,
    })

  mock
    .onPut(`/community/premium_setting`, {
      dot_bit_account: '1234',
    })
    .reply(400, {
      reason: ErrorCode.DOT_BIT_ACCOUNT_NOT_SET_LOWEST_PRICE,
    })

  function replyUpdatePremiumSetting(config: AxiosRequestConfig) {
    let item = localStorage.getItem(premiumSettingKey)
    if (!item) {
      item = JSON.stringify(premiumSetting)
      localStorage.setItem(premiumSettingKey, item)
    }
    const body = JSON.parse(config.data)
    const setting: typeof premiumSetting = JSON.parse(item)
    setting.dot_bit_account = body.dot_bit_account
    if (body.state) {
      setting.state = body.state
    }
    localStorage.setItem(premiumSettingKey, JSON.stringify(setting))
    return [200, setting]
  }

  mock.onPut(`/community/premium_setting`).reply(replyUpdatePremiumSetting)
}
