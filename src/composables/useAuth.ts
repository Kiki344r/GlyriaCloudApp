import { useAccountStore } from '~/stores/account'

export default function useAuth() {
  const router = useRouter()
  const { requestPost, requestGet } = useApi()
  const toast = useToast()
  const store = useAccountStore()
  const { account } = storeToRefs(store)

  const verifyToken = async (redirectIfExpired: boolean = false, enableToast: boolean = true) => {
    const { status, data } = await requestGet({
      version: 1,
      route: 'auth/me'
    }, enableToast)
    if (!status || !data) {
      localStorage.removeItem('userData')
      return false
    }

    if (!data.success) {
      toast.add({
        title: 'Erreur',
        description: data?.message,
        color: 'error'
      })
      localStorage.removeItem('userData')
      if (redirectIfExpired) return router.push('/login')
      return false
    }

    localStorage.setItem('userData', JSON.stringify(data.data))
    return true
  }

  const Login = async (data: any) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'auth/login',
      data
    })

    console.log('Login, status: ', status, ', data: ', res, '')

    if (!status || !res) return false

    if (res.success) {
      localStorage.setItem('userData', JSON.stringify(res.data))
      await store.update()

      toast.add({
        title: 'Connexion réussie',
        description: `Bienvenue ${res?.data?.firstName} !`,
        color: 'success'
      })

      return router.push('/')
    } else {
      toast.add({
        title: 'Erreur',
        description: res?.message,
        color: 'error'
      })
      return false
    }
  }

  const Register = async (data: any) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'auth/register',
      data
    })

    if (!status || !res) return false

    if (res.success) {
      toast.add({
        title: 'Compte créer avec succès',
        description: `Veuillez valider votre adresse mail pour activer votre compte ! Si vous ne voyez pas le mail, regardez dans les spams ou promotions.`,
        color: 'success'
      })

      return router.push('/')
    } else {
      toast.add({
        title: 'Erreur',
        description: res?.message,
        color: 'error'
      })
      return false
    }
  }

  const VerifyEmail = async (data: { token: string }) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'auth/verify-email',
      data
    })
    if (!status || !res) return false
    if (res.success) {
      localStorage.setItem('userData', JSON.stringify(res.data))
      toast.add({
        title: 'Adresse mail vérifiée',
        description: 'Votre adresse mail a été vérifiée avec succès !',
        color: 'success'
      })
      return true
    } else {
      return false
    }
  }

  const LogOut = async () => {
    const { status } = await requestPost({
      version: 1,
      route: 'auth/logout'
    })
    if (!status) {
      localStorage.removeItem('userData')
      return
    }
    localStorage.removeItem('userData')
    await Account().update()
    toast.add({
      title: 'Déconnexion réussie',
      color: 'success'
    })
    if (window.location.pathname.startsWith('/dashboard')) router.push('/')
  }

  const ForgotPassword = async (data: { email: string }) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'auth/forgot-password',
      data
    })
    console.log('Forgot password, status: ', status, ', data: ', res, '')
    if (!status || !res) return false
    if (res.success) {
      toast.add({
        title: 'E-mail envoyé',
        description: 'Vérifiez votre boîte de réception (et vos spams).',
        icon: 'i-heroicons-paper-airplane',
        color: 'success'
      })
      return true
    } else {
      return false
    }
  }

  const CheckPasswordCode = async (data: { code: string }) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'auth/check-password-code',
      data
    }, false)
    console.log('Check password code, status: ', status, ', data: ', res, '')
    if (!status || !res) return false
    return !!res.success
  }

  const ResetPassword = async (data: { code: string, password: string }) => {
    const { status, data: res } = await requestPost({
      version: 1,
      route: 'auth/reset-password',
      data
    })

    if (!status || !res) return false
    if (res.success) {
      toast.add({
        title: 'Mot de passe mis à jour',
        description: 'Vous pouvez maintenant vous connecter.',
        color: 'success',
        icon: 'i-heroicons-check-badge'
      })
      return true
    } else {
      return false
    }
  }

  const Account = () => {
    return {
      cache: function () {
        const userData = localStorage.getItem('userData')
        if (!userData) return null
        return JSON.parse(userData) as accountData
      },
      fetch: async () => {
        await verifyToken(false, false)
        const userData = localStorage.getItem('userData')
        if (!userData) return null
        return JSON.parse(userData) as accountData
      },
      isLoggedIn: async () => {
        return await verifyToken(false, false)
      },
      update: async () => {
        const store = useAccountStore()
        await store.update()
        return true
      },
      ref: () => {
        return account
      }
    }
  }

  return {
    verifyToken,
    Login,
    Register,
    VerifyEmail,
    LogOut,
    ForgotPassword,
    CheckPasswordCode,
    ResetPassword,
    Account
  }
}
