import request from '@/utils/request'

// 上传图片集
export function createPics(data) {
    return request({
        url: '/api/store/album/create',
        method: 'post',
        data
    })
}