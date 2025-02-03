// ** React Imports
import { Ref, useState, forwardRef, ReactElement, MouseEvent, Fragment, useEffect } from 'react'

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
import { getWeekday, UpdateMultipleDays, CreateService } from 'src/store/settings/configTime'
import axios from 'axios'
import { useMutation, useQueryClient, useQuery } from 'react-query'
// ** Configs Imports
import themeConfig from 'src/configs/themeConfig'
import { BeatLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Hooks Imports
import { useSettings } from 'src/@core/hooks/useSettings'
import toggleButton from 'src/@core/theme/overrides/toggleButton'
import moment from 'moment'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const ConfigTimeFixe = (props: any) => {
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
  const [duration, setDuration] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(days.map(() => false))

  const { weekday } = props
  const queryClient = useQueryClient()

  const defaultValues = {
    time: '',
    time2: '',
    time3: '',
    time4: ''
  }

  const [arrayOfWeek, setArrayOfWeek] = useState<any>(weekday && weekday)
  const UpdateMultipleMutation = useMutation(UpdateMultipleDays, {
    onSuccess: () => {
      queryClient.invalidateQueries('weekday')
      toast.success('updated successfully')
      setShow(false)
    }
  })
  const handleChange = (id: any, property: any, value: any) => {
    const updatedSchedule = arrayOfWeek.map((scheduleItem: any) => {
      if (scheduleItem.id === id) {
        const updatedScheduleItem = { ...scheduleItem, [property]: value }

        // Calculate duration
        const startAt = moment(updatedScheduleItem.start_at, 'HH:mm:ss')
        const endAt = moment(updatedScheduleItem.end_at, 'HH:mm:ss')
        const durations = moment.duration(endAt.diff(startAt)).asHours()
        const durationHours = moment.utc(durations * 60 * 60 * 1000).format('HH:mm:ss')
        console.log('duration final---', durations)
        console.log('durationHours---', durationHours)
        const breakDuration = moment.duration(updatedScheduleItem.break_duration).asHours()
        const duration = durations - breakDuration
        const durationFinal = moment.utc(duration * 60 * 60 * 1000).format('HH:mm:ss')
        console.log('updatedDuration---', duration)
        console.log('durationFinal---', durationFinal)
        return { ...updatedScheduleItem, duration: durationFinal }
      } else {
        return scheduleItem
      }
    })
    setArrayOfWeek(updatedSchedule)
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
  })

  const onSubmit = (data: any) => {
    UpdateMultipleMutation.mutate(arrayOfWeek)
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <Icon icon='mdi:alarm' fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          Horaire Fixed
        </Typography>
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
              Horaires de travail de mes utilisateurs fixed
            </Typography>
            <Typography variant='h6' sx={{ mb: 3, lineHeight: '2rem' }}>
              01/01/2023 - 31/12/2023
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: '#fff' }}>
                <CardContent sx={{ p: theme => `${theme.spacing(3.25, 8, 4.5)} !important` }}>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table' style={{ textAlign: 'left' }}>
                    <TableHead>
                      <TableRow></TableRow>
                    </TableHead>
                    {
                      <TableBody>
                        {arrayOfWeek?.map((day: any, index: any) => (
                          <TableRow key={day.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex' }}>
                                <FormControlLabel
                                  label={day.weekday}
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
                                  <TextField
                                    type='Time'
                                    value={day.start_at}
                                    onChange={event => handleChange(day.id, 'start_at', event.target.value)}
                                  ></TextField>
                                  <Typography
                                    variant='body1'
                                    sx={{ ml: 4, mr: 4, pt: 3.5, width: '30px', alignItems: 'center' }}
                                  >
                                    à
                                  </Typography>
                                  <TextField
                                    type='Time'
                                    value={day.end_at}
                                    onChange={event => handleChange(day.id, 'end_at', event.target.value)}
                                  ></TextField>

                                  <Typography variant='body1' sx={{ mr: 4, ml: 4, pt: 3.5, alignItems: 'center' }}>
                                    pause
                                  </Typography>

                                  <TextField
                                    type='Time'
                                    value={day.break_duration}
                                    onChange={event => handleChange(day.id, 'break_duration', event.target.value)}
                                  ></TextField>

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
                                    {day.duration}
                                  </Typography>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    }
                  </Table>

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
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ConfigTimeFixe
