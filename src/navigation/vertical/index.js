const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      subject: 'home',
      icon: 'tabler:smart-home',
    },
    {
      sectionTitle: 'Operation'
    },
    {
      title: 'Employees',
      path: '/employees',
      subject: 'member',
      icon: 'tabler:users',
    },
    {
      title: 'Companies',
      path: '/companies',
      subject: 'company',
      icon: 'tabler:building',
    },
    {
      title: 'Campaings',
      path: '/campaigns',
      subject: 'campaign',
      icon: 'tabler:box',
    }
  ]
}

export default navigation
