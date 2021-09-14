import request from '/src/utils/request'

export function save(data) {
    return request.post('/sysDeptService/save', data)
}

export function update(data) {
    return request.post('/sysDeptService/update', data)
}

export function deleteByIds(data) {
    return request.post('/sysDeptService/deleteByIds', data)
}


export function getTreeByCondition(data) {
    return request.get('/sysDeptService/getTreeByCondition', {params: data})
}