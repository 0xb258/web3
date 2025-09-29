
import axios from 'axios'
import setConfig from './axios.setConfig.js'
import handleResponse from './axios.handleResponse.js'
import { guid, aesEncrypt, aesDecrypt } from './axios.middleware.js'
import { useIndexStore } from '@/store'
import { showToast, showLoadingToast, closeToast } from 'vant'
import baseConfig from '@/config'
import md5 from 'md5'
import { i18n } from '../../lang'
import qs from 'qs'

let intactRequest = setConfig(axios)
let request = setConfig(intactRequest.create())

// 请求中的api
let pendingPool = new Map()

/**
 * 请求拦截
 */
const requestInterceptorId = request.interceptors.request.use(
  (config) => {
    showLoadingToast()
    const store = useIndexStore()
    let token = store.token || ''
    delete config.headers['Authorization']
    if (token) {
      config.headers['Authorization'] = token
    }
    config.headers['LANG'] = (i18n.global.locale.value || 'tw').toUpperCase()
    if (baseConfig.isEnableEncryption) {
      if (config.method == 'get') {
        config.data = config.params
        delete config.params
      }
      let signParam = {
        method: config.method.toUpperCase(),
        uri: `${config.url}`,
        header: config.headers,
        params: { ...config.data }
      }
      if (token) {
        config.headers['Authorization'] = token
      }

      let handshake = guid()
      let timestamp = Date.now()
      let sign = md5(`${signParam}${timestamp}${handshake}`)
      let signKey = JSON.stringify(signParam)

      let encrypData = aesEncrypt(signKey, handshake)
      config.data = {
        handshake,
        timestamp,
        sign,
        data: encrypData
      }
      config.data = qs.stringify(config.data)
      config.method = 'post'
      config.url = `${config.baseURL}/api/${baseConfig.suffix}`
    }

    return config
  },
  (err) => {
    // 对请求错误做些什么
    return Promise.reject(err)
  }
)
/**
 * 响应拦截
 */
const responseInterceptorId = request.interceptors.response.use(
  (response) => {
    closeToast()
    const { data, config } = response
    try {
      if (baseConfig.isEnableEncryption) {
        const cipher = data.data
        const plain = aesDecrypt(cipher, data.handshake)
        try {
          let res = JSON.parse(plain)

          if (baseConfig.isLog) {
            console.log('[ res ] >', res)
          }
          // 如果code不为200，则显示错误信息
          if (res.code != 200) {
            showToast(res.message)
            return Promise.reject(res)
          }
          return Promise.resolve(res.data)
        } catch (e) {
          console.log(e);
        }
      } else {
        if (baseConfig.isLog) {
          console.log('[ response ] >', data)
        }
        if (data.code != 200) {
          showToast(data.message)
          return Promise.reject(data)
        }
        return Promise.resolve(data.data)
      }
    } catch (e) {
      showToast(e.message)
    }
    // 清理 pending
    if (config && config.__dedupeKey) {
      pendingPool.delete(config.__dedupeKey)
    }
    return Promise.resolve(handleResponse(response))
  },
  (err) => {
    if (!err) return Promise.reject(err)
    showToast(err.message)
    // closeToast()
 return Promise.reject(err)
  }
)

// 移除全局的请求拦截器
function removeRequestInterceptor() {
  request.interceptors.request.eject(requestInterceptorId)
}

// 移除全局的响应拦截器
function removeResponseInterceptor() {
  request.interceptors.response.eject(responseInterceptorId)
}

/**
 * 清除所有pending状态的请求
 * @param {Array} whiteList 白名单，里面的请求不会被取消
 * 返回值 被取消了的api请求
 */
function clearPendingPool(whiteList = []) {
  if (!pendingPool.size) return

  const pendingUrlList = Array.from(pendingPool.keys()).filter((url) => !whiteList.includes(url))
  if (!pendingUrlList.length) return

  pendingUrlList.forEach((pendingUrl) => {
    // 清除掉所有非全局的pending状态下的请求
    if (!pendingPool.get(pendingUrl).global) {
      pendingPool.get(pendingUrl).cancelFn()
      pendingPool.delete(pendingUrl)
    }
  })

  return pendingUrlList
}

request.removeRequestInterceptor = removeRequestInterceptor
request.removeResponseInterceptor = removeResponseInterceptor
request.clearPendingPool = clearPendingPool

export { intactRequest, request }
