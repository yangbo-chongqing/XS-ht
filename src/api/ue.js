import request from '@/utils/request'

// 上传图片集
export function createPics(data) {
    return request({
        url: '/api/store/album/create',
        method: 'post',
        data
    })
}
// 删除图片集
export function delPic(data) {
    return request({
        url: '/api/store/album/del',
        method: 'post',
        data
    })
}

// 删除图片集
export function details(data) {
    return request({
        url: '/api/store/album/details',
        method: 'post',
        data
    })
}