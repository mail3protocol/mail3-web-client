import axios, { Axios } from 'axios'

export class API {
  private axios: Axios

  constructor() {
    this.axios = axios.create({})
  }
}
