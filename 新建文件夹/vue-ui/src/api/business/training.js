import request from '@/utils/request'

// 查询业务培训列表
export function listTraining(query) {
  return request({
    url: '/business/training/list',
    method: 'get',
    params: query
  })
}

// 查询业务培训详细
export function getTraining(id) {
  return request({
    url: '/business/training/' + id,
    method: 'get'
  })
}

// 新增业务培训
export function addTraining(data) {
  return request({
    url: '/business/training',
    method: 'post',
    data: data
  })
}

// 修改业务培训
export function updateTraining(data) {
  return request({
    url: '/business/training',
    method: 'put',
    data: data
  })
}

// 删除业务培训
export function delTraining(id) {
  return request({
    url: '/business/training/' + id,
    method: 'delete'
  })
}

// 导出业务培训
export function exportTraining(query) {
  return request({
    url: '/business/training/export',
    method: 'get',
    params: query
  })
}