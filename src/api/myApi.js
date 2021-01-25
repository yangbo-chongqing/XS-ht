import request from '@/utils/request'
//广告设置-广告列表
export function advertisingList(data) {
    return request({
        url: '/api/web/muse/advertising',
        method: 'post',
        data
    })
}