/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'admin') return '/home'
}

export default getHomeRoute
