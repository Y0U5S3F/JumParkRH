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
import TableHeader from 'src/views/apps/recrutments/TableHeader'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { departmentRowType } from 'src/types/apps/departementTypes'

// ** Actions Imports
import { getdepartments, Updatedepartment, deletedepartment, getdepartmentById } from 'src/store/departments'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import axios from 'axios'
import { number } from 'yup'

interface Colors {
  [key: string]: ThemeColor
}

interface CellType {
  row: departmentRowType
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
    flex: 0.35,
    minWidth: 280,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          size='small'
          // key={index}
          skin='light'
          color='primary'
          label={row.email}
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
  }
]

const DepatementsTable = () => {
  // ** State
  const { data: depatements, isLoading, error } = useQuery('depatements', getdepartments)
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [editValue, setEditValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const deleteMutation = useMutation(deletedepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries('depatements')
      toast.success('deleted successfully')
    }
  })
  const handleDelete = (id: any) => {
    deleteMutation.mutate(id)
  }
  const handleEditdepartment = (name: string) => {
    setEditValue(name)
    setEditDialogOpen(true)
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setEditDialogOpen(false)
    e.preventDefault()
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
          <IconButton onClick={() => handleEditdepartment(row.name)}>
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
          <PageHeader title={<Typography variant='h5'>Recrutments List</Typography>} />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              rows={depatements}
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
            Edit Recrutment
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mx: 'auto' }}>
          <Box component='form' sx={{ mt: 8 }} onSubmit={onSubmit}>
            <FormGroup sx={{ mb: 2, alignItems: 'center', flexDirection: 'row', flexWrap: ['wrap', 'nowrap'] }}>
              <TextField
                fullWidth
                size='small'
                value={editValue}
                label='department Name'
                sx={{ mr: [0, 4], mb: [3, 0] }}
                placeholder='Enter department Name'
                onChange={e => setEditValue(e.target.value)}
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

export default DepatementsTable
