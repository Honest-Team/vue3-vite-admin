import request from '/src/utils/request'

export function save(data) {
    return request.post('/sysMenuService/save', data)
}

export function update(data) {
    return request.post('/sysMenuService/update', data)
}

export function deleteByIds(data) {
    return request.post('/sysMenuService/deleteByIds', data)
}


export function getTreeByCondition(data) {
    return request.get('/sysMenuService/getTreeByCondition', {params: data})
}