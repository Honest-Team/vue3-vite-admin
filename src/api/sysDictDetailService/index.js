import request from '/src/utils/request'

export function getOne(data) {
    return request.get('/sysDictDetailService/' + data)
}

export function queryByCondition(data) {
    return request.get('/sysDictDetailService/queryByCondition', {params: data})
}

export function save(data) {
    return request.post('/sysDictDetailService/save', data)
}

export function update(data) {
    return request.post('/sysDictDetailService/update', data)
}

export function deleteByIds(data) {
    return request.post('/sysDictDetailService/deleteByIds', data)
}
