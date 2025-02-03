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
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from 'react-query'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import PageHeader from 'src/@core/components/page-header'
import TableHeader from 'src/views/settings/configAbsence/TableHeader'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import { TimeField } from '@mui/x-date-pickers/TimeField'
import InputAdornment from '@mui/material/InputAdornment'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ServiceRowType } from 'src/types/apps/serviceTypes'

// ** Actions Imports
import { getTypeAbsence, deleteTypeAbsence } from 'src/store/settings/configAbsence'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import axios from 'axios'
import { number } from 'yup'
import { TableCell } from '@mui/material'
import { red } from '@mui/material/colors'

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

const TimeTable = () => {
  // ** State
  const [days, setDays] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(days.map(() => false))
  const [time, setTime1] = useState(new Date())
  const [time2, setTime2] = useState(new Date())
  const [time3, setTime3] = useState(new Date())
  const [time4, setTime4] = useState(new Date())

  const { data: typeAbsence, isLoading, error } = useQuery('typeAbsence', getTypeAbsence)
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [editValue, setEditValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const defaultValues = {
    time: '',
    time2: '',
    time3: '',
    time4: ''
  }
  const dayss = [
    {
      id: 1,
      day: 'Lundi',
      start_time_work: '08:00',
      start_time_break: '13:00',
      end_time_work: '17:00',
      number_hours: '08:00',
      is_checked: true
    },
    {
      id: 2,
      day: 'Mardi',
      start_time_work: '09:00',
      end_time_work: '17:00',
      start_time_break: '13:00',
      number_hours: '08:00',
      is_checked: true
    },
    {
      id: 3,
      day: 'Mercredi',
      number_hours: '08:00',
      start_time_work: '08:00',
      end_time_work: '17:00',
      start_time_break: '17:00',
      is_checked: true
    },
    {
      id: 4,
      day: 'Jeudi',
      number_hours: '08:00',
      start_time_work: '08:00',
      end_time_work: '17:00',
      start_time_break: '17:00',
      is_checked: true
    },
    {
      id: 5,
      day: 'Vendredi',
      number_hours: '08:00',
      start_time_work: '08:00',
      end_time_work: '17:00',
      start_time_break: '17:00',
      is_checked: true
    },
    {
      id: 6,
      day: 'Samedi',
      number_hours: '00:00',
      start_time_work: '00:00',
      end_time_work: '17:00',

      start_time_break: '00:00'
    },
    {
      id: 7,
      day: 'Dimanche',
      number_hours: '00:00',
      start_time_work: '00:00',
      end_time_work: '17:00',
      start_time_break: '17:00'
    }
  ]

  const deleteMutation = useMutation(deleteTypeAbsence, {
    onSuccess: () => {
      queryClient.invalidateQueries('typeAbsence')
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

  // const onSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   setEditDialogOpen(false)
  //   e.preventDefault()
  // }

  const getDays = async () => {
    const { data } = await axios.get('http://127.0.0.1:8000/api/services/')

    setDays(data)
  }

  const { data } = useQuery('days', () => getDays())
  console.log(days)

  // const CreateMutation = useMutation(CreateService, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries('work-schedule')
  //   }
  // })

  const onSubmit = (data: any) => {
    const { start_time_work: time, end_time_work: time2, duration_time_break: time3, number_hours: time4 } = data
    console.log(data)
  }

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
              <Icon icon='mdi:calendar-clock' color='#915592' width='60' height='80' />
            </div>
            <CardHeader title='Horaires de travail' style={{ textAlign: 'center', marginTop: '-20px' }}></CardHeader>
            {
              <CardContent style={{ textAlign: 'center', marginTop: '-10px' }}>
                Créez, gérez et assignez des plannings à vos
                <br /> collaborateurs.
              </CardContent>
            }
            {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
            <form>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#fff' }}>
                <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                  {' '}
                  <Box m={3}>
                    <Typography sx={{ color: '#915592' }} variant='h6'>
                      Horaires de travail de mes utilisateurs
                    </Typography>
                  </Box>
                  {/* <TableContainer component={Paper}> */}
                  <Table sx={{ minWidth: 650 }} aria-label='simple table' style={{ textAlign: 'left' }}>
                    <TableHead>
                      <TableRow></TableRow>
                    </TableHead>
                    {
                      <TableBody>
                        {dayss.map((day, index) => (
                          <TableRow key={day.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex' }}>
                                <FormControlLabel
                                  label={day.day}
                                  control={
                                    <Checkbox
                                      name='color-secondary'
                                      sx={{ color: '#915592', fontSize: '60px', fontWeight: 500 }}
                                    />
                                  }
                                  onChange={() => {
                                    const newShowDatePicker = [...showDatePicker]
                                    newShowDatePicker[index] = !newShowDatePicker[index]
                                    setShowDatePicker(newShowDatePicker)
                                  }}
                                />
                              </Box>
                            </TableCell>

                            <TableCell>
                              {showDatePicker[index] && (
                                <Box sx={{ display: 'flex', alignItems: 'auto' }}>
                                  <Typography variant='h6' sx={{ pt: 3.5, width: '30px', alignItems: 'center' }}>
                                    de
                                  </Typography>
                                  <TextField type='Time' value={day.start_time_work}></TextField>
                                  {/* <TimeField
                                  label='Time'
                                  value={day.start_time_work}
                                  onChange={newDate => setTime1(newDate)}
                                  size='small'
                                  format='hh:mm'
                                  ampm={true}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position='end'>
                                        <AccessTimeIcon />
                                      </InputAdornment>
                                    )
                                  }}
                                  sx={{ mr: 2 }}
                                /> */}

                                  <Typography
                                    variant='h6'
                                    sx={{ ml: 4, mr: 4, pt: 3.5, width: '30px', alignItems: 'center' }}
                                  >
                                    à
                                  </Typography>
                                  <TextField type='Time' value='17:00'></TextField>
                                  {/* <TimeField
                                  label='Time'
                                  value={day.end_time_work}
                                  onChange={newDate => setTime2(newDate)}
                                  size='small'
                                  format='hh:mm '
                                  ampm={true}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position='end'>
                                        <AccessTimeIcon />
                                      </InputAdornment>
                                    )
                                  }}
                                  sx={{ mr: 2, alignItems: 'center' }}
                                /> */}
                                  <Typography variant='h6' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                    Durée de la pause déjeuner
                                  </Typography>
                                  <TextField type='Time' value='00:00'></TextField>
                                  {/* <TimeField
                                  label='Time'
                                  value={day.duration_time_break}
                                  onChange={newDate => setTime3(newDate)}
                                  size='small'
                                  format='hh:mm'
                                  ampm={true}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position='end'>
                                        <AccessTimeIcon />
                                      </InputAdornment>
                                    )
                                  }}
                                  sx={{ mr: 2, alignItems: 'center' }}
                                /> */}
                                  <Typography variant='h6' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                    Temps de travail:
                                  </Typography>
                                  <Typography
                                    variant='h6'
                                    sx={{
                                      fontWeight: 500,
                                      color: '#915592',
                                      mr: 4,
                                      ml: 1,
                                      pt: 3.5,
                                      alignItems: 'center'
                                    }}
                                  >
                                    {day.number_hours}
                                  </Typography>
                                  {/* <TimeField
                                  label='Time'
                                  value={day.number_hours}
                                  onChange={newDate => setTime4(newDate)}
                                  size='small'
                                  format='hh:mm'
                                  ampm={true}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position='end'>
                                        <AccessTimeIcon />
                                      </InputAdornment>
                                    )
                                  }}
                                  sx={{ mr: 2, alignItems: 'center' }}
                                /> */}
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    }
                  </Table>
                  {/* </TableContainer>{' '} */}
                  {/* <Box m={3}>
                    <Typography sx={{ color: '#915592' }} variant='h6'>
                      Pointage journalier
                    </Typography>
                  </Box> */}
                  <Box m={3}>
                    <Typography sx={{ color: '#915592' }} variant='h6'>
                      Spécificités horaires
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'auto' }}>
                      <Typography variant='h6' sx={{ pt: 3.5, mr: 3, alignItems: 'center' }}>
                        Retard pris en compte à partir de
                      </Typography>
                      <TextField type='Time' value='05:00'></TextField>
                      <Typography variant='h6' sx={{ pt: 3.5, ml: 4, alignItems: 'center' }}>
                        minute(s)
                      </Typography>
                    </Box>
                    {/* <FormControlLabel
                      label='test'
                      control={
                        <Checkbox name='color-secondary' sx={{ color: '#915592', fontSize: '60px', fontWeight: 500 }} />
                      }
                      onChange={() => {
                        const newShowDatePicker = [...showDatePicker]
                        // newShowDatePicker[index] = !newShowDatePicker[index]
                        setShowDatePicker(newShowDatePicker)
                      }}
                    /> */}
                    <Box sx={{ display: 'flex', alignItems: 'auto' }}>
                      <Typography variant='h6' sx={{ pt: 3.5, mr: 3, alignItems: 'center' }}>
                        Temps supplémentaire pris en compte à partir de
                      </Typography>
                      <TextField type='Time' value='05:00'></TextField>
                      <Typography variant='h6' sx={{ pt: 3.5, ml: 4, alignItems: 'center' }}>
                        minute(s)
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box m={3}>
                <Button size='medium' type='submit' variant='contained' sx={{ mr: 3 }}>
                  Create
                </Button>
              </Box>
            </form>
            {/* <DataGrid
              autoHeight
              rows={typeAbsence}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            /> */}
          </Card>
        </Grid>
      </Grid>
      <Dialog maxWidth='sm' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
        <DialogTitle sx={{ mx: 'auto', textAlign: 'center' }}>
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
            Modifier Type absence
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mx: 'auto' }}>
          <Box component='form' sx={{ mt: 8 }} onSubmit={onSubmit}>
            <FormGroup sx={{ mb: 2, alignItems: 'center', flexDirection: 'row', flexWrap: ['wrap', 'nowrap'] }}>
              <TextField
                fullWidth
                size='small'
                value={editValue}
                label='Nom de absence'
                sx={{ mr: [0, 4], mb: [3, 0] }}
                placeholder='Enter Nom Absence'
                onChange={e => setEditValue(e.target.value)}
              />
              <Box sx={{ mr: 3, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'success.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.625rem' />
                <Typography variant='caption'>Online</Typography>
              </Box>
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

export default TimeTable
