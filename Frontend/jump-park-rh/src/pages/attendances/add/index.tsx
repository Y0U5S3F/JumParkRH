// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { CreateUser } from 'src/store/user'

interface State {
  password: string
  password2: string
  showPassword: boolean
  showPassword2: boolean
}

interface UserData {
  email: string
  company: string
  country: string
  phone: number
  first_name: string
  last_name: string
  password: string
}
const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Date' autoComplete='off' />
})

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  company: yup.string().required(),
  country: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup
    .number()
    .typeError('phone Number field is required')
    .min(10, obj => showErrors('phone Number', obj.value.length, obj.min))
    .required(),
  first_name: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  last_name: yup
    .string()
    .min(3, obj => showErrors('last_name', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  email: '',
  company: '',
  country: '',
  first_name: '',
  last_name: '',
  password: 'aftercode',
  phone: Number('')
}

const FormLayoutsSeparator = () => {
  // ** States
  const [date, setDate] = useState<DateType>(null)
  const [language, setLanguage] = useState<string[]>([])
  const [values, setValues] = useState<State>({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  // Handle Password
  const handlePasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm Password
  const handleConfirmChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 })
  }
  const handleMouseDownConfirmPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const queryClient = useQueryClient()
  // Handle Select
  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    setLanguage(event.target.value as string[])
  }
  const addUserMutation = useMutation(CreateUser, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries('users')
      toast.success('user created successfully')
    }
  })
  const onSubmit = (data: UserData) => {
    console.log(data)
    addUserMutation.mutate({ ...data })
    // toggle()
    // reset()
  }

  return (
    <DatePickerWrapper>
      <Card>
        <CardHeader title='Remplissez vos feuilles de temps' />
        <Divider sx={{ m: '0 !important' }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Date du travail
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={date}
                  showYearDropdown
                  showMonthDropdown
                  placeholderText='DD-MM-YYYY'
                  customInput={<CustomInput />}
                  id='form-layouts-separator-date'
                  onChange={(date: Date) => setDate(date)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Employee</InputLabel>
                  <Select
                    label='Employee'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='UK'>Aness</MenuItem>
                    <MenuItem value='USA'>Amine</MenuItem>
                    <MenuItem value='Australia'>Wael</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Horaire du tavail
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body1' sx={{ pt: 4, mr: 3, alignItems: 'center' }}>
                  Start at
                </Typography>
                <TextField fullWidth type='Time'></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body1' sx={{ pt: 4, mr: 3, alignItems: 'center' }}>
                  End at
                </Typography>
                <TextField fullWidth type='Time'></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body1' sx={{ pt: 4, mr: 3, alignItems: 'center' }}>
                  Start break
                </Typography>
                <TextField fullWidth type='Time'></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body1' sx={{ pt: 4, mr: 3, alignItems: 'center' }}>
                  End break
                </Typography>
                <TextField fullWidth type='Time'></TextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              Submit
            </Button>
            <Button type='reset' size='large' color='secondary' variant='outlined'>
              Reset
            </Button>
          </CardActions>
        </form>
      </Card>
    </DatePickerWrapper>
  )
}

export default FormLayoutsSeparator
