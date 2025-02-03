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
import TableHeader from 'src/views/settings/configConge/TableHeader'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CongeTypeRowType } from 'src/types/apps/congeTypes'

// ** Actions Imports
import { getTypeConges, deleteTypeConge, UpdateTypeConge } from 'src/store/settings/configConge'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import axios from 'axios'
import { number } from 'yup'
import { Radio, RadioGroup } from '@mui/material'

interface Colors {
  [key: string]: ThemeColor
}

interface CellType {
  row: CongeTypeRowType
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
    field: 'color',
    minWidth: 240,
    headerName: 'Color',
    renderCell: ({ row }: CellType) => (
      <Typography>
        <div style={{ marginBottom: '20px', width: '100px', height: '20px', backgroundColor: row.color }}></div>
      </Typography>
    )
  },
  {
    flex: 0.25,
    minWidth: 215,
    field: 'createdAt',
    headerName: 'Created Date',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.createdAt}</Typography>
  }
]

const TypeCongeTable = () => {
  // ** State
  const { data: typeConge, isLoading, error } = useQuery('typeConge', getTypeConges)
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [editValue, setEditValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [color, setColor] = useState('#008000')
  const [name, setName] = useState('')
  const [idType, setIdType] = useState<number>(0)

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
  }

  const deleteMutation = useMutation(deleteTypeConge, {
    onSuccess: () => {
      queryClient.invalidateQueries('typeConge')
      toast.success('deleted successfully')
    }
  })
  const handleDelete = (id: any) => {
    deleteMutation.mutate(id)
  }
  const updateTypeCongeMutation = useMutation(UpdateTypeConge, {
    onSuccess: () => {
      queryClient.invalidateQueries('typeConge')
      toast.success('updated successfully')
    }
  })
  const handleEditTypeConge = (id: any, name: string, color: string) => {
    setName(name)
    setIdType(id)
    setColor(color)
    setEditDialogOpen(true)
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log('test od type------', idType)
    const data = { name: name, color: color }
    updateTypeCongeMutation.mutate({ idType, data })
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
          <IconButton onClick={() => handleEditTypeConge(row.id, row.name, row.color)}>
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
            <CardHeader title='Types conge' style={{ textAlign: 'center', marginTop: '-20px' }}></CardHeader>
            {
              <CardContent style={{ textAlign: 'center', marginTop: '-10px' }}>
                Gérez les types d'conges au sein de votre entreprise
                <br /> afin que vos collaborateurs puissent les sélectionner <br />
                lorsqu'ils demandent des congés.
              </CardContent>
            }
            <TableHeader value={value} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              rows={typeConge}
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
            Modifier Type conge
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 12, mx: 'auto' }}>
          <Box
            component='form'
            onSubmit={onSubmit}
            sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            {/* <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label='Name service'
                  placeholder='Enter Service Name'
                  name='name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
            </Grid> */}
            <TextField
              fullWidth
              label='Nom Conge'
              sx={{ mb: 1, maxWidth: 360 }}
              placeholder='Enter Name'
              name='name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <RadioGroup row aria-label='colored' name='colored' defaultValue='primary' sx={{ mb: 1, maxWidth: 360 }}>
              <Radio
                color='default'
                checked={color === '#ff0000'}
                onChange={handleColorChange}
                value='#ff0000'
                name='color'
                style={{
                  color: '#ff0000',
                  borderRadius: color === '#ff0000' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={color === '#008000'}
                onChange={handleColorChange}
                value='#008000'
                name='color'
                style={{
                  color: '#008000', // Set custom color for the radio button
                  borderRadius: color === '#008000' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={color === '#0000FF'}
                onChange={handleColorChange}
                value='#0000FF'
                name='color'
                style={{
                  color: '#0000FF',
                  borderRadius: color === '#0000FF' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={color === '#FF869E'}
                onChange={handleColorChange}
                value='#FF869E'
                name='color'
                style={{
                  color: '#FF869E',
                  borderRadius: color === '#FF869E' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={color === '#6AC7CE'}
                onChange={handleColorChange}
                name='color'
                value='#6AC7CE'
                style={{
                  color: '#6AC7CE',
                  borderRadius: color === '#6AC7CE' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={color === '#68CC45'}
                onChange={handleColorChange}
                value='#68CC45'
                name='color'
                style={{
                  color: '#68CC45',
                  borderRadius: color === '#68CC45' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={color === '#AEAEB8'}
                name='color'
                onChange={handleColorChange}
                value='#AEAEB8'
                style={{
                  color: '#AEAEB8',
                  borderRadius: color === '#AEAEB8' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={color === '#877FED'}
                name='color'
                onChange={handleColorChange}
                value='#877FED'
                style={{
                  color: '#877FED',
                  borderRadius: color === '#877FED' ? '50%' : '0'
                }}
              />
            </RadioGroup>

            {/* <Typography sx={{ mb: 2, fontWeight: 500 }}>L'absence doit-elle être approuvée ?</Typography> */}

            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
                Update Type Conge
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

export default TypeCongeTable
