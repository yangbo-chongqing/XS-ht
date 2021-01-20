import request from '@/utils/request'
//流水码列表
export function floWingList(data) {
  return request({
    url: '/api/store/flowing/list',
    method: 'post',
    data
  })
}
//流水码删除
export function floWingDel(data) {
  return request({
    url: '/api/store/flowing/del',
    method: 'post',
    data
  })
}
//流水码详情
export function floWingDetails(data) {
  return request({
    url: '/api/store/flowing/details',
    method: 'post',
    data
  })
}
//流水码修改
export function floWingEdit(data) {
  return request({
    url: '/api/store/flowing/edit',
    method: 'post',
    data
  })
}
//流水码创建
export function floWingCreate(data) {
  return request({
    url: '/api/store/flowing/create',
    method: 'post',
    data
  })
}
// 产品码添加
export function productCreate(data, meta) {
  return request({
    url: '/api/store/product/create',
    method: 'post',
    data,
    meta
  })
}
//产品列表
export function productList(data) {
  return request({
    url: '/api/store/product/list',
    method: 'post',
    data
  })
}
//查询产品码
export function productDetails(data) {
  return request({
    url: '/api/store/product/details',
    method: 'post',
    data
  })
}
//修改产品码
export function productEdit(data) {
  return request({
    url: '/api/store/product/edit',
    method: 'post',
    data
  })
}
///说明书列表
export function manualList(data) {
  return request({
    url: '/api/store/manual/list',
    method: 'post',
    data
  })
}
//添加说明书
export function manualCreate(data) {
  return request({
    url: '/api/store/manual/create',
    method: 'post',
    data
  })
}
//查询说明书
export function manualDetails(data) {
  return request({
    url: '/api/store/manual/details',
    method: 'post',
    data
  })
}
//修改说明书
export function manualEdit(data) {
  return request({
    url: '/api/store/manual/edit',
    method: 'post',
    data
  })
}
//生成二维码
export function preview(data) {
  return request({
    url: '/api/store/preview',
    method: 'post',
    data
  })
}
//扩展字段列表
export function expandList(data) {
  return request({
    url: '/api/store/expand/list',
    method: 'post',
    data
  })
}
// 添加扩展字段
export function expandCreate(data) {
  return request({
    url: '/api/store/expand/create',
    method: 'post',
    data
  })
}