import request from '@/utils/request'
// 产品码添加
export function productCreate(data) {
  return request({
    url: '/api/product/create',
    method: 'post',
    data
  })
}
//产品列表
export function productList(data) {
  return request({
    url: '/api/product/list',
    method: 'post',
    data
  })
}
//查询产品码
export function productDetails(data) {
  return request({
    url: '/api/product/details',
    method: 'post',
    data
  })
}
//修改产品码
export function productEdit(data) {
  return request({
    url: '/api/product/edit',
    method: 'post',
    data
  })
}
///说明书列表
export function manualList(data) {
  return request({
    url: '/api/manual/list',
    method: 'post',
    data
  })
}
//添加说明书
export function manualCreate(data) {
  return request({
    url: '/api/manual/create',
    method: 'post',
    data
  })
}