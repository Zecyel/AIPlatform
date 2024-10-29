export default defineNuxtRouteMiddleware((to, _) => {
  const allowedPaths = [
    '/',
    '/user/login',
    '/user/register',
  ]
  const userStore = useUserStore()
  if (!allowedPaths.includes(to.path)) {
    if (!userStore.isLogin()) {
      return navigateTo('/user/login')
    }
  }
})
