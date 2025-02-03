// ** React Imports
import { FormEvent, SetStateAction, ChangeEvent, useState } from 'react'

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
import TableHeader from 'src/views/request/absences/TableHeader'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { AbsenceRowType } from 'src/types/apps/absences'

// ** Actions Imports
import { getAbsences, deleteAbsence, UpdateAbsence } from 'src/store/request/absences'
import { getTypeAbsence } from 'src/store/settings/configAbsence'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import axios from 'axios'
import { number } from 'yup'
import { FormControl, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material'

interface Colors {
  [key: string]: ThemeColor
}

interface CellType {
  row: AbsenceRowType
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
    field: 'user_name',
    minWidth: 240,
    headerName: 'Employee',
    renderCell: ({ row }: CellType) => <Typography>{row.user_name}</Typography>
  },
  {
    flex: 0.25,
    field: 'reason_name',
    minWidth: 240,
    headerName: 'Type',
    renderCell: ({ row }: CellType) => <Typography>{row.reason_name}</Typography>
  },
  {
    flex: 0.25,
    field: 'start_date',
    minWidth: 240,
    headerName: 'Début congé',
    renderCell: ({ row }: CellType) => <Typography>{row.start_date}</Typography>
  },
  {
    flex: 0.25,
    field: 'end_date',
    minWidth: 240,
    headerName: 'Fin congé',
    renderCell: ({ row }: CellType) => <Typography>{row.end_date}</Typography>
  },
  {
    flex: 0.25,
    field: 'status',
    minWidth: 240,
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      let chipColor: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' = 'primary'

      //   let chipColor = 'success' // Default color for validation
      let chipLabel = row.status

      if (row.status === 'En_cours') {
        chipColor = 'warning'
        chipLabel = 'En cours'
      } else if (row.status === 'Refuser') {
        chipColor = 'error'
        chipLabel = 'Refuser'
      } else if (row.status === 'Valider') {
        chipColor = 'success'
        chipLabel = 'Accepter'
      }

      return <CustomChip size='small' skin='light' color={chipColor} label={chipLabel} />
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

const AbsenceTable = () => {
  // ** State
  const { data: absences, isLoading, error } = useQuery('absences', getAbsences)
  const { data: typeAbsence } = useQuery('typeAbsence', getTypeAbsence)

  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [editValue, setEditValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [color, setColor] = useState('#008000')
  const [status, setStatus] = useState('')
  const [idType, setIdType] = useState<number>(0)

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
  }

  const deleteMutation = useMutation(deleteAbsence, {
    onSuccess: () => {
      queryClient.invalidateQueries('absences')
      toast.success('deleted successfully')
    }
  })
  const handleDelete = (id: any) => {
    deleteMutation.mutate(id)
  }
  const updateTypeAbsenceMutation = useMutation(UpdateAbsence, {
    onSuccess: () => {
      queryClient.invalidateQueries('absences')
      toast.success('updated successfully')
    }
  })
  const handleEditTypeAbsence = (id: any, status: string) => {
    setStatus(status)
    setIdType(id)
    setEditDialogOpen(true)
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log('test od type------', idType)
    const data = { status: status }
    updateTypeAbsenceMutation.mutate({ idType, data })
    setEditDialogOpen(false)
    e.preventDefault()
    setStatus('')
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
          <IconButton onClick={() => handleEditTypeAbsence(row.id, row.status)}>
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
            <CardHeader title='Demande absence' style={{ textAlign: 'center', marginTop: '-20px' }}></CardHeader>
            {
              <CardContent style={{ textAlign: 'center', marginTop: '-10px' }}>
                Gérez les demandes des absences au sein de votre entreprise
              </CardContent>
            }
            <TableHeader value={value} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              rows={absences}
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
            Modifier Absence
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 12, mx: 'auto' }}>
          <Box
            component='form'
            onSubmit={onSubmit}
            sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-select-label'>Status</InputLabel>
              <Select
                label='Status'
                name='status'
                value={status}
                onChange={e => setStatus(e.target.value)}
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
              >
                <MenuItem value='En_cours'>En cours</MenuItem>
                <MenuItem value='Refuser'>Refuser</MenuItem>
                <MenuItem value='Valider'>Accepter</MenuItem>
              </Select>
            </FormControl>

            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
                Update Absence
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

export default AbsenceTable
