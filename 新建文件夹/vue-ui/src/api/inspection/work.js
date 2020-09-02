import request from '@/utils/request'

// 查询巡视巡查工作列表
export function listWork(query) {
  return request({
    url: '/inspection/work/list',
    method: 'get',
    params: query
  })
}

// 查询巡视巡查工作详细
export function getWork(id) {
  return request({
    url: '/inspection/work/' + id,
    method: 'get'
  })
}

// 新增巡视巡查工作
export function addWork(data) {
  return request({
    url: '/inspection/work',
    method: 'post',
    data: data
  })
}

// 修改巡视巡查工作
export function updateWork(data) {
  return request({
    url: '/inspection/work',
    method: 'put',
    data: data
  })
}

// 删除巡视巡查工作
export function delWork(id) {
  return request({
    url: '/inspection/work/' + id,
    method: 'delete'
  })
}

// 导出巡视巡查工作
export function exportWork(query) {
  return request({
    url: '/inspection/work/export',
    method: 'get',
    params: query
  })
}