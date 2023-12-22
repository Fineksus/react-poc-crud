const navigation = () => [
  {
    title: 'Home',
    path: '/home',
    icon: 'tabler:smart-home',
  },
  {
    title: 'Employees',
    path: '/employees',
    subject: 'employees',
    icon: 'tabler:users',
  },
  {
    path: '/acl',
    action: 'read',
    subject: 'acl-page',
    title: 'Access Control',
    icon: 'tabler:shield',
  }
]

export default navigation
