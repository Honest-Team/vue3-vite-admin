import request from '/src/utils/request'

export function getOne(data) {
    return request.get('/sysDictService/' + data)
}

export function queryByCondition(data) {
    return request.get('/sysDictService/queryByCondition', {params: data})
}

export function save(data) {
    return request.post('/sysDictService/save', data)
}

export function update(data) {
    return request.post('/sysDictService/update', data)
}

export function deleteByIds(data) {
    return request.post('/sysDictService/deleteByIds', data)
}
