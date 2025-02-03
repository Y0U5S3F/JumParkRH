// ** Mock
import mock from 'src/@fake-db/mock'

// ** Types
import { UsersType, ProjectListDataType } from 'src/types/apps/userTypes'

const data: { users: UsersType[] } = {
  users: [
    {
      id: 1,
      full_name: 'Galen Slixby',
      company: 'Yotz PVT LTD',
      role: 'editor',
      username: 'gslixby0',
      country: 'El Salvador',
      contact: '(479) 232-9151',
      email: 'gslixby0@abc.net.au',
      currentPlan: 'enterprise',
      status: 'inactive',
      avatar: '',
      avatarColor: 'primary',
      is_superuser: true,
      picture: ''
    },
    {
      id: 2,
      full_name: 'Halsey Redmore',
      company: 'Skinder PVT LTD',
      role: 'author',
      username: 'hredmore1',
      country: 'Albania',
      contact: '(472) 607-9137',
      email: 'hredmore1@imgur.com',
      currentPlan: 'team',
      status: 'pending',
      avatar: '/images/avatars/3.png',
      is_superuser: false,
      picture: ''
    }
  ]
}

const projectListData: ProjectListDataType[] = [
  {
    id: 1,
    hours: '18:42',
    progressValue: 78,
    totalTask: '122/240',
    progressColor: 'success',
    projectType: 'React Project',
    projectTitle: 'BGC eCommerce App',
    img: '/images/icons/project-icons/react.png'
  },
  {
    id: 2,
    hours: '20:42',
    progressValue: 18,
    totalTask: '9/56',
    progressColor: 'error',
    projectType: 'Figma Project',
    projectTitle: 'Falcon Logo Design',
    img: '/images/icons/project-icons/figma.png'
  },
  {
    id: 3,
    hours: '120:87',
    progressValue: 62,
    totalTask: '290/320',
    progressColor: 'primary',
    projectType: 'VueJs Project',
    projectTitle: 'Dashboard Design',
    img: '/images/icons/project-icons/vue.png'
  },
  {
    id: 4,
    hours: '89:19',
    progressValue: 8,
    totalTask: '7/63',
    progressColor: 'error',
    projectType: 'Xamarin Project',
    projectTitle: 'Foodista Mobile App',
    img: '/images/icons/project-icons/xamarin.png'
  },
  {
    id: 5,
    hours: '230:10',
    progressValue: 49,
    totalTask: '120/186',
    progressColor: 'warning',
    projectType: 'Python Project',
    projectTitle: 'Dojo React Project',
    img: '/images/icons/project-icons/python.png'
  },
  {
    id: 6,
    hours: '342:41',
    progressValue: 92,
    totalTask: '99/109',
    progressColor: 'success',
    projectType: 'Sketch Project',
    projectTitle: 'Blockchain Website',
    img: '/images/icons/project-icons/sketch.png'
  },
  {
    id: 7,
    hours: '12:45',
    progressValue: 88,
    totalTask: '98/110',
    progressColor: 'success',
    projectType: 'HTML Project',
    projectTitle: 'Hoffman Website',
    img: '/images/icons/project-icons/html5.png'
  }
]

// POST: Add new user
mock.onPost('/apps/users/add-user').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data).data

  const { length } = data.users
  let lastIndex = 0
  if (length) {
    lastIndex = data.users[length - 1].id
  }
  user.id = lastIndex + 1

  data.users.unshift({ ...user, avatar: '', avatarColor: 'primary', status: 'active' })

  return [201, { user }]
})

// GET: DATA
mock.onGet('/apps/users/list').reply(config => {
  const { q = '', role = null, status = null, currentPlan = null } = config.params ?? ''

  const queryLowered = q.toLowerCase()

  const filteredData = data.users.filter(
    user =>
      (user.username.toLowerCase().includes(queryLowered) ||
        user.full_name.toLowerCase().includes(queryLowered) ||
        user.role.toLowerCase().includes(queryLowered) ||
        (user.email.toLowerCase().includes(queryLowered) &&
          user.currentPlan.toLowerCase().includes(queryLowered) &&
          user.status.toLowerCase().includes(queryLowered))) &&
      user.role === (role || user.role) &&
      user.currentPlan === (currentPlan || user.currentPlan) &&
      user.status === (status || user.status)
  )

  return [
    200,
    {
      allData: data.users,
      users: filteredData,
      params: config.params,
      total: filteredData.length
    }
  ]
})

// DELETE: Deletes User
mock.onDelete('/apps/users/delete').reply(config => {
  // Get user id from URL
  const userId = config.data

  const userIndex = data.users.findIndex(t => t.id === userId)
  data.users.splice(userIndex, 1)

  return [200]
})

// GET: DATA
mock.onGet('/apps/users/project-list').reply(config => {
  const { q = '' } = config.params ?? ''

  const queryLowered = q.toLowerCase()

  const filteredData = projectListData.filter(
    user =>
      user.projectTitle.toLowerCase().includes(queryLowered) ||
      user.projectType.toLowerCase().includes(queryLowered) ||
      user.totalTask.toLowerCase().includes(queryLowered) ||
      user.hours.toLowerCase().includes(queryLowered) ||
      String(user.progressValue).toLowerCase().includes(queryLowered)
  )

  return [200, filteredData]
})
