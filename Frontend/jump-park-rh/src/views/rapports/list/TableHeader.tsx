// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from 'next/link'
import XLSX from 'xlsx'
import { GridToolbarExport, GridToolbar } from '@mui/x-data-grid'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

interface TableHeaderProps {
  value: string
  dataRecap: any
  handleFilter: (val: string) => void
}
interface ExportButtonProps {
  exportCsv: () => void
}
const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value, dataRecap } = props
  // const gridRef = React.useRef(null)

  // function handleExportClick() {
  //   console.log('gridRef-----', gridRef.current.api)
  //   if (gridRef.current.api) {
  //     // Get the data from the DataGrid
  //     const rows = gridRef.current.api.getDataAsCsv().split('\n')
  //     const headerRow = rows.shift().split(',')

  //     // Create a new workbook and sheet
  //     const workbook = XLSX.utils.book_new()
  //     const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...rows.map((row: any) => row.split(','))])

  //     // Add the sheet to the workbook and save the file
  //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
  //     XLSX.writeFile(workbook, 'myData.xlsx')
  //   } else {
  //     console.log('Grid reference is not properly initialized.')
  //   }
  // }
  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* <Button
        sx={{ mr: 4, mb: 2 }}
        color='secondary'
        variant='outlined'
        startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
        onClick={handleExportClick}
      >
        Export
      </Button> */}
      {/* <GridToolbar disableDensity disableColumns>
        <GridToolbarExport
          csvOptions={{ disableExportFileName: true }}
          exportCsv
          render={({ exportCsv }: ExportButtonProps) => <IconButton onClick={exportCsv}></IconButton>}
        />
      </GridToolbar> */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 6, mb: 2 }}
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default TableHeader
