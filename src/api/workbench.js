import request from '@/utils/request'
// 获取工作台详情
export function workbench(data) {
  return request({
    url: '/api/Store/Workbench',
    method: 'post',
    data
  })
}
