export default defineNuxtRouteMiddleware((to, _) => {
  const userStore = useUserStore()
  const allowedPaths = ['/user/login', '/', '/user/register']
  if (!allowedPaths.includes(to.path)) {
    if (!userStore.isLogin()) {
      return navigateTo('/user/login')
    }
  }
})
