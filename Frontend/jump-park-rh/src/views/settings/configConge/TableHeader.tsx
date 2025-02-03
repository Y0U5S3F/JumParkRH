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
import { CreateTypeConge } from 'src/store/settings/configConge'
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
  const [color, setColor] = useState('#008000')
  const [checked, setChecked] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#008000') // State to store selected color
  const [statusValue, setStatusValue] = useState<string>('')
  const [selectValue, setSelectValue] = useState<string>('')

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
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

  const addTypeCongeMutation = useMutation(CreateTypeConge, {
    onSuccess: () => {
      queryClient.invalidateQueries('typeConge')
      toast.success('created successfully')
    }
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addTypeCongeMutation.mutate({ name, color })
    setOpen(false)
    setName('')
    setColor('')
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
          Ajouter Type Conge
        </Button>
      </Box>
      <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
        <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
            Ajouter un nouveau type conge
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
              label='Nom Conge'
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

            <Typography sx={{ mb: 2, fontWeight: 500 }}>L'conge doit-elle être approuvée ?</Typography>

            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
                Create Type Conge
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
