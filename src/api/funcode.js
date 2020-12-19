import request from '@/utils/request'
// 表单配置
export function postConfig(data) {
  return request({
    url: '/api/store/form/config',
    method: 'post',
    data
  })
}
