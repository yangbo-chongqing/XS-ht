import request from '@/utils/request'
//修改词条排序
export function relicsRevise(data) {
  return request({
    url: '/api/store/relics/revise',
    method: 'post',
    data
  })
}
//词条添加分组
export function postlabelCreate(data) {
  return request({
    url: '/api/store/label/create',
    method: 'post',
    data
  })
}
//词条删除分组
export function postlabelDel(data) {
  return request({
    url: '/api/store/label/del',
    method: 'post',
    data
  })
}
//词条分类列表
export function postTypeList(data) {
  return request({
    url: '/api/store/type/list',
    method: 'post',
    data
  })
}
//词条分类详情
export function postTypeDetail(data) {
  return request({
    url: '/api/store/type/detail',
    method: 'post',
    data
  })
}
//词条分类新增
export function postTypeCreate(data) {
  return request({
    url: '/api/store/type/create',
    method: 'post',
    data
  })
}
//词条分类修改
export function postTypeEdit(data) {
  return request({
    url: '/api/store/type/edit',
    method: 'post',
    data
  })
}
//词条分类删除
export function postTypeDel(data) {
  return request({
    url: '/api/store/type/del',
    method: 'post',
    data
  })
}
//词条列表
export function RelicsList(data) {
  return request({
    url: '/api/store/relics/list',
    method: 'post',
    data
  })
}
// 数据统计
export function postStatistics(data) {
  return request({
    url: '/api/store/statistics',
    method: 'post',
    data
  })
}
// 获取工作台详情
export function entryCodeList(data) {
  return request({
    url: '/api/store/relics/list',
    method: 'post',
    data
  })
}
// 新增词条
export function postPublish(data) {
  return request({
    url: '/api/store/publish',
    method: 'post',
    data
  })
}
// 查询相关列表
export function postEntryList(data) {
  return request({
    url: '/api/store/entry/list',
    method: 'post',
    data
  })
}
// 查看词条详情
export function postGetRelics(data) {
  return request({
    url: '/api/store/relics/detail',
    method: 'post',
    data
  })
}
// 编辑词条
export function postEdit(data) {
  return request({
    url: '/api/store/relics/edit',
    method: 'post',
    data
  })
}
// 删除词条
export function postDelRelics(data) {
  return request({
    url: '/api/store/relics/del',
    method: 'post',
    data
  })
}

