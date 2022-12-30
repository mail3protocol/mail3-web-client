import axios, { Axios, AxiosResponse } from 'axios'
import { HomeCommunity } from 'models'
import { useMemo } from 'react'
import { SERVER_URL } from '../constants/env'

interface getBitToEthResponse {
  out_point: {
    tx_hash: string
    index: number
  }
  account_info: {
    account: string
    account_alias: string
    account_id_hex: string
    next_account_id_hex: string
    create_at_unix: number
    expired_at_unix: number
    status: number
    das_lock_arg_hex: string
    owner_algorithm_id: number
    owner_key: string
    manager_algorithm_id: number
    manager_key: string
  }
}

export interface UserSettingResponse {
  banner_url: string
  description: string
  items_link: string
  mmb_state: 'enabled' | 'disabled'
  reward_type: 'nft' | 'air'
}

class API {
  private axios: Axios

  constructor() {
    this.axios = axios.create({
      baseURL: SERVER_URL,
    })
  }

  public async getBitToEthResponse(
    account: string
  ): Promise<AxiosResponse<getBitToEthResponse>> {
    return this.axios.get(`/dotbit/account_infos/${account}`)
  }

  public async checkIsProject(address: string) {
    return this.axios.get(`/community/users/${address}`)
  }

  public async getPrimitiveAddress(domain: string) {
    return this.axios.get(`/addresses/${domain}`)
  }

  public async getUserInfo(address: string) {
    return this.axios.get<{ nickname: string; avatar: string }>(
      `/user_info/${address}`
    )
  }

  public async getCommunityMessages(address: string, nextCursor: string) {
    return this.axios.get<HomeCommunity.ListResp>(
      `/public/community/messages/${address}/?cursor=${nextCursor}&count=20`
    )
  }

  public async getUserSetting(account: string) {
    return this.axios.get<UserSettingResponse>(
      `/public/community/user_setting/${account}`
    )
  }
}

export const useAPI = () => useMemo(() => new API(), [])

export const getAPI = new API()
