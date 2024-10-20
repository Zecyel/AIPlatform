export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  const allowedPaths = ['/user/login', '/test']
  if (!allowedPaths.includes(to.path)) {
    if (!userStore.isLogin()) {
      return navigateTo('/user/login')
    }
  }
})
