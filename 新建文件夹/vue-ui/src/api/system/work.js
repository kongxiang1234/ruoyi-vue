import request from '@/utils/request'

// 查询擅长工作领域列表
export function listWork(query) {
  return request({
    url: '/system/work/list',
    method: 'get',
    params: query
  })
}

// 查询擅长工作领域详细
export function getWork(areasId) {
  return request({
    url: '/system/work/' + areasId,
    method: 'get'
  })
}

// 新增擅长工作领域
export function addWork(data) {
  return request({
    url: '/system/work',
    method: 'post',
    data: data
  })
}

// 修改擅长工作领域
export function updateWork(data) {
  return request({
    url: '/system/work',
    method: 'put',
    data: data
  })
}

// 删除擅长工作领域
export function delWork(areasId) {
  return request({
    url: '/system/work/' + areasId,
    method: 'delete'
  })
}

// 导出擅长工作领域
export function exportWork(query) {
  return request({
    url: '/system/work/export',
    method: 'get',
    params: query
  })
}
// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/work/treeselect',
    method: 'get'
  })
}
