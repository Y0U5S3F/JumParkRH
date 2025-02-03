// ** React Imports
import { useState, forwardRef, SyntheticEvent, ForwardedRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box, { BoxProps } from '@mui/material/Box'
import Grid, { GridProps } from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import { styled, alpha, useTheme } from '@mui/material/styles'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { InvoiceClientType } from 'src/types/apps/invoiceTypes'

// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'

interface PickerProps {
  label?: string
}

interface Props {
  toggleAddCustomerDrawer: () => void
  invoiceNumber: number
  clients: InvoiceClientType[] | undefined
  selectedClient: InvoiceClientType | null
  setSelectedClient: (val: InvoiceClientType | null) => void
}

const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const AddCard = () => {
  // ** Props
  // const { clients, invoiceNumber, selectedClient, setSelectedClient, toggleAddCustomerDrawer } = props

  // ** States

  const [issueDate, setIssueDate] = useState<DateType>(new Date())
  const [dueDate, setDueDate] = useState<DateType>(new Date(tomorrowDate))
  const [open, setOpen] = useState<boolean>(false)
  const handleDialogToggle = (id: any, date: any) => {
    console.log('date time--', date)
    console.log('date id--', id)
    setOpen(!open)
  }

  // ** Hook
  const theme = useTheme()

  // ** Deletes form
  const deleteForm = (e: SyntheticEvent) => {
    e.preventDefault()

    // @ts-ignore
    e.target.closest('.repeater-wrapper').remove()
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
      <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
        <Typography variant='h5' component='span' sx={{ mb: 2 }}>
          Add New Service
        </Typography>
        {/* <Typography variant='body2'>Permissions you may use and assign to your users.</Typography> */}
      </DialogTitle>
      <DialogContent sx={{ pb: 12, mx: 'auto' }}>
        <Box
          component='form'
          // onSubmit={onSubmit}
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
            label='Service Name'
            sx={{ mb: 1, maxWidth: 360 }}
            placeholder='Enter department Name'
            name='name'
            // value='test'
            // onChange={e => setName(e.target.value)}
            required
          />
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
  )
}
export default AddCard
