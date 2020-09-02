import request from '@/utils/request'

// 查询personnel列表
export function listInformation(query) {
  return request({
    url: '/personnel/information/list',
    method: 'get',
    params: query
  })
}

// 查询personnel列表
export function statisticalList(query) {
  return request({
    url: '/personnel/information/statisticalList',
    method: 'get',
    params: query
  })
}
// 查询personnel详细
export function getInformation(id) {
  return request({
    url: '/personnel/information/' + id,
    method: 'get'
  })
}

// 新增personnel
export function addInformation(data) {
  return request({
    url: '/personnel/information',
    method: 'post',
    data: data
  })
}

// 修改personnel
export function updateInformation(data) {
  return request({
    url: '/personnel/information',
    method: 'put',
    data: data
  })
}

// 删除personnel
export function delInformation(id) {
  return request({
    url: '/personnel/information/' + id,
    method: 'delete'
  })
}
// 删除personnel
export function removeFaily(id) {
  return request({
    url: '/personnel/information/removeFaily/' + id,
    method: 'delete'
  })
}
// 查询用户个人信息
export function getUserProfile(id) {
  return request({
    url: '/personnel/information/info/' + id,
    method: 'get'
  })
}
// 删除personnel
export function removeCertificate(id) {
  return request({
    url: '/personnel/information/removeCertificate/' + id,
    method: 'delete'
  })
}

// 导出personnel
export function exportInformation(query) {
  return request({
    url: '/personnel/information/export',
    method: 'get',
    params: query
  })
}
