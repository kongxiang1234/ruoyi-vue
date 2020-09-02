import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listCertificate(query) {
  return request({
    url: '/system/certificate/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getCertificate(id) {
  return request({
    url: '/system/certificate/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addCertificate(data) {
  return request({
    url: '/system/certificate',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateCertificate(data) {
  return request({
    url: '/system/certificate',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delCertificate(id) {
  return request({
    url: '/system/certificate/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportCertificate(query) {
  return request({
    url: '/system/certificate/export',
    method: 'get',
    params: query
  })
}