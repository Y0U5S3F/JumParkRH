// ** MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { SidebarLeftType, CalendarFiltersType } from 'src/types/apps/calendarTypes'
import TextField from '@mui/material/TextField'
import { Grid } from '@mui/material'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

// const TableHeader = (props: TableHeaderProps) => {
//   // ** Props
//   const { value, handleFilter } = props
//   const [name, setName] = useState('')
//   // ** State
//   const [open, setOpen] = useState<boolean>(false)
//   const queryClient = useQueryClient()

//   const handleDialogToggle = () => setOpen(!open)

//   const addServiceMutation = useMutation(CreateService, {
//     onSuccess: () => {
//       queryClient.invalidateQueries('services')
//       toast.success('created successfully')
//     }
//   })

//   const onSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     addServiceMutation.mutate({ name })
//     setOpen(false)
//     setName('')
//   }
const SidebarLeft = (props: SidebarLeftType) => {
  const {
    store,
    mdAbove,
    dispatch,
    calendarsColor,
    leftSidebarOpen,
    leftSidebarWidth,
    handleSelectEvent,
    handleAllCalendars,
    handleCalendarsUpdate,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle
  } = props

  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]: string[]) => {
        return (
          <FormControlLabel
            key={key}
            label={key}
            sx={{ mb: 0.5 }}
            control={
              <Checkbox
                color={value as ThemeColor}
                checked={store.selectedCalendars.includes(key as CalendarFiltersType)}
                onChange={() => dispatch(handleCalendarsUpdate(key as CalendarFiltersType))}
              />
            }
          />
        )
      })
    : null

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle()
    dispatch(handleSelectEvent(null))
  }

  if (renderFilters) {
    return (
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 2,
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            borderRadius: 1,
            boxShadow: 'none',
            width: leftSidebarWidth,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderBottomRightRadius: 0,
            p: theme => theme.spacing(5),
            zIndex: mdAbove ? 2 : 'drawer',
            position: mdAbove ? 'static' : 'absolute'
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute'
          }
        }}
      >
        {/* <Button fullWidth variant='contained' onClick={handleSidebarToggleSidebar}>
          Add absance
        </Button> */}
        {/* <TextField
          size='small'
          // value={value}
          sx={{ mr: 4, mb: 2.5 }}
          placeholder='Search employee'
          // onChange={e => handleFilter(e.target.value)}
        /> */}
        {/* <Box sx={{ display: 'flex', flexDirection: 'column', '& > *': { mt: 4, maxWidth: 500 } }}> */}

        <FormControl fullWidth>
          <InputLabel id='employee-id'>Select Employe</InputLabel>

          <Select
            fullWidth
            // value={statusValue}
            sx={{ mr: 4, mb: 2 }}
            label='employee'
            // onChange={handleStatusValue}
            labelId='employee-id'
          >
            <MenuItem value=''>none</MenuItem>
            <MenuItem value='Aness'>Aness</MenuItem>
            <MenuItem value='Amine'>Amine</MenuItem>
            <MenuItem value='Mahdi'>Mahdi</MenuItem>
            <MenuItem value='Nesrine'>Nesrine</MenuItem>
            <MenuItem value='Wael'>Wael</MenuItem>
            <MenuItem value='Syrine'>Syrine</MenuItem>
          </Select>
        </FormControl>
        {/* <FormControl fullWidth>
          <InputLabel id='demo-simple-select-outlined-label'>Search employee</InputLabel>
          <Select
            label='employee'
            defaultValue=''
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl> */}
        {/* </Box> */}
        <Typography variant='body2' sx={{ mt: 7, mb: 2.5, textTransform: 'uppercase' }}>
          Employes
        </Typography>
        <FormControlLabel
          label='Aness Bouaoud'
          sx={{ mr: 0, mb: 0.5 }}
          control={<Checkbox color='primary' />}
        />
        <FormControlLabel label='Amine Riahi' sx={{ mr: 0, mb: 0.5 }} control={<Checkbox color='primary' />} />
        <FormControlLabel label='Mahdi Tartar' sx={{ mr: 0, mb: 0.5 }} control={<Checkbox color='primary' />} />
        <FormControlLabel label='Nesrine Aouinti' sx={{ mr: 0, mb: 0.5 }} control={<Checkbox color='primary' />} />

        {/* <FormControlLabel
          label='View All'
          sx={{ mr: 0, mb: 0.5 }}
          control={
            <Checkbox
              color='secondary'
              checked={store.selectedCalendars.length === colorsArr.length}
              onChange={e => dispatch(handleAllCalendars(e.target.checked))}
            />
          }
        /> */}
        {/* {renderFilters} */}
      </Drawer>
    )
  } else {
    return null
  }
}

export default SidebarLeft
