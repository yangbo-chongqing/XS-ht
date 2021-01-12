import request from '@/utils/request'
// 商家导图编辑
export function mapEdit(data) {
  return request({
    url: '/api/store/map/edit',
    method: 'post',
    data
  })
}