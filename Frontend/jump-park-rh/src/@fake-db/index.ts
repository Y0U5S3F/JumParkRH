import mock from './mock'

import './auth/jwt'
import './cards'
import './apps/userList'
import './pages/faq'
import './pages/pricing'
import './pages/profile'

mock.onAny().passThrough()
