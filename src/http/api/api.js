import { request } from '../request/request.js'

export function getUserLists(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export function saveRoleInfos(id, rid) {
  return request({
    url: `/users/${id}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}

