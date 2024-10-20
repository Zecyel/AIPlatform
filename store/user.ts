export const useUserStore = defineStore('user', () => {
//   const nickname = ref('')
  const username = ref('')
  const studentId = ref('')
  const role = ref('')
  const _class = ref('')
  const points = ref(0)
  const logined = ref(false)

  function isLogin() {
    return logined
  }

  function login(data: any) {
    username.value = data.username
    studentId.value = data.studentId
    role.value = data.role
    _class.value = data.class
    points.value = data.points
    logined.value = true
  }

  function logout() {
    username.value = ''
    studentId.value = ''
    role.value = ''
    _class.value = ''
    points.value = 0
    logined.value = false
  }

  return {
    // fields
    username,
    _class,
    studentId,
    role,

    // actions
    isLogin,
    login,
    logout,
  }
})
