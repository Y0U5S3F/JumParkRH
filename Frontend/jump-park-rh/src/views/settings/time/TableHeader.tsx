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
import { CreateService } from 'src/store/services'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import { FormGroup, Radio, RadioGroup } from '@mui/material'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props
  const [name, setName] = useState('')
  const [checked, setChecked] = useState(false)
  const [selectedColor, setSelectedColor] = useState('green') // State to store selected color
  const [statusValue, setStatusValue] = useState<string>('')
  const [selectValue, setSelectValue] = useState<string>('')

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value)
  }

  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  // const [value, setValue] = useState<string>('controlled-checked')

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setValue((event.target as HTMLInputElement).value)
  // }
  const handleDialogToggle = () => setOpen(!open)

  // const handleStatusValue = (e: SelectChangeEvent) => {
  //   setStatusValue(e.target.value)
  // }
  // const handleSelectValue = (ev: SelectChangeEvent) => {
  //   setSelectValue(ev.target.value)
  // }

  const addServiceMutation = useMutation(CreateService, {
    onSuccess: () => {
      queryClient.invalidateQueries('services')
      toast.success('created successfully')
    }
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addServiceMutation.mutate({ name })
    setOpen(false)
    setName('')
  }
  // }

  // const handleColorChangeE = (event: { target: { value: SetStateAction<string> } }) => {
  //   setColor(event.target.value)
  // }
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
          Add Type Absence
        </Button>
      </Box>
      <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
        <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
            Ajouter un nouveau type d'absence
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
            <TextField
              fullWidth
              label='Nom Absence'
              sx={{ mb: 1, maxWidth: 360 }}
              placeholder='Enter Name'
              name='name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            {/* <FormControlLabel control={<Checkbox />} label='Set as core permission' /> */}
            <RadioGroup row aria-label='colored' name='colored' defaultValue='primary' sx={{ mb: 1, maxWidth: 360 }}>
              <Radio
                color='default'
                checked={selectedColor === 'red'}
                onChange={handleColorChange}
                value='red'
                style={{
                  color: 'red',
                  borderRadius: selectedColor === 'red' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={selectedColor === 'green'}
                onChange={handleColorChange}
                value='green'
                style={{
                  color: 'green', // Set custom color for the radio button
                  borderRadius: selectedColor === 'green' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={selectedColor === 'blue'}
                onChange={handleColorChange}
                value='blue'
                style={{
                  color: 'blue',
                  borderRadius: selectedColor === 'blue' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={selectedColor === '#FF869E'}
                onChange={handleColorChange}
                value='#FF869E'
                style={{
                  color: '#FF869E',
                  borderRadius: selectedColor === '#FF869E' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={selectedColor === '#6AC7CE'}
                onChange={handleColorChange}
                value='#6AC7CE'
                style={{
                  color: '#6AC7CE',
                  borderRadius: selectedColor === '#6AC7CE' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={selectedColor === '#68CC45'}
                onChange={handleColorChange}
                value='#68CC45'
                style={{
                  color: '#68CC45',
                  borderRadius: selectedColor === '#68CC45' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={selectedColor === '#AEAEB8'}
                onChange={handleColorChange}
                value='#AEAEB8'
                style={{
                  color: '#AEAEB8',
                  borderRadius: selectedColor === '#AEAEB8' ? '50%' : '0'
                }}
              />
              <Radio
                color='default'
                checked={selectedColor === '#877FED'}
                onChange={handleColorChange}
                value='#877FED'
                style={{
                  color: '#877FED',
                  borderRadius: selectedColor === '#877FED' ? '50%' : '0'
                }}
              />
            </RadioGroup>

            <Typography sx={{ mb: 2, fontWeight: 500 }}>L'absence doit-elle être approuvée ?</Typography>

            {/* <Select value={statusValue} onChange={handleStatusValue} sx={{ mb: 1, maxWidth: 360 }} fullWidth>
              <MenuItem value='Choisir'>-- Choisir --</MenuItem>
              <MenuItem value='red'>Oui</MenuItem>
              <MenuItem value='green'>Non</MenuItem>
              {/* Add more colors to the list as needed */}
            {/* </Select>
            <Typography sx={{ mb: 2, fontWeight: 500 }}>Possibilité de joindre des documents ?</Typography>
            <Select value={selectValue} onChange={handleSelectValue} sx={{ mb: 1, maxWidth: 360 }} fullWidth>
              <MenuItem value='Choisir'>-- Choisir --</MenuItem>
              <MenuItem value='red'>Oui</MenuItem>
              <MenuItem value='green'>Non</MenuItem>
            </Select>  */}
            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
                Create Type Absence
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
