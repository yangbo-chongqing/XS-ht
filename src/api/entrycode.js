import request from '@/utils/request'
// 获取工作台详情
export function entryCodeList(data) {
  return request({
    url: '/api/Store/RelicsList',
    method: 'post',
    data
  })
}
// 新增词条
export function postPublish(data) {
  return request({
    url: '/api/Store/Publish',
    method: 'post',
    data
  })
}
// 查询相关列表
export function postEntryList(data) {
  return request({
    url: '/api/Store/EntryList',
    method: 'post',
    data
  })
}
// 查看词条详情
export function postGetRelics(data) {
  return request({
    url: '/api/Store/GetRelics',
    method: 'post',
    data
  })
}
// 编辑词条
export function postEdit(data) {
  return request({
    url: '/api/Store/Editor',
    method: 'post',
    data
  })
}
// 删除词条
export function postDelRelics(data) {
  return request({
    url: '/api/Store/DelRelics',
    method: 'post',
    data
  })
}

