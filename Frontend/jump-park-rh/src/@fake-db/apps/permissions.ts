// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Types
import { PermissionRowType } from 'src/types/apps/permissionTypes'

const data: { permissions: PermissionRowType[] } = {
  permissions: [
    {
      id: 1,
      name: 'Management',
      assignedTo: ['administrator'],
      createdDate: '14 Apr 2022, 8:43 PM'
    },
    {
      id: 2,
      assignedTo: ['administrator'],
      name: 'Manage Billing & Roles',
      createdDate: '16 Sep 2022, 5:20 PM'
    },
    {
      id: 3,
      name: 'Add & Remove Users',
      createdDate: '14 Oct 2022, 10:20 AM',
      assignedTo: ['administrator', 'manager']
    }
  ]
}

// ------------------------------------------------
// GET: Return Permissions List
// ------------------------------------------------
mock.onGet('/apps/permissions/data').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()
  const filteredData = data.permissions.filter(
    permissions =>
      permissions.name.toLowerCase().includes(queryLowered) ||
      permissions.createdDate.toLowerCase().includes(queryLowered) ||
      permissions.assignedTo.some(i => i.toLowerCase().startsWith(queryLowered))
  )

  return [
    200,
    {
      params: config.params,
      allData: data.permissions,
      permissions: filteredData,
      total: filteredData.length
    }
  ]
})
