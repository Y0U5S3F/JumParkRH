// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, Fragment } from 'react'
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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchUsers, CreateUser, getUsers, deleteUser, deletedUser } from 'src/store/user'

// ** Third Party Components
import axios from 'axios'
import { BeatLoader } from 'react-spinners'
import ReactPaginate from 'react-paginate'

// ** Types Imports
import { RootState } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material'
import OptionsMenu from 'src/@core/components/option-menu'
import { toast } from 'react-hot-toast'
import ConfigTimeFixe from '../planning'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
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
  row: UsersType
}

const userStatusObj: UserStatusType = {
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
const renderClient = (row: UsersType) => {
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
  const [open, setOpen] = useState<boolean>(false)

  const rowOptionsOpen = Boolean(anchorEl)
  const [deleteDialogOpen, setdeleteDialogOpen] = useState<boolean>(false)

  const [is_deleted, setDeleted] = useState<boolean>(true)
  const [idUser, setIdUser] = useState<number>(0)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }
  const queryClient = useQueryClient()

  const deleteMutation = useMutation(deletedUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      toast.success('deleted successfully')
    }
  })
  const handleDelete = (id: any) => {
    setDeleted(true)
    setIdUser(id)
    setdeleteDialogOpen(true)
    handleRowOptionsClose()
  }
  const handleDialogToggle = () => setdeleteDialogOpen(!deleteDialogOpen)

  // const handleEditdepartment = (id: any, name: string) => {
  //   setName(name)
  //   setIddepartment(id)
  //   setEditDialogOpen(true)
  // }
  // const handleDelete = () => {
  //   deleteUser(id)
  //   handleRowOptionsClose()
  // }

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
        {/* <MenuItem onClick={handleRowOptionsClose}>
          <Link
            href='/apps/user/profile/[id]/user-profile/[tab]'
            as={`/apps/user/profile/${id}/user-profile/profile`}
            passHref
          >
            <MenuItem>
              <Icon icon='mdi:eye-outline' fontSize={20} />
              View
            </MenuItem>
          </Link>
        </MenuItem> */}
        <MenuItem
          onClick={handleRowOptionsClose}
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/apps/user/edit/${id}`}
        >
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleDelete(id)}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>

      <Fragment>
        {/* <Button variant='outlined' onClick={handleClickOpen}>
          Open dialog
        </Button> */}
        <Dialog
          onClose={handleDialogToggle}
          open={deleteDialogOpen}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Supprimer employe </DialogTitle>
          <Alert
            severity='warning'
            action={
              <IconButton size='small' color='inherit' aria-label='close'>
                <Icon icon='mdi:close' fontSize='inherit' />
              </IconButton>
            }
          >
            <AlertTitle>Attention</AlertTitle>
            Si vous supprimez un employe — <strong>toutes les données associées seront supprimées!</strong>
          </Alert>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              êtes-vous sûr de vouloir supprimer cet employee ?
            </DialogContentText>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button
              onClick={() => {
                deleteMutation.mutate({ idUser, data: { is_deleted } }), setdeleteDialogOpen(true)
              }}
            >
              Supprimer
            </Button>
            <Button onClick={handleDialogToggle}>Retour</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </>
  )
}

const columns = [
  {
    flex: 0.1,
    minWidth: 90,
    field: 'picture',
    headerName: 'Photo',
    renderCell: ({ row }: CellType) => {
      return <Avatar alt='Victor Anderson' sx={{ borderRadius: '8px' }} src={row.picture} />
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'full_name',
    headerName: 'User',
    renderCell: ({ row }: CellType) => {
      const { full_name, username, picture } = row

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

  // {
  //   flex: 0.2,
  //   minWidth: 230,
  //   field: 'picture',
  //   headerName: 'Photo',
  //   renderCell: ({ row }: CellType) => {
  //     const { full_name, username, picture } = row

  //     return (
  //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //         {renderClient(row)}
  //         <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
  //           {/* <StyledLink href='#'>{full_name}</StyledLink> */}

  //           <Typography noWrap variant='caption'>
  //             <Avatar alt='Victor Anderson' sx={{ width: 56, height: 56, borderRadius: '8px' }} src={picture} />
  //           </Typography>
  //         </Box>
  //       </Box>
  //     )
  //   }
  // },
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
          color={userStatusObj[row.status]}
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
  const { data: users, isLoading, error } = useQuery('users', getUsers)
  const [show, setShow] = useState<boolean>(false)
  const [ID, setID] = useState<string>('')

  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'grid' | 'card'>('grid')
  const switchToCardView = () => {
    setViewMode('card')
  }
  const [rows, setRows] = useState([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [newPage, setNewPage] = useState<number>(1)

  const cardsPerPage = 6
  const startIndex = currentPage * cardsPerPage
  const endIndex = startIndex + cardsPerPage

  const { data: employes } = useQuery(['employes', currentPage], () => fetchUsers(currentPage), {
    keepPreviousData: true
  })
  const rowss = employes?.results || []
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1)
    }
  }

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1)
  }
  // const handlePageChange = (selectedPage: { selected: number }) => {
  //   setCurrentPage(selectedPage.selected)
  // }
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

  const handleClick = (id: any) => {
    setID(id)
    setShow(true);
  };
  const handleClose = () => {
    setShow(false)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
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
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='author'>Author</MenuItem>
                    <MenuItem value='editor'>Editor</MenuItem>
                    <MenuItem value='maintainer'>Maintainer</MenuItem>
                    <MenuItem value='subscriber'>Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
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
              </Grid>
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
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button
              // startIcon={<Icon icon='mdi:account-arrow-right' fontSize={20} />}
              onClick={() => setViewMode(viewMode === 'grid' ? 'card' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <Icon
                  icon='mdi:credit-card-outline'
                  fontSize={30}
                // style={{
                //   // paddingBottom: '10',
                //   color: '#fa4d32',
                //   position: 'absolute',
                //   top: '20px',
                //   right: '20px'
                // }}
                />
              ) : (
                <Icon
                  icon='mdi:grid'
                  fontSize={30}
                // style={{
                //   // paddingBottom: '10',
                //   color: '#fa4d32',
                //   position: 'absolute',
                //   top: '5px',
                //   right: '5px'
                // }}
                />
              )}
            </Button>
          </Box>
          {viewMode === 'grid' ? (
            <DataGrid
              autoHeight
              rows={users}
              columns={columns}
              checkboxSelection
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            // pageSize={pageSize}
            // page={currentPage}
            // onPageChange={(newPage: number) => setCurrentPage(newPage)}
            />
          ) : (
            <Grid container spacing={6} sx={{ p: 6 }}>
              {employes?.results?.map((user: any) => (
                <Grid key={user.id} item xs={12} sm={6} md={4}>
                  <Card sx={{ position: 'relative', backgroundColor: '#d5e7eb' }}>
                    <OptionsMenu
                      iconButtonProps={{ size: 'small', sx: { top: 12, right: 12, position: 'absolute' } }}
                      options={[
                        'Share Connection',
                        'Block Connection',
                        { divider: true },
                        { text: 'Delete', menuItemProps: { sx: { color: 'error.main' } } }
                      ]}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Avatar src={user.picture} sx={{ mb: 4, width: 100, height: 100 }} />
                        <Typography variant='h6' sx={{ fontWeight: 500 }}>
                          {user.full_name}
                        </Typography>
                        <Typography sx={{ mb: 4, color: 'text.secondary' }}>{user.role}</Typography>

                        <Box
                          sx={{
                            mb: 8,
                            gap: 2,
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography variant='h5'>Email</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{user.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography variant='h5'>Fonction</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{user.role}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography variant='h5'>Status</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{user.status}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {/* <Button
                            sx={{ mr: 4 }}
                            variant={user.is_active ? 'contained' : 'outlined'}
                            startIcon={
                              <Icon
                                fontSize={20}
                                icon={user.is_active ? 'mdi:account-check-outline' : 'mdi:account-plus-outline'}
                              />
                            }
                          >
                            {user.is_active ? 'Connected' : 'Connect'}
                          </Button> */}
                          {/* <Button variant='outlined' color='secondary' sx={{ p: 1.5, minWidth: 38 }}>
                            <Icon icon='mdi:email-outline' />
                          </Button> */}
                          <Button variant='contained' onClick={() => handleClick(user.id)}>
                            Configuration de planning
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<ArrowBackIosIcon />}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                ></Button>
                <Button
                  variant='contained'
                  color='primary'
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={handleNextPage}
                  disabled={!employes.next}
                  style={{ marginLeft: 'auto' }}
                ></Button>
              </Grid>
            </Grid>
          )}
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
      {show && ID && <ConfigTimeFixe open={show} id={ID} onClose={handleClose} />}
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  console.log('user---', res)
  const apiData: CardStatsType = res.data
  // const rows = await fetch('http://127.0.0.1:8000/api/auth/users/').then(res => res.json())
  // console.log('list usersssss---', rows)

  return {
    props: {
      apiData
      // rows
    }
  }
}

export default UserList
