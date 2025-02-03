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
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from 'react-query'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import PageHeader from 'src/@core/components/page-header'
import TableHeader from 'src/views/apps/services/TableHeader'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ServiceRowType } from 'src/types/apps/serviceTypes'

// ** Actions Imports
import { getServices, deleteServices, UpdateService } from 'src/store/services'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import axios from 'axios'
import { number } from 'yup'
import id from 'date-fns/esm/locale/id/index.js'

interface Colors {
  [key: string]: ThemeColor
}

interface CellType {
  row: ServiceRowType
}

const colors: Colors = {
  support: 'info',
  users: 'success',
  manager: 'warning',
  administrator: 'primary',
  'restricted-user': 'error'
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
    flex: 0.25,
    minWidth: 215,
    field: 'createdAt',
    headerName: 'Created Date',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.createdAt}</Typography>
  }
]

const ServicesTable = () => {
  // ** State
  const { data: services, isLoading, error } = useQuery('services', getServices)
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [editValue, setEditValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(10)
  const [idService, setIdService] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const handleFilter = (val: string) => {
    setValue(val)
  }

  const deleteMutation = useMutation(deleteServices, {
    onSuccess: () => {
      queryClient.invalidateQueries('services')
      toast.success('deleted successfully')
    }
  })
  const handleDelete = (id: any) => {
    deleteMutation.mutate(id)
  }
  const handleEditService = (id: any, name: string) => {
    setName(name)
    setIdService(id)
    setEditDialogOpen(true)
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const updateServiceMutation = useMutation(UpdateService, {
    onSuccess: () => {
      queryClient.invalidateQueries('services')
      toast.success('updated successfully')
    }
  })
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log('test od service------', idService)
    const data = { name: name }
    updateServiceMutation.mutate({ idService, data })
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
          <IconButton onClick={() => handleEditService(row.id, row.name)}>
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
        {/* <Grid item xs={12}>
          <PageHeader title={<Typography variant='h5'>Services List</Typography>} />
        </Grid> */}
        <Grid item xs={12}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Icon icon='mdi:account-service-outline' color='#915592' width='60' height='80' />
            </div>
            <CardHeader title='Services List' style={{ textAlign: 'center', marginTop: '-20px' }}></CardHeader>
            {/* <CardContent style={{ textAlign: 'center', marginTop: '-10px' }}>
              Create, configure, and assign work schedules to your <br /> employees
            </CardContent> */}
            <TableHeader value={value} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              rows={services}
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
            Edit Service
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mx: 'auto' }}>
          <Box component='form' sx={{ mt: 8 }} onSubmit={onSubmit}>
            <FormGroup sx={{ mb: 2, alignItems: 'center', flexDirection: 'row', flexWrap: ['wrap', 'nowrap'] }}>
              <TextField
                fullWidth
                size='small'
                value={name}
                label='Service Name'
                sx={{ mr: [0, 4], mb: [3, 0] }}
                placeholder='Enter Service Name'
                onChange={e => setName(e.target.value)}
              />

              <Button type='submit' variant='contained'>
                Update
              </Button>
            </FormGroup>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServicesTable
