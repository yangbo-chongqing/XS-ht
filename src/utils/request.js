import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import md5 from 'js-md5'
import store from '@/store'
import { getToken } from '@/utils/auth'
axios.defaults.timeout = 15000// 超时时间
// axios.defaults.baseURL = 'https://xsdt.xunsheng.org.cn/'
axios.interceptors.request.use(
  config => {
    const ts = parseInt(new Date().getTime() / 1000)
    if (!config.signature) {
      if (store.getters.token) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
      if (config.method === 'post') {
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        const params = config.data ? decodeURIComponent(config.data) : ''
        const cs = md5(params + '&ts=' + ts)
        if (params) {
          config.data += '&cs=' + cs + '&ts=' + ts
        } else {
          config.data = 'cs=' + cs + '&ts=' + ts
        }
      } else if (config.method === 'get') {
        config.params = config.params || {}
        const str = []
        for (const key in config.params) {
          if (config.params[key]) {
            str.push(key + '=' + decodeURIComponent(config.params[key]))
          }
        }
        const cs = md5(str.join('&') + '&ts=' + ts)
        config.params.cs = cs
        config.params.ts = ts
      }
    }
    return config
  }, function (error) {
    console.log(error)
    return Promise.reject('error')
  }
)
const http = function (options) {
  return new Promise((resolve, reject) => {
    axios(options)
      .then(res => {
        res = res.data
        if (res.status == 200) {
          resolve(res)
        } else {
          if (res.status === 401) {
            // to re-login
            MessageBox.confirm('登录已过期请重新登录', {
              confirmButtonText: '去登陆',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            })
            return false
          } else if (res.status == 400) {
            // Message({
            //   message: res.message,
            //   type: 'error',
            //   duration: 5 * 1000
            // })
          }

          setTimeout(() => {
            resolve(res)
          }, 2000)
        }
      })
      .catch(err => {
        Message({
          message: '服务器开小差了，稍后再试吧',
          type: 'error',
          duration: 5 * 1000
        })
        reject(err.response)
      })
  })
}
export default http
