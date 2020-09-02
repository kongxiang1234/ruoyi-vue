import request from '@/utils/request'

// 查询人员的状态设置列表
export function listSettings(query) {
  return request({
    url: '/state/settings/list',
    method: 'get',
    params: query
  })
}

// 查询人员的状态设置详细
export function getSettings(id) {
  return request({
    url: '/state/settings/' + id,
    method: 'get'
  })
}

// 新增人员的状态设置
export function addSettings(data) {
  return request({
    url: '/state/settings',
    method: 'post',
    data: data
  })
}

// 修改人员的状态设置
export function updateSettings(data) {
  return request({
    url: '/state/settings',
    method: 'put',
    data: data
  })
}

// 删除人员的状态设置
export function delSettings(id) {
  return request({
    url: '/state/settings/' + id,
    method: 'delete'
  })
}

// 导出人员的状态设置
export function exportSettings(query) {
  return request({
    url: '/state/settings/export',
    method: 'get',
    params: query
  })
}