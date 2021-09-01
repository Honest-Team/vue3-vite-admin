import request from '/src/utils/request'

export function queryByCondition(data) {
    return request.get('/sysRoleService/queryByCondition', {params: data})
}


export function query() {
    return request.get('/sysRoleService')
}

export function queryById(data) {
    return request.get('/sysRoleService/' + data)
}

export function save(data) {
    return request.post('/sysRoleService/save', data)
}

export function update(data) {
    return request.post('/sysRoleService/update', data)
}


export function deleteByIds(data) {
    return request.post('/sysRoleService/deleteByIds', data)
}
