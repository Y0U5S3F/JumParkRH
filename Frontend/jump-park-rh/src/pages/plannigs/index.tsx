import React, { useEffect, useState, forwardRef, useId, Fragment } from 'react'
import Box from '@mui/material/Box'
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  DialogActions,
  DialogContentText,
  Divider,
  FormControl,
  IconButton,
  // Icon,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Slide,
  TextField,
  Typography
} from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { Router, useRouter } from 'next/router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import DatePicker from 'react-datepicker'
import format from 'date-fns/format'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import AddCard from 'src/views/attendances/add/Add'
import {
  CreateAttendance,
  getAttendances,
  getEmployes,
  UpdateAttendance,
  getPointingDevice,
  deleteAttendance
} from 'src/store/attendances'
import { getdepartments } from 'src/store/departments'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Backdrop, CircularProgress } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { Grid } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import axios from 'axios'
import { CreateUser } from 'src/store/user'
import { red } from '@mui/material/colors'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

const CalenderAttendance = (props: any) => {
  const router = useRouter()
  // ** props
  const { rooms, reservations, maintenances, roomTypes, floors, roomStatus } = props
  const { data: employes, isLoading } = useQuery('employes', getEmployes)
  const { data: attendances, isLoading: isLoadingAttendance } = useQuery('attendances', getAttendances)
  const { data: departments, isLoading: isLoadingdepartment } = useQuery('department', getdepartments)
  const [checkin, setCheckin] = useState('')
  const [checkin_pause, setCheckinPause] = useState<string | null>(null)
  const [checkout_pause, setCheckoutPause] = useState<string | null>(null);
  const [checkout, setCheckout] = useState('')
  const [dateAttendance, setDateAttendance] = useState('')
  const [idEmployee, setIdEmployee] = useState('')
  // console.log('date attendance -------', dateAttendance)
  // const { data: attendances } = useQuery('attendances', () => getAttendances)
  const employess = [
    {
      id: 1,
      name: 'Aness'
    },
    {
      id: 2,
      name: 'Syrine'
    },
    {
      id: 3,
      name: 'Omar'
    }
  ]
  const Attendance = [
    {
      id: 1,
      date: '28/04/2023',
      duration: 2,
      checkin: '17:14:00',
      checkout: '19:14:02',
      user: 8,
      employee: 1,
      // duration: '02:00:00',
      status: 'Present'
    },
    {
      id: 2,
      date: '01/04/2023',
      duration: 2,
      checkin: '17:14:00',
      checkout: '19:14:02',
      user: 9,
      employee: 2,
      // duration: '02:00:00',
      status: 'Day off'
    }
  ]
  const queryClient = useQueryClient()

  const updateAttendanceMutation = useMutation(UpdateAttendance, {
    onSuccess: () => {
      queryClient.invalidateQueries('attendances')
      toast.success('updated successfully')
    }
  })
  const addAttendanceMutation = useMutation(CreateAttendance, {
    onSuccess: () => {
      queryClient.invalidateQueries('attendances')
      toast.success('created successfully')
    }
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const date = new Date(dateAttendance)

    const [day, month, year] = dateAttendance.split('/')
    const formattedDate = [year, month, day].join('-')

    const data = { date: formattedDate, user: idEmployee, checkin: checkin, checkout: checkout }
    event.preventDefault()
    addAttendanceMutation.mutate({ data })
    setOpen(false)
    setCheckin('')
    setCheckout('')
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const date = new Date(dateAttendance)

    const [day, month, year] = dateAttendance.split('/')
    const formattedDate = [year, month, day].join('-')

    const data = {
      date: formattedDate,
      checkin: checkin,
      checkout: checkout,
      checkout_pause: checkout_pause,
      checkin_pause: checkin_pause
    }
    event.preventDefault()
    updateAttendanceMutation.mutate({ data, Id })
    setOpenUpdate(false)
    setCheckin('')
    setCheckout('')
    setCheckoutPause('')
    setCheckinPause('')
  }
  // ** state

  const [Id, setId] = useState('')
  const [startDate, setStartDate] = useState<any>(new Date()) // Start date of current week
  const [dates, setDates] = useState<any>([]) // Start date of current week

  //** for filtrage */
  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`
    props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
    const updatedProps = { ...props }
    delete updatedProps.setDates

    return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
  })
  const [filteredEmploye, setFilteredEmploye] = useState([])
  const [dateFilter, setDateFilter] = useState('')
  const [FullNameFilter, setFullNameFilter] = useState('')
  const [departmentFilter, setdepartmentFilter] = useState('')
  const [StatusFilter, setStatusFilter] = useState('')
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [openDrawer, setOpenDrawer] = useState(false)

  useEffect(() => {
    setFilteredEmploye(employes)
  }, [employes])

  // console.log('filteredRoomss', filteredRoomss, parseInt(roomType), roomType, floorFilter)

  // console.log('startDate', startDate, 'dateFilter', new Date(new Date(dateFilter).getTime() - 7 * 24 * 60 * 60 * 1000))
  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }
  const handleResetTime = () => {
    setCheckoutPause(null)
    setCheckinPause(null)
  }
  const handleDateFilterChange = (event: any) => {
    setDateFilter(event.target.value)
  }
  const handleEmployeFilterChange = (event: any) => {
    setFullNameFilter(event.target.value)
  }

  const handledepartmentFilterChange = (event: any) => {
    setdepartmentFilter(event.target.value)
  }

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value)
  }
  useEffect(() => {
    const filtered = employes?.filter((employe: any) => {
      let passesFilters = true
      if (FullNameFilter) {
        passesFilters = passesFilters && employe.full_name.toLowerCase().includes(FullNameFilter)
      }
      if (departmentFilter !== '') {
        passesFilters = passesFilters && employe?.department == departmentFilter
      }
      return passesFilters
    })

    setFilteredEmploye(filtered)
  }, [FullNameFilter, departmentFilter])
  const [currentMonth, setCurrentMonth] = useState<any>(new Date())

  const [open, setOpen] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const handleDialogToggle = (id: any, date: any) => {
    console.log('date time--', date)
    console.log('date id--', id)
    setDateAttendance(date)
    setIdEmployee(id)
    setOpen(!open)
  }
  const handleDialogToggleUpdate = (
    id: any,
    date: any,
    checkin: any,
    checkout: any,
    checkout_pause: any,
    checkin_pause: any
  ) => {
    console.log('date time--', date)
    console.log('date id--', id)
    setDateAttendance(date)
    setId(id)
    setCheckin(checkin)
    setCheckout(checkout)
    setCheckoutPause(checkout_pause)
    setCheckinPause(checkin_pause)
    setOpenUpdate(!openUpdate)
  }
  const dialogClose = () => {
    setOpenUpdate(!openUpdate)
  }

  // ** toggle drawers
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer)
  }

  const getWeekdayName = (date: any) => {
    const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    return weekdays[date.getDay()]
  }

  const handlePreviousMonth = () => {
    const prevMonthStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1)
    console.log('previous--', prevMonthStartDate)
    setStartDate(prevMonthStartDate)
  }

  const handleNextMonth = () => {
    const nextMonthStartDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)
    console.log('next--', nextMonthStartDate)
    setStartDate(nextMonthStartDate)
  }

  const getDateRange = (start: Date) => {
    // Get an array of objects with date and weekday name for the current week
    const dates = []
    const today = new Date(start) // Get today's date
    const year = today.getFullYear() // Get current year
    const month = today.getMonth() // Get current month (0-indexed)
    const numDays = new Date(year, month + 1, 0).getDate() // Get number of days in current month
    const currDate = new Date(startDate)
    const firstDay = new Date(year, month, 1) // Get first day of the month
    for (let i = 0; i < numDays; i++) {
      const date = new Date(year, month, i + 1)
      const weekday = getWeekdayName(date)
      dates.push({ date, weekday })
    }
    return dates
  }
  const rangDates = getDateRange(startDate)

  const currentDate = new Date()
  const [openDialogError, setOpenDialogError] = useState<boolean>(false)

  const handleClickOpen = () => setOpenDialogError(true)

  const handleClose = () => setOpenDialogError(false)
  const [user_id, setUserId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const getCurrentMonthName = () => {
    const monthNames = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ]
    const monthIndex = startDate.getMonth()
    return monthNames[monthIndex]
  }
  console.log('current MOnth---', getCurrentMonthName())
  // const { data: pointing, isLoading: isLoadingPointing } = useQuery('pointing', getPointingDevice)
  // const {
  //   data: pointing,
  //   isLoading: isLoadingPointing,
  //   isError
  // } = useQuery('pointing', getPointingDevice, {
  //   onSuccess: (data: any) => {
  //     // handle success here
  //     console.log('pointing---successfully----')
  //     toast.success('successfully import Attendances from device')
  //   },
  //   onError: (error: any) => {
  //     // handle error here
  //     console.log('pointing---error-----', error.response.data[0].user)
  //     setName(error.response.data[0].user)
  //     setIdUid(error.response.data[0].uid)
  //     setEmail(error.response.data[0].email)
  //     if (error.response.status === 400) {
  //       setOpenDialogError(true)
  //     } else {
  //       toast.error(`${error.response.data} `)
  //     }
  //   }
  // })

  // console.log('pointing---', pointing)
  const [isLoadingPointing, setIsLoadingPointing] = useState(false)
  const [pointingData, setPointingData] = useState(null)
  const [isError, setIsError] = useState(false)
  const [open4, setOpen4] = useState<boolean>(true)

  const handleClickImportData = async () => {
    setIsLoadingPointing(true)
    setIsError(false)
    try {
      const response = await getPointingDevice()
      console.log('pointing---successfully----')
      toast.success('successfully import Attendances from device')
      setPointingData(response.data)
    } catch (error: any) {
      console.log('pointing---error-----', error.response.data[0].user)
      setName(error.response.data[0].user)
      setUserId(error.response.data[0].user_id)
      setEmail(error.response.data[0].email)
      if (error.response.status === 400) {
        setOpenDialogError(true)
      } else {
        // toast.error(`device disabled`)
        setOpen4(true)
      }
      setIsError(true)
    }
    setIsLoadingPointing(false)
  }

  const addUserMutation = useMutation(CreateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('employes')
      queryClient.invalidateQueries('attendances')
      toast.success('created successfully')
    }
  })
  const handleAddUser = async () => {
    const data = {
      matricule: user_id,
      full_name: name,
      password: 'aftercode',
      last_name: name,
      first_name: name,
      phone: '24569870',
      email: email
    }
    addUserMutation.mutate({ data })
    setOpenDialogError(false)
  }

  const [progress, setProgress] = useState<number>(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 100 ? 10 : prevProgress + 10))
    }, 800)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // {
  //   isLoadingPointing && <LinearProgress variant='determinate' value={progress} sx={{ color: 'green' }} />
  // }

  // const deleteMutation = useMutation(deleteAttendance, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries('attendances')
  //     toast.success('deleted successfully')
  //   }
  // })
  // const handleDelete = (id: any) => {
  //   deleteMutation.mutate(id)
  // }
  const [idAttendance, setIdAttendance] = useState<number>(0)
  const [deleteDialogOpen, setdeleteDialogOpen] = useState<boolean>(false)

  const deleteMutation = useMutation(deleteAttendance, {
    onSuccess: () => {
      queryClient.invalidateQueries('attendances')
      toast.success('deleted successfully')
    },
    onError: error => {
      // Handle the error and show an error message to the user
      toast.error('Error deleting attendance: ')
    }
  })
  const handleDelete = (id: any) => {
    setIdAttendance(id)
    setdeleteDialogOpen(true)
    // handleRowOptionsClose()
  }
  const handleDialogDeleteToggle = () => setdeleteDialogOpen(!deleteDialogOpen)

  return (
    <>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id='invoice-status-select'>department</InputLabel>

              <Select
                fullWidth
                value={departmentFilter}
                sx={{ mr: 4, mb: 2 }}
                label='Invoice Status'
                onChange={handledepartmentFilterChange}
                labelId='invoice-status-select'
              >
                {departments?.map((department: any) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='FullName'
              variant='outlined'
              // inputProps={inputProps}
              // sx={inputStyle}
              value={FullNameFilter}
              onChange={handleEmployeFilterChange}
              style={{ marginRight: 16 }}
            />
          </Grid>
          {/*
          <Grid item xs={12} sm={2}>
            {' '}
            <Button
              size='large'
              type='submit'
              sx={{ mr: 2, height: '55px' }}
              variant='contained'
              onClick={handleButtonClick}
              // disabled={isLoading}
            >
              get data
            </Button>
          </Grid> */}
          {/* <Grid item xs={12} sm={6}>
            <DatePicker
              isClearable
              selectsRange
              monthsShown={2}
              endDate={endDateRange}
              selected={startDateRange}
              startDate={startDateRange}
              shouldCloseOnSelect={false}
              id='date-range-picker-months'
              onChange={handleOnChangeRange}
              customInput={
                <CustomInput
                  dates={dates}
                  setDates={setDates}
                  label='Date'
                  end={endDateRange as number | Date}
                  start={startDateRange as number | Date}
                />
              }
            />
          </Grid> */}
        </Grid>
        <Divider sx={{ py: 3 }} />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size='large'
            type='submit'
            variant='contained'
            onClick={handleClickImportData}
            disabled={isLoadingPointing}
            endIcon={<Icon icon='mdi:progress-download' />}
          >
            {isLoadingPointing ? 'Loading...' : 'Import Attendance from Device'}
          </Button>
          {isError && (
            <div>
              {' '}
              {/* <Alert severity='error'>
                <AlertTitle>Error</AlertTitle>
                Error retrieving Attendance data — <strong>check your device!</strong>
              </Alert> */}
              <Slide in={open4} direction='left' {...(open4 ? { timeout: 500 } : {})}>
                <Alert
                  severity='error'
                  action={
                    <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpen4(false)}>
                      <Icon icon='mdi:close' fontSize='inherit' />
                    </IconButton>
                  }
                >
                  <AlertTitle>Error</AlertTitle>
                  Error retrieving Attendance data — <strong>check your device!</strong>
                </Alert>
              </Slide>
              {/* <Button disabled={open4} variant='outlined' sx={{ mt: 2 }} onClick={() => setOpen4(true)}>
                Open Slide
              </Button> */}
            </div>
          )}
        </div>

        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant='determinate' sx={{ color: 'green' }} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant='body2' color='green'>
              100%
            </Typography>
          </Box>
        </Box> */}
        <Divider sx={{ py: 3 }} />
        <Box
          // sx={{ display: 'flex', alignItems: 'center', my: 4, width: '8%' }}
          sx={{
            display: 'flex',
            gap: '20px',
            p: 3,
            justifyContent: 'space-between'
            // alignItems: 'center'
          }}
        >
          <Button
            variant='contained'
            color='primary'
            startIcon={<ArrowBackIosIcon />}
            onClick={handlePreviousMonth}
          ></Button>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant='h5' color='primary'>
              {' '}
              {getCurrentMonthName()}
            </Typography>
          </Box>
          <Button
            variant='contained'
            color='primary'
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleNextMonth}
            style={{ marginLeft: 'auto' }}
          ></Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {' '}
                  <Typography
                    noWrap
                    variant='body2'
                    sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
                  >
                    Employee
                  </Typography>
                </TableCell>
                {rangDates.map((date: any) => (
                  <TableCell
                    key={date.date.toLocaleDateString()}
                    sx={{
                      borderRight: '1px black solid',
                      bgcolor: currentDate.toLocaleDateString() == date.date.toLocaleDateString() ? '#915592' : '#0000',
                      p: 0,
                      m: 0
                    }}
                  >
                    <Box
                      sx={{
                        height: '30px',
                        width: '100px',
                        // mx: 'auto',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color:
                            currentDate.toLocaleDateString() === date.date.toLocaleDateString() ? '#fff' : '#717579',
                          fontFamily: 'flama light'
                        }}
                      >
                        {date.weekday}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: 500,
                          color: currentDate.toLocaleDateString() == date.date.toLocaleDateString() ? '#fff' : '#717579'
                        }}
                      >
                        {date.date.toLocaleDateString('en-US', {
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredEmploye?.map((item: any) => {
                // const dateRange = getDateRange().map(date => date.date)
                // console.log('testtdateRange', dateRange)
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.full_name}</TableCell>
                    {rangDates.map((date: any, index: number) => {
                      const currentDateISO = date.date.toLocaleDateString()
                      const matchingattendance = attendances?.find(
                        (r: any) => r.user === item.id && currentDateISO === r.date
                      )
                      // Use the stored dateRange variable
                      // console.log('map2', index + 1)
                      // console.log('date', date)
                      if (matchingattendance) {
                        const {
                          id,
                          date,
                          duration,
                          checkin,
                          checkout_pause,
                          checkin_pause,
                          checkout,
                          get_status,
                          type_absence
                        } = matchingattendance
                        return (
                          // Return the result of the map() function
                          <TableCell key={index}>
                            <Button
                              // onClick={() => ViewRoomDetailsReservation(room.id, matchingReservation.id)}
                              color='primary'
                              style={{
                                position: 'relative',
                                // flexDirection: 'column',
                                // alignItems: 'flex-start',
                                // justifyContent: 'flex-start',
                                width: '100%',
                                textTransform: 'none',
                                height: '150px',
                                backgroundColor: get_status === 'Anomalie' ? '#ffcb7d' : 'rgba(0, 108, 129, 0.09)',
                                borderRadius: '12px'
                              }}
                              onClick={() =>
                                handleDialogToggleUpdate(
                                  id,
                                  currentDateISO,
                                  checkin,
                                  checkout,
                                  checkout_pause,
                                  checkin_pause
                                )
                              }
                            >
                              {get_status === 'Anomalie' && (
                                <Icon
                                  icon='mdi:bell-alert'
                                  fontSize={20}
                                  style={{
                                    // paddingBottom: '10',
                                    color: '#fa4d32',
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px'
                                  }}
                                />
                              )}
                              {get_status === 'Conge' && (
                                <Icon
                                  icon='mdi:beach'
                                  fontSize={20}
                                  style={{
                                    // paddingBottom: '10',
                                    color: '#ff9f3e',
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px'
                                  }}
                                />
                              )}
                              {get_status === 'Absent' && (
                                <Icon
                                  icon='mdi:emoticon-sick-outline'
                                  fontSize={20}
                                  style={{
                                    // paddingBottom: '10',
                                    color: '#ff9f3e',
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px'
                                  }}
                                />
                              )}
                              <Box style={{ textAlign: 'center', paddingTop: '20px' }}>
                                <span>{get_status}</span>
                                <br />
                                <span>
                                  {checkin} {checkout_pause}
                                </span>
                                <br />
                                <span>
                                  {checkin_pause} {checkout}
                                </span>
                              </Box>
                              <br />
                              {/* <Box style={{ textAlign: 'center' }}>
                                <span>{checkin}</span>
                                <span>{checkout}</span>
                              </Box> */}
                            </Button>
                          </TableCell>
                        )
                      } else {
                        return (
                          <TableCell key={index}>
                            <Button
                              style={{
                                width: '100%',
                                height: '50px',
                                backgroundColor: 'white',
                                color: '#212B36'
                              }}
                              onClick={() => handleDialogToggle(item.id, currentDateISO)}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  p: 0,
                                  m: 0
                                }}
                              >
                                <svg
                                  width='17'
                                  height='18'
                                  viewBox='0 0 17 18'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path
                                    d='M8.5 1.70898V16.2923'
                                    stroke='#717579'
                                    stroke-width='2'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                  <path
                                    d='M1.2085 9H15.7918'
                                    stroke='#717579'
                                    stroke-width='2'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                  />
                                </svg>

                                <Typography
                                  sx={{
                                    color: 'Black',
                                    ml: 1,
                                    textTransform: 'none !important'
                                  }}
                                ></Typography>
                              </Box>
                            </Button>
                          </TableCell>
                        )
                      }
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DatePickerWrapper>
      {open ? (
        <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
          <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
            <Typography variant='h5' component='span' sx={{ mb: 2 }}>
              Ajouter Horaire
            </Typography>
            {/* <Typography variant='body2'>Permissions you may use and assign to your users.</Typography> */}
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
              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' component='span' sx={{ mb: 2 }}>
                    Arriver
                  </Typography>
                  <TextField
                    fullWidth
                    type='time'
                    name='checkin'
                    value={checkin}
                    onChange={e => setCheckin(e.target.value)}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' component='span' sx={{ mb: 2 }}>
                    Depart
                  </Typography>
                  <TextField
                    fullWidth
                    type='time'
                    name='checkout'
                    value={checkout}
                    onChange={e => setCheckout(e.target.value)}
                  />
                </Grid>{' '}
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' component='span' sx={{ mb: 2 }}>
                    Sortie pause
                  </Typography>
                  <TextField fullWidth type='time' name='phone' value='12:00' />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' component='span' sx={{ mb: 2 }}>
                    Entrer pause
                  </Typography>
                  <TextField fullWidth type='time' name='phone' value='13:00' />
                </Grid>
              </Grid>
              {/* <FormControlLabel control={<Checkbox />} label='Set as core permission' /> */}
              <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
                <Button size='large' type='submit' variant='contained'>
                  Create time
                </Button>
                {/* <Button type='reset' size='large' variant='outlined' color='secondary' onClick={handleDialogToggle}>
                Discard
              </Button> */}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      ) : (
        ''
      )}

      {openUpdate ? (
        <Dialog fullWidth maxWidth='sm' onClose={dialogClose} open={openUpdate}>
          <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
            <Typography variant='h5' component='span' sx={{ mb: 2 }}>
              Update Horaire
            </Typography>
            {/* <Typography variant='body2'>Permissions you may use and assign to your users.</Typography> */}
          </DialogTitle>
          <DialogContent sx={{ pb: 12, mx: 'auto' }}>
            <Box
              component='form'
              onSubmit={handleSubmit}
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

              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' component='span' sx={{ mb: 2 }}>
                    Arriver test {Id}
                  </Typography>
                  <TextField
                    fullWidth
                    type='time'
                    name='checkin'
                    value={checkin}
                    onChange={e => setCheckin(e.target.value)}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' component='span' sx={{ mb: 2 }}>
                    Depart
                  </Typography>
                  <TextField
                    fullWidth
                    type='time'
                    name='checkout'
                    value={checkout}
                    onChange={e => setCheckout(e.target.value)}
                  />
                </Grid>{' '}
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' component='span' sx={{ mb: 2 }}>
                    Sortie pause
                  </Typography>
                  <TextField
                    fullWidth
                    type='time'
                    name='checkout_pause'
                    // value={checkout_pause}
                    value={checkout_pause || ''}
                    onChange={e => setCheckoutPause(e.target.value)}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body1' component='span' sx={{ mb: 2 }}>
                    Entrer pause
                  </Typography>
                  <TextField
                    fullWidth
                    type='time'
                    name='checkin_pause'
                    value={checkin_pause || ''}
                    onChange={e => setCheckinPause(e.target.value)}
                  />
                </Grid>
                {/* <button onClick={handleResetTime}>Réinitialiser</button> */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size='small' variant='contained' onClick={handleResetTime}>
                    Réinitialiser l'heure
                  </Button>
                </Grid>
              </Grid>
              {/* <FormControlLabel control={<Checkbox />} label='Set as core permission' /> */}
              <Box
                className='demo-space-x'
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  '& > :last-child': { ml: 'auto' }
                }}
              >
                <Button size='large' type='submit' variant='contained'>
                  Update time
                </Button>
                <Button
                  type='button'
                  size='large'
                  variant='outlined'
                  color='secondary'
                  onClick={() => handleDelete(Id)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      ) : (
        ''
      )}
      <Backdrop open={isLoading} style={{ zIndex: 999, color: '#fff' }}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Dialog
        open={openDialogError}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>
          {' '}
          <Alert severity='warning'>
            <AlertTitle>Alert</AlertTitle>
            Un Nouvel employe a été ajouter dans la pointeuse. —{' '}
            <strong>
              Name: {name} <br />
              ID: {user_id}
            </strong>
          </Alert>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Typography variant='body1' component='span' sx={{ mb: 2 }}></Typography>
            {/* <Divider sx={{ py: 3 }} /> */}
            <Typography variant='body1' component='span' sx={{ mb: 2 }}>
              Si Vous voulez l'ajouter cliquer sur <strong color='success'> Ajouter employer</strong>{' '}
              {/* <Chip label='Ajouter employer' color='success' /> */}
            </Typography>
            <br />
            <Typography variant='body1' component='span' sx={{ mb: 2 }}>
              Sinon vous cliquez sur <strong color='error'>Delete employe dans la pointeuse!</strong>{' '}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='success' onClick={handleAddUser}>
            Ajouter employer
          </Button>
          <Button color='error' onClick={handleClose}>
            Delete employe dans la pointeuse
          </Button>
        </DialogActions>
      </Dialog>
      <Fragment>
        {/* <Button variant='outlined' onClick={handleClickOpen}>
          Open dialog
        </Button> */}
        <Dialog
          onClose={handleDialogDeleteToggle}
          open={deleteDialogOpen}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Supprimer Attendance </DialogTitle>
          <Alert
            severity='warning'
            action={
              <IconButton size='small' color='inherit' aria-label='close'>
                <Icon icon='mdi:close' fontSize='inherit' />
              </IconButton>
            }
          >
            {/* <AlertTitle>Attention</AlertTitle> */}
            Etes-vous sûr de vouloir supprimer cette Attendance ?
          </Alert>
          {/* <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              êtes-vous sûr de vouloir supprimer cet employee ?
            </DialogContentText>
          </DialogContent> */}
          <DialogActions className='dialog-actions-dense'>
            <Button
              onClick={() => {
                deleteMutation.mutate(idAttendance), setdeleteDialogOpen(false), setOpenUpdate(false)
              }}
            >
              Supprimer
            </Button>
            <Button onClick={handleDialogDeleteToggle}>Retour</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </>
  )
}

export default CalenderAttendance
