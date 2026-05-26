import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: ''
  }),
  actions: {
    setToken(val: string) {
      this.token = val
      localStorage.setItem('token', val)
    },
    logout() {
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})