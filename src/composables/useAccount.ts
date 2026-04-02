import { useAccountStore } from '~/stores/account'

export default function useAuth() {
    const router = useRouter()
    const { requestPost, requestGet } = useApi()
    const toast = useToast()
    const store = useAccountStore()
    const { account } = storeToRefs(store)

    const getRank = async () => {

    }


    return {
        getRank
    }
}
