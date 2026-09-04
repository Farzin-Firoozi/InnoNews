import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const axiosInstance = axios.create({
  timeout: 2 * 60 * 1000,
})

const onRequest = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response
}

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)
  return axiosInstance
}

export const client = setupInterceptorsTo(axiosInstance)

export const mutator = <T>(
  url: string,
  config?: Record<string, unknown>,
): Promise<T> => {
  const data = config?.body

  return client<T>({ url, data, ...config }).then(
    (response) => response.data as T,
  )
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
