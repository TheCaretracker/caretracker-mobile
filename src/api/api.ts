import axios from 'axios'
import Constants from 'expo-constants'

const backendUrl = `${Constants.expoConfig?.extra?.API_URL}/api/v1`

// const backendUrl = `${Config.API_URL}/api/v1`
// const backendUrl = `http://192.168.0.2:3000/api/v1`
// const backendUrl = `https://staging.caretracker.fetchlydev.com/api/v1`

const api = axios.create({
  baseURL: backendUrl,
})

if (__DEV__) {
  api.interceptors.request.use(
    (config) => {
      // Construct the full URL with query parameters
      const fullUrl = `${config.baseURL}${config.url}${
        config.params ? `?${new URLSearchParams(config.params).toString()}` : ''
      }`

      console.log(
        '[Axios Request]',
        JSON.stringify(
          {
            fullUrl, // Log the full URL
            method: config.method,
            // headers: config.headers,
            // data: config.data,
            params: config.params,
          },
          null,
          2
        )
      ) // Pretty-print the log
      return config
    },
    (error) => {
      console.error('[Axios Request Error]', error)
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    (response) => {
      console.log('[Axios Response]', {
        url: response.config.url,
        fullUrl: `${response.config.baseURL}${response.config.url}${
          response.config.params
            ? `?${new URLSearchParams(response.config.params).toString()}`
            : ''
        }`, // Log the full URL
        status: response.status,
        // data: response.data,
      })
      return response
    },
    (error) => {
      console.error('[Axios Response Error]', {
        url: error.config?.url,
        fullUrl: error.config
          ? `${error.config.baseURL}${error.config.url}${
              error.config.params
                ? `?${new URLSearchParams(error.config.params).toString()}`
                : ''
            }`
          : null, // Log the full URL if available
        message: error.message,
        response: error.response?.data,
      })
      return Promise.reject(error)
    }
  )
}

export default api
