import request from '@/utils/request'

// 查询实战练兵列表
export function listCombat(query) {
  return request({
    url: '/actual/combat/list',
    method: 'get',
    params: query
  })
}

// 查询实战练兵详细
export function getCombat(id) {
  return request({
    url: '/actual/combat/' + id,
    method: 'get'
  })
}
// 下载
export function getCombatDownload(url) {
  return request({
    url: '/actual/combat/static/' + url,
    method: 'get'
  })
}
// 新增实战练兵
export function addCombat(data) {
  return request({
    url: '/actual/combat',
    method: 'post',
    data: data
  })
}

// 修改实战练兵
export function updateCombat(data) {
  return request({
    url: '/actual/combat',
    method: 'put',
    data: data
  })
}

// 删除实战练兵
export function delCombat(id) {
  return request({
    url: '/actual/combat/' + id,
    method: 'delete'
  })
}

// 导出实战练兵
export function exportCombat(query) {
  return request({
    url: '/actual/combat/export',
    method: 'get',
    params: query
  })
}
