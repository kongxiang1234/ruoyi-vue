import request from '@/utils/request'

// 查询专题授课列表
export function listLecture(query) {
  return request({
    url: '/special/lecture/list',
    method: 'get',
    params: query
  })
}

// 查询专题授课详细
export function getLecture(id) {
  return request({
    url: '/special/lecture/' + id,
    method: 'get'
  })
}

// 新增专题授课
export function addLecture(data) {
  return request({
    url: '/special/lecture',
    method: 'post',
    data: data
  })
}

// 修改专题授课
export function updateLecture(data) {
  return request({
    url: '/special/lecture',
    method: 'put',
    data: data
  })
}

// 删除专题授课
export function delLecture(id) {
  return request({
    url: '/special/lecture/' + id,
    method: 'delete'
  })
}

// 导出专题授课
export function exportLecture(query) {
  return request({
    url: '/special/lecture/export',
    method: 'get',
    params: query
  })
}