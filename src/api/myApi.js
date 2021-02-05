import request from '@/utils/request'
//广告设置-广告列表
export function advertisingList(data) {
    return request({
        url: '/api/store/advertising/list',
        method: 'post',
        data
    })
}
//广告设置-添加广告
export function advertisingCreate(data) {
    return request({
        url: '/api/store/advertising/create',
        method: 'post',
        data
    })
}
//广告设置-添加广告
export function advertisingEdit(data) {
    return request({
        url: '/api/store/advertising/edit',
        method: 'post',
        data
    })
}
//广告设置-删除广告
export function advertisingDel(data) {
    return request({
        url: '/api/store/advertising/del',
        method: 'post',
        data
    })
}
//广告设置-单个广告的列表
export function detailsList(data) {
    return request({
        url: '/api/store/advertising/details',
        method: 'post',
        data
    })
}

// 工单管理-工单列表
export function workorderList(data) {
    return request({
        url: '/api/store/workorder/list',
        method: 'post',
        data
    })
}
// 工单管理-工单详情
export function workorderDetails(data) {
    return request({
        url: '/api/store/workorder/details',
        method: 'post',
        data
    })
}
// 工单管理-工单详情
export function workorderReply(data) {
    return request({
        url: '/api/store/workorder/reply',
        method: 'post',
        data
    })
}