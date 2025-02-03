// ** React Imports
import { useState, useEffect, forwardRef, useCallback, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridRowId, GridToolbar, GridToolbarExport } from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'
// import PrintButton from './PrintButton' // the component that handles printing
// import ReactToPrint from 'react-to-print'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteInvoice } from 'src/store/apps/invoice'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { RecapType } from 'src/types/apps/recapTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { getRecapFilter } from 'src/store/rapports'
import { getdepartments } from 'src/store/departments'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/rapports/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { BeatLoader } from 'react-spinners'
import { Button } from '@mui/material'
// import html2canvas from 'html2canvas'
// import 'jspdf-autotable/dist/jspdf.plugin.autotable.min.js'

import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
import autoTable, { ThemeType } from 'jspdf-autotable'

// import 'jspdf-autotable'

interface AttendanceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: RecapType
}

// ** Styled component for the link in the dataTable
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Vars
const AttendanceStatusObj: AttendanceStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' }
}

// ** renders client column
const renderClient = (row: RecapType) => {
  return (
    <CustomAvatar skin='light' color={'primary' as ThemeColor} sx={{ mr: 3, fontSize: '1rem', width: 34, height: 34 }}>
      {getInitials(row.full_name)}
    </CustomAvatar>
  )
}

const defaultColumns = [
  {
    flex: 0.1,
    field: 'matricule',
    minWidth: 80,
    headerName: 'Matricule',
    renderCell: ({ row }: CellType) => (
      <StyledLink href={`/apps/invoice/preview/${row.matricule}`}>{`#${row.matricule}`}</StyledLink>
    )
  },
  {
    flex: 0.25,
    field: 'full_name',
    minWidth: 300,
    headerName: 'Employee',
    renderCell: ({ row }: CellType) => {
      const { full_name } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant='body2'
              sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
            >
              {full_name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  // {
  //   flex: 0.1,
  //   minWidth: 90,
  //   field: 'date',
  //   headerName: 'Date',
  //   renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.date}</Typography>
  // },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'nbJourTrav',
    headerName: 'Nb jours',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          size='small'
          // key={index}
          skin='light'
          color='primary'
          label={row.nbJourTrav}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' }, '&:not(:last-of-type)': { mr: 3 } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'nbJourSup',
    headerName: 'Nb jours sup',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          size='small'
          // key={index}
          skin='light'
          color='primary'
          label={row.nbJourSup}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' }, '&:not(:last-of-type)': { mr: 3 } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'absance',
    headerName: 'NB absence',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.absance}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'conge',
    headerName: 'NB conge',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.conge}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'jourFerie',
    headerName: 'jours fériés',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.jourFerie}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'department',
    headerName: 'department',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.department}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'service',
    headerName: 'Fonction',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.service}</Typography>
  }
  // {
  //   flex: 0.15,
  //   minWidth: 125,
  //   field: 'issuedDate',
  //   headerName: 'Issued Date',
  //   renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.issuedDate}</Typography>
  // },
  // {
  //   flex: 0.1,
  //   minWidth: 90,
  //   field: 'balance',
  //   headerName: 'Balance',
  //   renderCell: ({ row }: CellType) => {
  //     return row.balance !== 0 ? (
  //       <Typography variant='body2' sx={{ color: 'text.primary' }}>
  //         {row.balance}
  //       </Typography>
  //     ) : (
  //       <CustomChip size='small' skin='light' color='success' label='Paid' />
  //     )
  //   }
  // }
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const RapportList = () => {
  // ** State
  const gridRef = useRef<any>()

  const [dates, setDates] = useState<Date[]>([])
  const [RecapFiltred, setRecapFiltred] = useState<any>([])
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const { data: departments, isLoading: isLoadingdepartment } = useQuery('department', getdepartments)
  const datePickerRef = useRef<any>(null)

  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - 5)
  const defaultDateDeb = currentDate.toISOString().substring(0, 10)

  const [dateDeb, setDateDeb] = useState(defaultDateDeb)

  const currentDatee = new Date()
  const defaultDateFin = currentDatee.toISOString().substring(0, 10)

  const [dateFin, setDateFin] = useState(defaultDateFin)

  const [data, setData] = useState<any>({
    selectedDept: 1,
    dateDeb: dateDeb,
    dateFin: dateFin
  })
  const { data: recap, isLoading, error } = useQuery('recap', () => getRecapFilter(data))

  useEffect(() => {
    setRecapFiltred(recap)
  }, [recap])

  const handledepartmentFilterChange = (event: any) => {
    setData({ ...data, selectedDept: event.target.value })
  }
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }
  // function to handle date range changes
  const handleOnChangeRange = (dates: any) => {
    setStartDateRange(dates[0])
    setEndDateRange(dates[1])
    setDates(dates)
    const dateObjectt = new Date(dates[0])
    const y = dateObjectt.getFullYear()
    const m = ('0' + (dateObjectt.getMonth() + 1)).slice(-2)
    const d = ('0' + dateObjectt.getDate()).slice(-2)
    const startDateR = `${y}-${m}-${d}`

    const dateObject = new Date(dates[1])
    const year = dateObject.getFullYear()
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2)
    const day = ('0' + dateObject.getDate()).slice(-2)
    const endDateR = `${year}-${month}-${day}`
    setData({ ...data, dateDeb: startDateR, dateFin: endDateR })
    if (dates[0] && dates[1]) {
      datePickerRef.current?.setOpen(false) // close the datepicker after selecting a date range with both start and end dates
    }
  }
  // function to handle filter button click
  const handleFilterButtonClick = () => {
    ReacpMutation.mutate(data)
  }
  const queryClient = useQueryClient()

  const ReacpMutation = useMutation(getRecapFilter, {
    onSuccess: data => {
      // Invalidates cache and refetch
      setRecapFiltred(data)
      queryClient.invalidateQueries('recap')
      // toast.success('user created successfully')
    }
  })

  useEffect(() => {
    const filtered = recap?.filter((r: any) => {
      let passesFilters = true
      // if (FullNameFilter) {
      //   passesFilters = passesFilters && employe.full_name.toLowerCase().includes(FullNameFilter)
      // }
      if (data.selectedDept !== '') {
        passesFilters = passesFilters && r?.department_id == data.selectedDept
      }
      return passesFilters
    })

    setRecapFiltred(filtered)
  }, [data])

  const handleExportPDF = () => {
    const doc = new jsPDF()
    const tableData = recap.map(({ id, ...rest }: { id: number;[key: string]: any }) => Object.values(rest))
    const tableColumns = Object.keys(recap[0]).filter(key => key !== 'id')

    const tableStyle: {
      theme?: ThemeType | undefined
      headStyles?: any
      bodyStyles?: any
      alternateRowStyles?: any
      startY?: number
      margin?: { top?: number; right?: number; bottom?: number; left?: number }
      styles?: any
    } = {
      theme: 'grid',
      headStyles: { fillColor: [145, 85, 146], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      startY: 40,
      margin: { top: 40, bottom: 10 },
      styles: { cellPadding: 0.75, fontSize: 7 }
    }

    doc.setFontSize(16)
    doc.text('Attendance Report', 14, 22)

    autoTable(doc, { head: [tableColumns], body: tableData, ...tableStyle })
    doc.save('recap.pdf')
  }

  const columns = [
    ...defaultColumns
    // {
    //   flex: 0.1,
    //   minWidth: 130,
    //   sortable: false,
    //   field: 'actions',
    //   headerName: 'Actions',
    //   renderCell: ({ row }: CellType) => (
    //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //       <Tooltip title='Delete Attendance'>
    //         <IconButton size='small' sx={{ mr: 0.5 }}>
    //           <Icon icon='mdi:delete-outline' />
    //         </IconButton>
    //       </Tooltip>
    //       <Tooltip title='View'>
    //         <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/apps/invoice/preview/${row.id}`}>
    //           <Icon icon='mdi:eye-outline' />
    //         </IconButton>
    //       </Tooltip>
    //       <OptionsMenu
    //         iconProps={{ fontSize: 20 }}
    //         iconButtonProps={{ size: 'small' }}
    //         menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
    //         options={[
    //           {
    //             text: 'Download',
    //             icon: <Icon icon='mdi:download' fontSize={20} />
    //           },
    //           {
    //             text: 'Edit',
    //             href: `/apps/invoice/edit/${row.id}`,
    //             icon: <Icon icon='mdi:pencil-outline' fontSize={20} />
    //           },
    //           {
    //             text: 'Duplicate',
    //             icon: <Icon icon='mdi:content-copy' fontSize={20} />
    //           }
    //         ]}
    //       />
    //     </Box>
    //   )
    // }
  ]
  if (isLoading) {
    return <BeatLoader color={'#36D7B7'} loading={isLoading} size={15} />
  }

  if (error) {
    return <div className='error-toast'>Oops, something went wrong!</div>
  }
  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>department</InputLabel>
                    <Select
                      fullWidth
                      value={data.selectedDept}
                      sx={{ mb: 2 }}
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
                <Grid item xs={12} sm={5}>
                  <DatePicker
                    ref={datePickerRef}
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
                </Grid>

                <Grid item xs={12} sm={2}>
                  {' '}
                  <Button
                    size='large'
                    type='submit'
                    sx={{ mr: 2, height: '55px' }}
                    variant='contained'
                    onClick={handleFilterButtonClick}
                  // disabled={isLoading}
                  >
                    Exporter
                  </Button>
                </Grid>
                <Grid item xs={12} sm={2}>
                  {' '}
                  <Button
                    size='large'
                    type='submit'
                    sx={{ mr: 2, height: '55px' }}
                    variant='contained'
                    onClick={handleExportPDF}
                  // disabled={isLoading}
                  >
                    Download PDF
                  </Button>
                  {/* <Button sx={{ mr: 2, ml: 4 }} variant='contained' onClick={handleExportPDF}>
                    Export PDF
                  </Button> */}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            {/* <TableHeader value={value} handleFilter={handleFilter} dataRecap={RecapFiltred} /> */}
            {RecapFiltred && (
              <DataGrid
                autoHeight
                pagination
                rows={RecapFiltred}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                pageSize={Number(pageSize)}
                rowsPerPageOptions={[10, 25, 50]}
                onSelectionModelChange={rows => setSelectedRows(rows)}
                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                components={{
                  Toolbar: () => (
                    <GridToolbar disableDensity disableColumns>
                      <GridToolbarExport csvOptions={{ disableExportFileName: true }} />

                      {/* <TextField
                        size='small'
                        value={value}
                        placeholder='Search User'
                        onChange={e => handleFilter(e.target.value)}
                      /> */}
                    </GridToolbar>
                  )
                }}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default RapportList
