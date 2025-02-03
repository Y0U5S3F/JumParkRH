// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Type Import
import { PricingDataType } from 'src/@core/components/plan-details/types'
import Typography from '@mui/material/Typography'
import PageHeader from 'src/@core/components/page-header'
// ** Demo Components Imports
import DialogAddCard from 'src/views/pages/dialog-examples/DialogAddCard'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import { getWeekday } from 'src/store/settings/configTime'
import { useQuery } from 'react-query'
import DialogShareProject from 'src/views/pages/dialog-examples/DialogAddCard'
import DialogAddAddress from 'src/views/pages/dialog-examples/DialogAddAddress'

const DialogExamples = () => {
  const { data: weekday, isLoading, error } = useQuery('weekday', getWeekday)

  if (!weekday) {
    return <div>Loading...</div>
  }
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Icon icon='mdi:calendar-clock' color='#915592' width='60' height='80' />
          </div>
          <CardHeader
            title='Configuration Planning de travail'
            style={{ textAlign: 'center', marginTop: '-20px' }}
          ></CardHeader>
          {
            <CardContent style={{ textAlign: 'center', marginTop: '-10px' }}>
              Définissez et attribuez les horaires de travail
              <br />
              de votre entreprise.
            </CardContent>
          }
        </Card>
      </Grid>

      <Grid item md={4} sm={6} xs={12}>
        <DialogShareProject />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <DialogAddCard />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <DialogAddAddress weekday={weekday} />
      </Grid>
    </Grid>
  )
}

export default DialogExamples
