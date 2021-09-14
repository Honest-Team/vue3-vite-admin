/**
 * Created by hx on 2020/6/5.
 */

import {getList} from '/src/api/sysDictDetailService'

const BASE_URL = import.meta.env.VITE_BASE_URL
const state = {
  userInfo: [], // 用户信息
  dict: {}, // 字典表
}

// 缓存字典表
export function getDictionary() {
  getList().then(res => {
    let allDictsObj = {}
    res.data.forEach(ele => {
      const item = {
        label: ele.label,
        value: ele.value,
        dictCode: ele.dictCode,
      }
      if (allDictsObj[ele.dictCode]) {
        allDictsObj[ele.dictCode].push(item)
      } else {
        allDictsObj[ele.dictCode] = [];
        allDictsObj[ele.dictCode].push(item)
      }
    })
    state.dict = allDictsObj;
  })
}


export default {
  BASE_URL,
  state,
}
