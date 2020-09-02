import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listRelations(query) {
  return request({
    url: '/system/relations/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getRelations(id) {
  return request({
    url: '/system/relations/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addRelations(data) {
  return request({
    url: '/system/relations',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateRelations(data) {
  return request({
    url: '/system/relations',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delRelations(id) {
  return request({
    url: '/system/relations/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportRelations(query) {
  return request({
    url: '/system/relations/export',
    method: 'get',
    params: query
  })
}