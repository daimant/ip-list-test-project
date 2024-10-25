import { defineStore } from 'pinia'
// import { type modelValueFilter } from '../models'

export type IPType = {
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  query: string
}

export const useIpStore = defineStore('ip', {
  state: (): { ipList: IPType[] } => ({
    ipList: [],
  }),

  actions: {
    addIP(item: IPType) {
      this.ipList.push(item)
    },
    removeIP(index: number, count: number) {
      this.ipList.splice(index, count)
    },
    clearList() {
      this.ipList = []
    },
    sort(param: 'query' | 'country' | 'region') {
      this.ipList = this.ipList.sort((a, b) => a[param] < b[param] ? -1 : 1)
    },
    search(search: string) {
      // this.ipList = this.ipList
    },
  },

  getters: {
    getList(): IPType[] {
      return this.ipList
    },
    getIp(): (ip: string) => IPType | undefined {
      return (ip: string) => this.ipList.find(el => el.query === ip)
    },
  },
})
