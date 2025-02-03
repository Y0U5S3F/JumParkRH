// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Accordion from '@mui/material/Accordion'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// Styled TabList component
const MuiBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}))

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  overflow: 'visible',
  '& .MuiTabs-flexContainer': {
    flexDirection: 'column'
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minHeight: 40,
    minWidth: 280,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: theme.shape.borderRadius,
    '& svg': {
      marginBottom: 0,
      marginRight: theme.spacing(1)
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%'
    }
  }
}))
// Styled TabList component
// const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
//   border: 0,
//   minWidth: 110,
//   '& .MuiTabs-indicator': {
//     display: 'none'
//   },
//   '& .Mui-selected': {
//     backgroundColor: theme.palette.primary.main,
//     color: '#012355'
//   },
//   '& .MuiTab-root': {
//     minHeight: 38,
//     minWidth: 110,
//     borderRadius: 8,
//     margin: theme.spacing(1, 0),
//     paddingTop: theme.spacing(2),
//     paddingBottom: theme.spacing(2)
//   }
// }))

const Settings = () => {
  // ** State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <MuiBox>
      <TabContext value={value}>
        <Box sx={{ display: 'flex' }}>
          <TabList orientation='vertical' onChange={handleChange} aria-label='customized vertical tabs example'>
            <Tab value='1' label='Géneral' />
            <Tab value='2' label='finance' />
            <Tab value='3' label='settings' />
          </TabList>

          <TabPanel value='1'>
            <Typography>Géneral for informations entreprise</Typography>
          </TabPanel>
          <TabPanel value='2'>
            <Typography>Matricule / TVA ....</Typography>
          </TabPanel>
          <TabPanel value='3'>
            <Typography>Password / permission / accée ....</Typography>
          </TabPanel>
        </Box>
      </TabContext>
    </MuiBox>
  )
}

export default Settings
