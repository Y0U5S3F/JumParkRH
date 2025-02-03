// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, getMangers, deleteUser } from 'src/store/manager'

// ** Third Party Components
import axios from 'axios'
import { BeatLoader } from 'react-spinners'

// ** Types Imports
import { RootState } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { ManagersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/manager/list/TableHeader'
import AddUserDrawer from 'src/views/manager/list/AddUserDrawer'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface managerstatusType {
  [key: string]: ThemeColor
}

// ** Vars
const userRoleObj: UserRoleType = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  author: { icon: 'mdi:cog-outline', color: 'warning.main' },
  editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}

interface CellType {
  row: ManagersType
}

const managerstatusObj: managerstatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column
const renderClient = (row: ManagersType) => {
  if (row.is_superuser) {
    return <CustomAvatar src='/images/avatars/1.png' sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
        {getInitials(row.full_name ? row.full_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const RowOptions = ({ id }: { id: number }) => {
  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    deleteUser(id)
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'full_name',
    headerName: 'User',
    renderCell: ({ row }: CellType) => {
      const { full_name, username } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href='#'>{full_name}</StyledLink>
            <Typography noWrap variant='caption'>
              {`@${full_name}`}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'role',
    minWidth: 150,
    headerName: 'Role',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {row.role}
          </Typography>
        </Box>
      )
    }
  },
  // {
  //   flex: 0.15,
  //   field: 'status',
  //   minWidth: 150,
  //   headerName: 'Status',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //         <Typography noWrap sx={{ textTransform: 'capitalize' }}>
  //           {row.status}
  //         </Typography>
  //       </Box>
  //     )
  //   }
  // },

  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.status}
          color={managerstatusObj[row.status]}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]
// const UserList = (props: UserListProps) => {
const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const { data: managers, isLoading, error } = useQuery('managers', getMangers)

  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()
  // const store = useSelector((state: RootState) => state.user)
  //** get managers */
  // const { isLoading, data } = useQuery('managers', () => fetchData())
  // const managers = data ?? []
  // console.log('test userrrrrrrr------', managers)
  const [rows, setRows] = useState([])
  // const [pageSize, setPageSize] = useState(10);

  // useEffect(() => {
  //   axios
  //     .get('http://127.0.0.1:8000/api/auth/managers/')
  //     .then(response => {
  //       const managers = response.data
  //       setRows(managers)
  //       console.log('testttt222---managers--', managers)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }, [])
  // useEffect(() => {

  // }, [plan, role, status, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback((e: SelectChangeEvent) => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  if (isLoading) {
    return <BeatLoader color={'#36D7B7'} loading={isLoading} size={15} />
  }

  if (error) {
    return <div className='error-toast'>Oops, something went wrong!</div>
  }
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal &&
              apiData.statsHorizontal.map((item: CardStatsHorizontalProps, index: number) => {
                return (
                  <Grid item xs={12} md={3} sm={6} key={index}>
                    <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                  </Grid>
                )
              })}
          </Grid>
        )}
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'>Select Fonction</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Fonction'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Fonction' }}
                  >
                    <MenuItem value=''>Select Fonction</MenuItem>
                    <MenuItem value='admin'>Informatique</MenuItem>
                    <MenuItem value='author'>Café</MenuItem>
                    <MenuItem value='editor'>Caisse</MenuItem>
                    <MenuItem value='maintainer'>Coach</MenuItem>
                    <MenuItem value='subscriber'>Acceuil</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='plan-select'>Select Plan</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id='select-plan'
                    label='Select Plan'
                    labelId='plan-select'
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}
                  >
                    <MenuItem value=''>Select Plan</MenuItem>
                    <MenuItem value='basic'>Basic</MenuItem>
                    <MenuItem value='company'>Company</MenuItem>
                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                    <MenuItem value='team'>Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label='Select Status'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Fonction' }}
                  >
                    <MenuItem value=''>Select Status</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rows={managers}
            columns={columns}
            checkboxSelection
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  console.log('user---', res)
  const apiData: CardStatsType = res.data
  // const rows = await fetch('http://127.0.0.1:8000/api/auth/managers/').then(res => res.json())
  // console.log('list managersssss---', rows)

  return {
    props: {
      apiData
      // rows
    }
  }
}

export default UserList
