import request from '@/utils/request'
import axios from 'axios'

// 修改用户信息
export function postAccountSettings(data) {
  return request({
    url: '/api/store/account/edit',
    method: 'post',
    data
  })
}
export function login(data) {
  return request({
    url: '/api/store/phone/login',
    method: 'post',
    data
  })
}
export function getInfo() {
  return request({
    url: '/api/store/user/detail',
    method: 'post'
  })
}
// 获取登陆二维码凭证
export function LoginCredentials(data) {
  return request({
    url: '/api/store/login/credentials',
    method: 'post',
    data
  })
}
// 获取二维码状态
export function GetCodeStatus(data) {
  return request({
    url: '/api/store/code/status',
    method: 'post',
    data
  })
}
// 获取协议详情
export function getDetail(data) {
  return request({
    url: '/api/help/details',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '',
    method: 'post'
  })
}

//获取七牛云上传token
export function getQiToken(data) {
  return request({
    url: '/api/qiniu',
    method: 'post',
    data
  })
}

// //获取七牛云上传token
// export function getQiniuTk(mid, tk, suffix = 'png') {
//   return new Promise((resolve, reject) => {
//     let params = {
//       member_id: mid,
//       token: tk,
//       device_id: 'share-poster',
//       suffix: suffix,
//       bucket: 'resource'
//     };
//     axios.post("/api/voice/qiniu/uploadtoken", qs.stringify(params)).then(res => {
//       let data = res.data;
//       if (data.code == 200) {
//         resolve(data.data);
//       } else {
//         Toast(data.msg);
//         reject({ upToken: '', key: '' });
//       }
//     }).catch(err => {
//       Toast(err.message);
//       reject({ upToken: '', key: '' });
//     })
//   })
// }
//上传base64图片到七牛云
export function uploadToQiniu(upToken, key, pic) {
  return new Promise((resolve, reject) => {
    pic = pic.replace(/^data[\S]+;base64,/, '');
    axios.post('https://upload.qiniup.com/putb64/-1', pic, {
      headers: { 'Content-Type': 'application/octet-stream', 'Authorization': "UpToken " + upToken },
      signature: 'yes'
    }).then(res => {
      let data = res.data;
      if (res.status == 200) {
        resolve('http://resource.xunsheng.org.cn/' + key);
      } else {
        Toast(data.msg);
        reject('');
      }
    }).catch(err => {
      Toast(err.message);
      reject('');
    })
  })
}
