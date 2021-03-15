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
// 产品码删除
export function productDel(data) {
  return request({
    url: '/api/store/product/del',
    method: 'post',
    data,
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
    url: '/api/store/manual/detail',
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
// 删除扩展字段
export function expandDel(data) {
  return request({
    url: '/api/store/expand/del',
    method: 'post',
    data
  })
}
// 修改扩展字段
export function expandEdit(data) {
  return request({
    url: '/api/store/expand/edit',
    method: 'post',
    data
  })
}

// 添加词条相关内容
export function createsRelated(data) {
  return request({
    url: '/api/store/related/create',
    method: 'post',
    data
  })
}
// 获取词条相关内容列表
export function relatedList(data) {
  return request({
    url: '/api/store/related/list',
    method: 'post',
    data
  })
}
// 编辑词条相关内容
export function relatedEdit(data) {
  return request({
    url: '/api/store/related/edit',
    method: 'post',
    data
  })
}
// 删除词条相关内容
export function relatedDel(data) {
  return request({
    url: '/api/store/related/del',
    method: 'post',
    data
  })
}
// 创建说明书
export function addManual(data) {
  return request({
    url: '/api/store/manual/add',
    method: 'post',
    data
  })
}
// 删除说明书
export function delManual(data) {
  return request({
    url: '/api/store/manual/del',
    method: 'post',
    data
  })
}
// 说明书模板列表
export function manualList(data) {
  return request({
    url: '/api/store/manual/list',
    method: 'post',
    data
  })
}
// 说明书分类列表
export function editType(data) {
  return request({
    url: '/api/store/manual/type/edit',
    method: 'post',
    data
  })
}
// 说明书分类列表
export function contentDetail(data) {
  return request({
    url: '/api/store/manual/content/detail',
    method: 'post',
    data
  })
}
// 说明书分类列表
export function contentEdit(data) {
  return request({
    url: '/api/store/manual/content/edit',
    method: 'post',
    data
  })
}