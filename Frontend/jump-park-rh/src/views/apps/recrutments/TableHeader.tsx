// ** React Imports
import { FormEvent, useState } from 'react'

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
import { Createdepartment } from 'src/store/departments'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import router from 'next/router'
import Grid from '@mui/material/Grid'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const handleDialogToggle = () => setOpen(!open)

  const adddepartmentMutation = useMutation(Createdepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries('depatements')
      toast.success('created successfully')
    }
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('teststtt event', event)
    adddepartmentMutation.mutate({ name, email, phone })
    setOpen(false)
    setPhone('')
    setName('')
    setEmail('')
  }
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
          placeholder='Search department'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2.5 }} variant='contained' onClick={handleDialogToggle}>
          Nouvelle offre d'emploi
        </Button>
      </Box>
      <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
        <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
            Créer une nouvelle offre d'emploi
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
                <TextField
                  fullWidth
                  label='Titre offre emploi
'
                  placeholder='Enter Name'
                  name='name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label='Phone'
                  placeholder='Enter Phone'
                  name='phone'
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Email'
                  placeholder='Enter email'
                  name='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
            </Grid>
            {/* <TextField
              fullWidth
              label='department Name'
              sx={{ mb: 1, maxWidth: 360 }}
              placeholder='Enter department Name'
              name='name'
              value={name}
              onChange={e => setText(e.target.value)}
              required
            /> */}
            {/* <FormControlLabel control={<Checkbox />} label='Set as core permission' /> */}
            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
                Create emploi
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
