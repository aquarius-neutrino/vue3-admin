// import request from '../utils/request'


// 数据模拟
// 本地模拟用户数据，不请求接口
let mockUserList = [
  { id: 1, name: '张三', age: 22, phone: '13800138000' },
  { id: 2, name: '李四', age: 25, phone: '13900139000' },
  { id: 3, name: '王五', age: 28, phone: '13700137000' },
  { id: 4, name: '赵六', age: 24, phone: '13600136000' },
  { id: 5, name: '钱七', age: 30, phone: '13500135000' }
]

export const getUserList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, data: [...mockUserList] })
    }, 300)
  })
}

export const delUser = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockUserList = mockUserList.filter(item => item.id !== id)
      resolve({ code: 200, msg: '删除成功' })
    }, 300)
  })
}

export const addUser = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...mockUserList.map(item=>item.id)) + 1
      mockUserList.push({...data, id: newId})
      resolve({ code: 200 })
    }, 300)
  })
}

// 编辑用户
export const editUser = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockUserList.findIndex(item=>item.id === data.id)
      if(idx > -1) mockUserList[idx] = data
      resolve({ code: 200 })
    }, 300)
  })
}


// 后端接口联调

// 获取用户列表
// export const getUserList = () => {
//   return request.get('/user/list')
// }

// 删除用户
// export const delUser = (id: number) => {
//   return request.delete(`/user/${id}`)
// }

