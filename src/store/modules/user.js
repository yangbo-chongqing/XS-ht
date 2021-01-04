import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import qs from 'qs'
import { Message } from 'element-ui';

const getDefaultState = () => {
  return {
    userinfo: '',
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login(qs.stringify({ phone: phone, password: password })).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(JSON.stringify({ token: data.token, user_id: data.user_id }))
        console.log(response)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  erLogin({ commit }, userInfo) {
    // 二维码扫码登录
    commit('SET_TOKEN', userInfo.token)
    setToken(JSON.stringify({ token: userInfo.token, user_id: userInfo.user_id }))
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        // if (!data) {
        //   return reject('Verification failed, please Login again.')
        // }
        // const { name, avatar } = data
        commit('SET_NAME', data.user_info.nickname)
        commit('SET_AVATAR', data.user_info.avatar)
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

