import {getTreeByCondition} from '@/api/sysDeptService'

// 获取部门的下拉树
export function getDeptTree(callback) {
    getTreeByCondition().then(res => {
        // 顶级域
        const data = [{
            deptId: 0,
            name: "顶级域",
            pid: 0,
            children:res.data
        }]
        callback(data);
    })
}