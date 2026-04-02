import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', () => {
  const account = ref<accountData | null>(null)

  const update = async () => {
    const { Account } = useAuth()
    const userData = await Account().fetch()
    account.value = userData
  }

  return { account, update }
})
