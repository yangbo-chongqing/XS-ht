import request from '@/utils/request'
// 获取工作台详情
export function entryCodeList(data) {
  return request({
    url: '/api/Store/RelicsList',
    method: 'post',
    data
  })
}
