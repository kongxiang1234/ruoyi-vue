import request from '@/utils/request'

// 查询查办案件列表
export function listInvestigating(query) {
  return request({
    url: '/investigating/investigating/list',
    method: 'get',
    params: query
  })
}

// 查询查办案件详细
export function getInvestigating(id) {
  return request({
    url: '/investigating/investigating/' + id,
    method: 'get'
  })
}

// 新增查办案件
export function addInvestigating(data) {
  return request({
    url: '/investigating/investigating',
    method: 'post',
    data: data
  })
}

// 修改查办案件
export function updateInvestigating(data) {
  return request({
    url: '/investigating/investigating',
    method: 'put',
    data: data
  })
}

// 删除查办案件
export function delInvestigating(id) {
  return request({
    url: '/investigating/investigating/' + id,
    method: 'delete'
  })
}

// 导出查办案件
export function exportInvestigating(query) {
  return request({
    url: '/investigating/investigating/export',
    method: 'get',
    params: query
  })
}
