import request from '@/utils/request'
// 获取商户信息
export function getGetMuse(data) {
  return request({
    url: '/api/Store/GetMuse',
    method: 'post',
    data
  })
}
//修改商户
export function editEditMuse(data) {
  return request({
    url: '/api/Store/EditMuse',
    method: 'post',
    data
  })
}
//删除子管理员
export function delAadmin(data) {
  return request({
    url: '/api/Store/DelAadmin',
    method: 'post',
    data
  })
}
//新增子管理员
export function insertAdmin(data) {
  return request({
    url: '/api/Store/InsertAdmin',
    method: 'post',
    data
  })
}
//子管理员列表
export function getSubAdmin(data) {
  return request({
    url: '/api/Store/SubAdmin',
    method: 'post',
    data
  })
}