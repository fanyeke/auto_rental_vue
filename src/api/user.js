import requestHttp from '@/utils/request'

//登录 
export async function login(data) {
    return await requestHttp.login('/rental/user/login', data)
}
//获取用户信息
export async function getInfo(){
  return await requestHttp.get('/rental/auth/getInfo')
}
//登出
export async function logout(param){
  return await requestHttp.post('/rental/auth/logout',param)
}

//获取用户菜单列表
export async function getMenuList(){
  return await requestHttp.get('/rental/auth/menuList')
}