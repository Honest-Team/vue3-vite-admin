import request from '/src/utils/request'

export function getCurrentUser() {
    return request.get('/sysUserService/getCurrentUser')
}


export function queryByCondition(data) {
    return request.get('/sysUserService/queryByCondition', {params: data})
}

export function getUser(data) {
    return request.get('/sysUserService/' + data)
}


export function save(data) {
    return request.post('/sysUserService/save', data)
}

export function update(data) {
    return request.post('/sysUserService/update', data)
}


export function deleteByIds(data) {
    return request.post('/sysUserService/deleteByIds', data)
}

export function updatePassword(data) {
    return request.post('/sysUserService/updatePassword', data)
}


