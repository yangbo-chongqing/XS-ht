import request from '@/utils/request'
// 获取工作台详情
export function workbench(data) {
  return request({
    url: '/api/store/workbench',
    method: 'post',
    data
  })
}
