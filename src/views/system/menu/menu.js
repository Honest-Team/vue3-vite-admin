import {getTreeByCondition} from '@/api/sysMenuService'

// 获取部门的下拉树
export function getTree(callback) {
    getTreeByCondition().then(res => {
        // 顶级域
        const data = [{
            id: 0,
            title: "上级类目",
            parentId: 0,
            children:res.data
        }]
        callback(data);
    })
}