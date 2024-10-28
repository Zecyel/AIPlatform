export const useUserStore = defineStore('user', () => {
  //   const nickname = ref('')
  const username = ref('')
  const role = ref('')
  const logined = ref(false)

  function isLogin() {
    return logined.value
  }

  function login(data: any) {
    username.value = data.username
    role.value = data.role
    logined.value = true
  }

  function logout() {
    username.value = ''
    role.value = ''
    logined.value = false
  }

  function isAdmin() {
    return role.value === 'admin'
  }

  return {
    // fields
    username,
    role,

    // actions
    isLogin,
    login,
    logout,
    isAdmin,
  }
})
