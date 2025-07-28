import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('user', () => {
  const isAuthenticated = ref(true)

  return {
    isAuthenticated,
  }
})
