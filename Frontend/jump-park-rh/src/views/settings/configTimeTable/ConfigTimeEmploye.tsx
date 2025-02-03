// ** React Imports
import { Ref, useState, forwardRef, ReactElement, MouseEvent, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { Theme } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import ListItemText from '@mui/material/ListItemText'
import Autocomplete from '@mui/material/Autocomplete'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogContent from '@mui/material/DialogContent'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Table from '@mui/material/Table'
import { TableCell } from '@mui/material'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import CardHeader from '@mui/material/CardHeader'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import TableRow from '@mui/material/TableRow'
import { getTypeAbsence, deleteTypeAbsence } from 'src/store/settings/configAbsence'
import axios from 'axios'
import { useMutation, useQueryClient, useQuery } from 'react-query'
// ** Configs Imports
import themeConfig from 'src/configs/themeConfig'

// ** Hooks Imports
import { useSettings } from 'src/@core/hooks/useSettings'

interface DataType {
  name: string
  email: string
  value: string
  avatar: string
}

interface OptionsType {
  name: string
  avatar: string
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const data: DataType[] = [
  {
    avatar: '1.png',
    value: 'Can Edit',
    name: 'Lester Palmer',
    email: 'pe@vogeiz.net'
  },
  {
    avatar: '2.png',
    value: 'owner',
    name: 'Mittie Blair',
    email: 'peromak@zukedohik.gov'
  },
  {
    avatar: '3.png',
    value: 'Can Comment',
    name: 'Marvin Wheeler',
    email: 'rumet@jujpejah.net'
  },
  {
    avatar: '4.png',
    value: 'Can View',
    name: 'Nannie Ford',
    email: 'negza@nuv.io'
  },
  {
    avatar: '5.png',
    value: 'Can Edit',
    name: 'Julian Murphy',
    email: 'lunebame@umdomgu.net'
  },
  {
    avatar: '6.png',
    value: 'Can View',
    name: 'Sophie Gilbert',
    email: 'ha@sugit.gov'
  },
  {
    avatar: '7.png',
    value: 'Can Comment',
    name: 'Chris Watkins',
    email: 'zokap@mak.org'
  },
  {
    avatar: '8.png',
    value: 'Can Edit',
    name: 'Adelaide Nichols',
    email: 'ujinomu@jigo.com'
  }
]

const options: OptionsType[] = [
  {
    avatar: '1.png',
    name: 'Chandler Bing'
  },
  {
    avatar: '2.png',
    name: 'Rachel Green'
  },
  {
    avatar: '3.png',
    name: 'Joey Tribbiani'
  },
  {
    avatar: '4.png',
    name: 'Pheobe Buffay'
  },
  {
    avatar: '5.png',
    name: 'Ross Geller'
  },
  {
    avatar: '8.png',
    name: 'Monica Geller'
  }
]

const DialogShareProject = () => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Hooks
  const { settings } = useSettings()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  // ** Var
  const { direction } = settings

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
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

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <Icon icon='mdi:account-clock' fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          Plannig pour employé
        </Typography>
        {/* <Typography sx={{ mb: 3 }}>
          Elegant Share Project options modal popup example, easy to use in any page.
        </Typography> */}
        <Button variant='contained' onClick={() => setShow(true)}>
          Ajouter
        </Button>
      </CardContent>
      <Dialog
        fullWidth
        open={show}
        maxWidth='lg'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem', color: '#915592' }}>
              Horaires de travail de mes utilisateurs
            </Typography>
            {/* <Card> */}
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Icon icon='mdi:calendar-clock' color='#915592' width='60' height='80' />
              </div> */}

            {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
            <form>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#fff' }}>
                <CardContent sx={{ p: theme => `${theme.spacing(3.25, 8, 4.5)} !important` }}>
                  {' '}
                  {/* <Box m={3}>
                      <Typography sx={{ color: '#915592' }} variant='h6'>
                        Horaires de travail de mes utilisateurs
                      </Typography>
                    </Box> */}
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
                                  <Typography variant='body1' sx={{ pt: 4, mr: 3, alignItems: 'center' }}>
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
                                    variant='body1'
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
                                  <Typography variant='body1' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                    pause
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
                                  <Typography variant='body1' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                    Temps de travail:
                                  </Typography>
                                  <Typography
                                    variant='body1'
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
            {/* </Card> */}
            {/* <Typography variant='body2'>Share project with a team members</Typography> */}
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DialogShareProject
