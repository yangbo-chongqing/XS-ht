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
// 工单管理-工单完结
export function workorderFinish(data) {
    return request({
        url: '/api/store/workorder/finish',
        method: 'post',
        data
    })
}

// 素材管理-创建素材分类
export function createType(data) {
    return request({
        url: '/api/store/material/type/create',
        method: 'post',
        data
    })
}
// 素材管理-素材分类列表
export function TypeList(data) {
    return request({
        url: '/api/store/material/type/list',
        method: 'post',
        data
    })
}
// 素材管理-删除素材分类
export function delType(data) {
    return request({
        url: '/api/store/material/type/del',
        method: 'post',
        data
    })
}
// 素材管理-编辑素材分类
export function editType(data) {
    return request({
        url: '/api/store/material/type/edit',
        method: 'post',
        data
    })
}
// 素材管理-加入素材库
export function createMater(data) {
    return request({
        url: '/api/store/material/create',
        method: 'post',
        data
    })
}
// 素材管理-素材库列表
export function materList(data) {
    return request({
        url: '/api/store/material/list',
        method: 'post',
        data
    })
}

// 用户管理-用户信息列表
export function userList(data) {
    return request({
        url: '/api/store/user/list',
        method: 'post',
        data
    })
}