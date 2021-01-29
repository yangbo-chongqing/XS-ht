import request from '@/utils/request'
// 获取关注公众号二维码
export function getWarrant(data) {
  return request({
    url: '/api/store/warrant',
    method: 'post',
    data,
  })
}
// 获取商户信息
export function getGetMuse(data) {
  return request({
    url: '/api/store/muse/detail',
    method: 'post',
    data
  })
}
// 修改商户
export function editEditMuse(data) {
  return request({
    url: '/api/store/muse/edit',
    method: 'post',
    data
  })
}
// 删除子管理员
export function delAadmin(data) {
  return request({
    url: '/api/store/subadmin/del',
    method: 'post',
    data
  })
}
// 新增子管理员
export function insertAdmin(data) {
  return request({
    url: '/api/store/subadmin/add',
    method: 'post',
    data
  })
}
// 子管理员列表
export function getSubAdmin(data) {
  return request({
    url: '/api/store/subadmin',
    method: 'post',
    data
  })
}

// 商户上下架
export function changeAdmin(data) {
  return request({
    url: '/api/store/status/change',
    method: 'post',
    data
  })
}

// 修改密码
export function edPD(data) {
  return request({
    url: '/api/store/user/resetpass',
    method: 'post',
    data: data
  })
}
//人员权限详情
export function subadminDetail(data) {
  return request({
    url: '/api/store/subadmin/detail',
    method: 'post',
    data
  })
}
//人员权限详情
export function subadminEdit(data) {
  return request({
    url: '/api/store/subadmin/edit',
    method: 'post',
    data
  })
}