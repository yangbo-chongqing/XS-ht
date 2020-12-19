import request from '@/utils/request'
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
    url: '/api/Store/LoginCredentials',
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
export function logout() {
  return request({
    url: '',
    method: 'post'
  })
}
