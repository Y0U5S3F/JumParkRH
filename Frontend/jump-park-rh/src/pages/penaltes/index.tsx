// ** React Imports
import { useState, useEffect, useCallback, FormEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { DataGrid } from '@mui/x-data-grid'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import { BeatLoader } from 'react-spinners'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from 'react-query'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import PageHeader from 'src/@core/components/page-header'
import TableHeader from 'src/views/settings/device/TableHeader'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { DeviceRowType } from 'src/types/apps/deviceTypes'

// ** Actions Imports
import { getDevices, deleteDevice, UpdateDevice, ConnectDevice } from 'src/store/devices'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import axios from 'axios'
import { number } from 'yup'
import { Chip } from '@mui/material'

interface Colors {
  [key: string]: ThemeColor
}

interface CellType {
  row: DeviceRowType
}

const colors: Colors = {
  support: 'info',
  users: 'success',
  manager: 'warning',
  administrator: 'primary',
  'restricted-user': 'error'
}
interface RenderCellProps {
  row: DeviceRowType
}

const DeviceStatusCell: React.FC<RenderCellProps> = ({ row }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [DeviceData, setDeviceData] = useState(null)
  const [isError, setIsError] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    setIsError(false)
    console.info('You clicked the Chip.')
    try {
      // const data = { ip: row.ip, port: row.port }
      const response = await ConnectDevice({ ip: row.ip, port: row.port })
      console.log('device---connect----')
      toast.success('Device connected successfully')
      setDeviceData(response.data)
    } catch (error: any) {
      toast.error('Failed to connect device')
      setIsError(true)
    }
    setIsLoading(false)
  }

  let chipColor: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' = 'primary'
  if (isError) {
    chipColor = 'error'
  } else if (DeviceData !== null) {
    chipColor = 'success'
  }

  return <Chip label='Connected' color={chipColor} onClick={handleClick} />
}

const defaultColumns = [
  {
    flex: 0.25,
    field: 'name',
    minWidth: 240,
    headerName: 'Name',
    renderCell: ({ row }: CellType) => <Typography>{row.name}</Typography>
  },
  {
    flex: 0.35,
    minWidth: 280,
    field: 'ip',
    headerName: 'Adresse IP',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          size='small'
          // key={index}
          skin='light'
          color='primary'
          label={row.ip}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' }, '&:not(:last-of-type)': { mr: 3 } }}
        />
      )
    }
  },
  {
    flex: 0.35,
    minWidth: 280,
    field: 'port',
    headerName: 'Port',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          size='small'
          // key={index}
          skin='light'
          color='primary'
          label={row.port}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' }, '&:not(:last-of-type)': { mr: 3 } }}
        />
      )
    }
  },
  {
    flex: 0.25,
    minWidth: 215,
    field: 'createdAt',
    headerName: 'Created Date',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.createdAt}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 215,
    field: 'status',
    headerName: 'Status Device',
    renderCell: (props: CellType) => <DeviceStatusCell row={props.row} />
  }
]

const DevicesTable = () => {
  // ** State
  const { data: devices, isLoading, error } = useQuery('devices', getDevices)
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [editValue, setEditValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [name, setName] = useState('')
  const [ip, setIP] = useState('')
  const [port, setPort] = useState('')
  const [idDevice, setIdDevice] = useState('')
  const handleFilter = (val: string) => {
    setValue(val)
  }

  const deleteMutation = useMutation(deleteDevice, {
    onSuccess: () => {
      queryClient.invalidateQueries('devices')
      toast.success('deleted successfully')
    }
  })
  const handleDelete = (id: any) => {
    deleteMutation.mutate(id)
  }
  const updateDeviceMutation = useMutation(UpdateDevice, {
    onSuccess: () => {
      queryClient.invalidateQueries('devices')
      toast.success('updated successfully')
    }
  })
  const handleEditDevice = (id: any, name: string, ip: string, port: string) => {
    setName(name)
    setIdDevice(id)
    setIP(ip)
    setPort(port)

    setEditDialogOpen(true)
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log('test od type------', idDevice)
    const data = { name: name, ip: ip, port: port }
    updateDeviceMutation.mutate({ idDevice, data })
    setEditDialogOpen(false)
    e.preventDefault()
    setName('')
  }
  const columns = [
    ...defaultColumns,
    {
      flex: 0.15,
      minWidth: 115,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleEditDevice(row.id, row.name, row.ip, row.port)}>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)}>
            <Icon icon='mdi:delete-outline' />
          </IconButton>
        </Box>
      )
    }
  ]
  if (isLoading) {
    return <BeatLoader color={'#36D7B7'} loading={isLoading} size={15} />
  }

  if (error) {
    return <div className='error-toast'>Oops, something went wrong!</div>
  }
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PageHeader title={<Typography variant='h5'>Devices List</Typography>} />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              rows={devices}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog maxWidth='sm' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
        <DialogTitle sx={{ mx: 'auto', textAlign: 'center' }}>
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
            Edit Device
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mx: 'auto' }}>
          <Box component='form' sx={{ mt: 8 }} onSubmit={onSubmit}>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label='Name device'
                  placeholder='Enter Device Name'
                  name='name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label='Adress IP'
                  placeholder='Enter adress ip'
                  name='ip'
                  value={ip}
                  onChange={e => setIP(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Port'
                  placeholder='Enter Port'
                  name='port'
                  value={port}
                  onChange={e => setPort(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
                Update Device
              </Button>
              <Button type='reset' size='large' variant='outlined' color='secondary' onClick={handleDialogToggle}>
                Discard
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DevicesTable
