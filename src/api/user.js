import request from '@/utils/request'
import axios from 'axios'

// 修改用户信息
export function postAccountSettings(data) {
  return request({
    url: '/api/store/account/edit',
    method: 'post',
    data
  })
}
export function login(data) {
  return request({
    url: '/api/store/phone/login',
    method: 'post',
    data
  })
}
export function getInfo() {
  return request({
    url: '/api/store/user/detail',
    method: 'post'
  })
}
// 获取登陆二维码凭证
export function LoginCredentials(data) {
  return request({
    url: '/api/store/login/credentials',
    method: 'post',
    data
  })
}
// 获取二维码状态
export function GetCodeStatus(data) {
  return request({
    url: '/api/store/code/status',
    method: 'post',
    data
  })
}
// 获取协议详情
export function getDetail(data) {
  return request({
    url: '/api/help/details',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '',
    method: 'post'
  })
}

//获取七牛云上传token
export function getQiToken(data) {
  return request({
    url: '/api/qiniu',
    method: 'post',
    data
  })
}

//切换当前公司
export function museSwitch(data) {
  return request({
    url: '/api/store/muse/switch',
    method: 'post',
    data
  })
}

// 获取历史图片
export function getPicList(data) {
  return request({
    url: '/api/store/ueditor/config',
    method: 'post',
    data: data
  })
}

// 商家菜单
export function getMenu(data) {
  return request({
    url: '/api/store/menu',
    method: 'post',
    data: data
  })
}