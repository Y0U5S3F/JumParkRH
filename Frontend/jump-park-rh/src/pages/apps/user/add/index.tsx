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
import FormHelperText from '@mui/material/FormHelperText'

interface State {
  password: string
  password2: string
  showPassword: boolean
  showPassword2: boolean
}

interface UserData {
  email: string
  username: string
  company: string
  country: string
  phone: number
  first_name: string
  last_name: string
  password: string
  postal_code: string
  rib: string
  place_of_birth: string
  nationality: string
  cin: string
  address: string
  city: string
}
const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Date de naissance' autoComplete='off' />
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
  // company: yup.string().required(),
  // username: yup.string().required(),
  // country: yup.string().required(),
  // email: yup.string().email().required(),
  // phone: yup
  //   .number()
  //   .typeError('phone Number field is required')
  //   .min(10, obj => showErrors('phone Number', obj.value.length, obj.min))
  //   .required(),
  // first_name: yup
  //   .string()
  //   .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
  //   .required(),
  // last_name: yup
  //   .string()
  //   .min(3, obj => showErrors('last_name', obj.value.length, obj.min))
  //   .required()
})

const defaultValues = {
  email: '',
  company: '',
  country: '',
  postal_code: '',
  matricule: '',
  rib: '',
  place_of_birth: '',
  nationality: '',
  cin: '',
  address: '',
  city: '',
  username: '',
  last_name: '',
  first_name: '',
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
    // const {
    //   email,
    //   company,
    //   country,
    //   postal_code,
    //   rib,
    //   place_of_birth,
    //   nationality,
    //   cin,
    //   address,
    //   city,
    //   username,
    //   last_name,
    //   first_name,
    //   password,
    //   phone
    // } = data
    console.log('testtt---', data)
    addUserMutation.mutate({ data })
    // toggle()
    reset()
  }

  return (
    <DatePickerWrapper>
      <Card>
        <CardHeader title='Veuillez saisir les coordonnées de vos personnelles' />
        <Divider sx={{ m: '0 !important' }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Account Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='username'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Full Name'
                        onChange={onChange}
                        placeholder='John Doe'
                        error={Boolean(errors.username)}
                      />
                    )}
                  />
                  {errors.username && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                  )}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='email'
                    control={control}
                    // rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='email'
                        onChange={onChange}
                        placeholder='John@gmail.com'
                        error={Boolean(errors.email)}
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='form-layouts-separator-password'>Password</InputLabel>
                  <OutlinedInput
                    label='Password'
                    value={values.password}
                    id='form-layouts-separator-password'
                    onChange={handlePasswordChange('password')}
                    type={values.showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label='toggle password visibility'
                        >
                          <Icon icon={values.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='form-layouts-separator-password-2'>Confirm Password</InputLabel>
                  <OutlinedInput
                    value={values.password2}
                    label='Confirm Password'
                    id='form-layouts-separator-password-2'
                    onChange={handleConfirmChange('password2')}
                    type={values.showPassword2 ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          aria-label='toggle password visibility'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                        >
                          <Icon icon={values.showPassword2 ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ mb: '0 !important' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Personal Info
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='last_name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Prénom'
                        onChange={onChange}
                        placeholder='John Doe'
                        error={Boolean(errors.last_name)}
                      />
                    )}
                  />
                  {errors.last_name && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.last_name.message}</FormHelperText>
                  )}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='first_name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Nom'
                        onChange={onChange}
                        placeholder='John'
                        error={Boolean(errors.first_name)}
                      />
                    )}
                  />
                  {errors.first_name && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.first_name.message}</FormHelperText>
                  )}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='matricule'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Matricule'
                        onChange={onChange}
                        placeholder='0021'
                        error={Boolean(errors.matricule)}
                      />
                    )}
                  />
                  {errors.matricule && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.matricule.message}</FormHelperText>
                  )}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Role</InputLabel>
                  <Select
                    label='Country'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='UK'>Employee</MenuItem>
                    <MenuItem value='USA'>RH</MenuItem>
                    <MenuItem value='Australia'>Manager</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-multiple-select-label'>Département</InputLabel>
                  <Select
                    multiple
                    value={language}
                    onChange={handleSelectChange}
                    id='form-layouts-separator-multiple-select'
                    labelId='form-layouts-separator-multiple-select-label'
                    input={<OutlinedInput label='Language' id='select-multiple-language' />}
                  >
                    <MenuItem value='Caissier'>Acceuil et caisse</MenuItem>
                    <MenuItem value='Informatique'>Informatique</MenuItem>
                    <MenuItem value='Café'>Café</MenuItem>
                    <MenuItem value='Restaurant'>Restaurant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={date}
                  showYearDropdown
                  showMonthDropdown
                  placeholderText='MM-DD-YYYY'
                  customInput={<CustomInput />}
                  id='form-layouts-separator-date'
                  onChange={(date: Date) => setDate(date)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='place_of_birth'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Lieu de naissance'
                        onChange={onChange}
                        placeholder='John'
                        error={Boolean(errors.place_of_birth)}
                      />
                    )}
                  />
                  {errors.place_of_birth && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.place_of_birth.message}</FormHelperText>
                  )}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='nationality'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Nationalité'
                        onChange={onChange}
                        placeholder='Tunisie'
                        error={Boolean(errors.nationality)}
                      />
                    )}
                  />
                  {errors.nationality && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.nationality.message}</FormHelperText>
                  )}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Genre légal</InputLabel>
                  <Select
                    label='Country'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='UK'>Homme</MenuItem>
                    <MenuItem value='USA'>Femme</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Situation familiale</InputLabel>
                  <Select
                    label='Country'
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='UK'>Employee</MenuItem>
                    <MenuItem value='USA'>RH</MenuItem>
                    <MenuItem value='Australia'>Manager</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='cin'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='CIN'
                        onChange={onChange}
                        placeholder='098663333'
                        error={Boolean(errors.cin)}
                      />
                    )}
                  />
                  {errors.cin && <FormHelperText sx={{ color: 'error.main' }}>{errors.cin.message}</FormHelperText>}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='phone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Numéro de téléphone'
                        onChange={onChange}
                        placeholder='23654789'
                        error={Boolean(errors.phone)}
                      />
                    )}
                  />
                  {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='address'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Adresse'
                        onChange={onChange}
                        placeholder='tunis'
                        error={Boolean(errors.address)}
                      />
                    )}
                  />
                  {errors.address && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>
                  )}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='city'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Ville'
                        onChange={onChange}
                        placeholder='nabeul'
                        error={Boolean(errors.city)}
                      />
                    )}
                  />
                  {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='postal_code'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Code Postal'
                        onChange={onChange}
                        placeholder='8090'
                        error={Boolean(errors.postal_code)}
                      />
                    )}
                  />
                  {errors.postal_code && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.postal_code.message}</FormHelperText>
                  )}
                </FormControl>{' '}
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ mb: '0 !important' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  3. Personne à contacter en cas d’urgence
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Nom et prénom' placeholder='Leonard' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Numéro de téléphone' placeholder='25.369.877' />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ mb: '0 !important' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  4. Informations bancaires
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Compte bancaire' placeholder='M1236554885222' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='rib'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='RIB Bancaire'
                        onChange={onChange}
                        placeholder='8090'
                        error={Boolean(errors.rib)}
                      />
                    )}
                  />
                  {errors.rib && <FormHelperText sx={{ color: 'error.main' }}>{errors.rib.message}</FormHelperText>}
                </FormControl>{' '}
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              Save
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
