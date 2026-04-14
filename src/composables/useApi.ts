import { fetch } from '@tauri-apps/plugin-http';

interface response {
  success: boolean
  message?: string
  data?: any
}

interface request {
  version: number
  route: string
  data?: any
}

interface requestGet {
  version: number
  route: string
  options?: Record<string, string>
}

interface requestInternal {
  version: number
  route: string
  method: 'post' | 'delete' | 'put' | 'patch' | 'get'
  data?: any
  options?: Record<string, string>
}

export default function useApi() {
  const toast = useToast()
  const {isDesktop} = useAppDetection()

  const requestInternalDesktop = async (data: requestInternal, enableToast: boolean = true) => {
    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.public.api_url

    try {

      let requestUrl = `${apiUrl}/v${data.version}/${data.route}`
      console.log('Request: ', requestUrl, data)
      if (data.method === 'get' && data.options) requestUrl += `?${new URLSearchParams(data.options)}`

      const res = await fetch(`${requestUrl}`, {
        method: data.method,
        cache: 'no-store',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: data.method !== 'get' ? JSON.stringify(data.data) : undefined,
      })
      console.log('Response: ', res)
      const resData = await res.json() as response

      if (!res.ok) {
        throw resData
      }
      return {
        status: true,
        data: resData
      }
    } catch (e: any) {
      console.error('Request error: ', e)
      if (e?.message) {
        if (enableToast) toast.add({ title: 'Erreur', description: e.message, color: 'error' })
        return {
          status: false,
          message: e.message
        }
      } else {
        if (enableToast) toast.add({ title: 'Erreur', description: 'Impossible de contacter l\'API de Glyria Cloud.', color: 'error' })
        return {
          status: false,
          message: e
        }
      }
    }
  }

  const requestInternalWeb = async (data: requestInternal, enableToast: boolean = true) => {
    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.public.api_url

    try {
      let requestUrl = `${apiUrl}/v${data.version}/${data.route}`

      if (data.method === 'get' && data.options) requestUrl += `?${new URLSearchParams(data.options)}`

      const res = await $fetch(`${requestUrl}`, {
        method: data.method,
        cache: 'no-store',
        credentials: 'include',
        body: data?.data || null
      }) as response
      return {
        status: true,
        data: res
      }
    } catch (e: any) {
      if (e?.data?.message) {
        if (enableToast) toast.add({ title: 'Erreur', description: e.data.message, color: 'error' })
        return {
          status: false,
          message: e.data.message
        }
      } else {
        if (enableToast) toast.add({ title: 'Erreur', description: 'Impossible de contacter l\'API de Glyria Cloud.', color: 'error' })
        return {
          status: false,
          message: e
        }
      }
    }
  }

  const requestInternal = async (data: requestInternal, enableToast: boolean = true) => {
    if (isDesktop.value) return await requestInternalDesktop(data, enableToast)
    else return await requestInternalWeb(data, enableToast)
  }

  const requestPost = async (data: request, enableToast: boolean = true) => {
    const req = data as requestInternal
    req.method = 'post'
    return await requestInternal(req, enableToast)
  }

  const requestDelete = async (data: request, enableToast: boolean = true) => {
    const req = data as requestInternal
    req.method = 'delete'
    return await requestInternal(req, enableToast)
  }

  const requestPut = async (data: request, enableToast: boolean = true) => {
    const req = data as requestInternal
    req.method = 'put'
    return await requestInternal(req, enableToast)
  }

  const requestPatch = async (data: request, enableToast: boolean = true) => {
    const req = data as requestInternal
    req.method = 'patch'
    return await requestInternal(req, enableToast)
  }

  const requestGet = async (data: requestGet, enableToast: boolean = true) => {
    const req = data as requestInternal
    req.method = 'get'
    return await requestInternal(req, enableToast)
  }

  return {
    requestPost,
    requestDelete,
    requestPut,
    requestPatch,
    requestGet
  }
}
