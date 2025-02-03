// ** React Imports
import { FormEvent, SetStateAction, ChangeEvent, useState } from 'react'
// import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import { CreateConge } from 'src/store/request/conges'
import { getTypeConges } from 'src/store/settings/configConge'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import { Autocomplete, FormControl, FormGroup, InputLabel, Radio, RadioGroup } from '@mui/material'
import { fetchUsers, CreateUser, getUsers, deleteUser, deletedUser } from 'src/store/user'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useForm, Controller } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  // const { control } = useForm()
  const {
    control,
    watch,
    formState: { errors }
  } = useForm()
  const { data: users, isLoading, error } = useQuery('users', getUsers)
  const { data: typeConge } = useQuery('typeConge', getTypeConges)

  const { value, handleFilter } = props
  const [name, setName] = useState('')
  const [color, setColor] = useState('#008000')
  const [checked, setChecked] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#008000') // State to store selected color
  const [statusValue, setStatusValue] = useState<string>('')
  const [selectValue, setSelectValue] = useState<string>('')
  // const [value, setValue] = useState<string>('')
  const [title, setTitle] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('')
  const [userID, setUserID] = useState<any>()
  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
  }

  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  // const [value, setValue] = useState<string>('controlled-checked')

  const handleChangeReason = (event: any) => {
    setReason(event.target.value)
  }

  const handleChangeStatus = (event: any) => {
    setStatus(event.target.value)
  }
  const handleUserIdChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    if (value) {
      setUserID(value)
    }
  }
  const handleDialogToggle = () => setOpen(!open)

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value)
    setErrorr('')
  }

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
    setErrorr('')
  }

  const addTypeCongeMutation = useMutation(CreateConge, {
    onSuccess: () => {
      queryClient.invalidateQueries('conges')
      toast.success('created successfully')
    }
  })
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errorr, setErrorr] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (endDate < startDate) {
      setErrorr('End date should be greater than or equal to start date.')
      return
    }
    const user = userID?.id
    const start_date = startDate
    const end_date = endDate
    addTypeCongeMutation.mutate({ user, reason, title, start_date, end_date, status })
    setOpen(false)
    setTitle('')
    setReason('')
    setStatus('')
    setUserID('')
    setStartDate('')
    setEndDate('')
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2.5 }}
          placeholder='Search type'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2.5 }} variant='contained' onClick={handleDialogToggle}>
          Ajouter Congé
        </Button>
      </Box>
      <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
        <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
            Ajouter un nouveau congé
          </Typography>

          {/* <Typography variant='body2'>Permissions you may use and assign to your users.</Typography> */}
        </DialogTitle>
        <DialogContent sx={{ pb: 12, mx: 'auto' }}>
          <Box
            component='form'
            onSubmit={onSubmit}
            sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <Autocomplete
                  sx={{ width: 250 }}
                  options={users}
                  id='autocomplete-filled'
                  getOptionLabel={(users: any) => users.full_name || ''}
                  onChange={handleUserIdChange}
                  renderInput={params => <TextField {...params} label='Choisir employee' variant='filled' required />}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='invoice-status-select'>Type Congé</InputLabel>

                  <Select
                    fullWidth
                    value={reason}
                    name='reason'
                    sx={{ mb: 2 }}
                    label='Type Congé'
                    labelId='invoice-status-select'
                    onChange={handleChangeReason}
                  >
                    {typeConge?.map((type: any) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    type='date'
                    value={startDate}
                    onChange={handleStartDateChange}
                    sx={{ mb: 2 }}
                    // label='Start Date'
                    error={!!errorr}
                    helperText={errorr}
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    type='date'
                    value={endDate}
                    onChange={handleEndDateChange}
                    sx={{ mb: 2 }}
                    // label='End Date'
                    error={!!errorr}
                    helperText={errorr}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='invoice-status-select'>Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    name='status'
                    sx={{ mb: 2 }}
                    label='Status'
                    labelId='invoice-status-select'
                    onChange={handleChangeStatus}
                  >
                    <MenuItem value='En_cours'>En cours</MenuItem>
                    <MenuItem value='Refuser'>Refuser</MenuItem>
                    <MenuItem value='Valider'>Accepter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  multiline
                  name='title'
                  maxRows={4}
                  value={title}
                  label='Notes'
                  onChange={handleChange}
                  id='textarea-outlined-controlled'
                />
              </Grid>
              {/* <FormControlLabel control={<Checkbox />} label='Set as core permission' /> */}
            </Grid>
            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
                Create Conge
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

export default TableHeader
