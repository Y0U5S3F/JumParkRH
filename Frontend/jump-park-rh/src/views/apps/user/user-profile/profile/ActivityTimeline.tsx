// ** MUI Import
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import AnalyticsTotalTransactions from 'src/views/dashboards/dashboards-user/analytics/AnalyticsTotalTransactions'
import AnalyticsPerformance from 'src/views/dashboards/dashboards-user/analytics/AnalyticsPerformance'
import AnalyticsSalesCountry from 'src/views/dashboards/dashboards-user/analytics/AnalyticsSalesCountry'
import AnalyticsOverview from 'src/views/dashboards/dashboards-user/analytics/AnalyticsOverview'
import AnalyticsTotalRevenue from 'src/views/dashboards/dashboards-user/analytics/AnalyticsTotalRevenue'
import AnalyticsWeeklySales from 'src/views/dashboards/dashboards-user/analytics/AnalyticsWeeklySales'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import OptionsMenu from 'src/@core/components/option-menu'
import { Grid } from '@mui/material'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const ActivityTimeline = () => {
  return (
      <Grid container spacing={6} className='match-height'>
        {/* <Grid item xs={12} sm={6} md={4}>
          <AnalyticsPerformance />
        </Grid> */}
        {/* <Grid item xs={12} md={8}>
          <AnalyticsTotalTransactions />
        </Grid> */}

        <Grid item xs={12} sm={6} md={6}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <AnalyticsTotalRevenue />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVertical
                stats='$13.4k'
                color='success'
                trendNumber='+38%'
                title='Total Sales'
                chipText='Last Six Month'
                icon={<Icon icon='mdi:currency-usd' />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVertical
                color='info'
                stats='142.8k'
                trendNumber='+62%'
                chipText='Last One Year'
                title='Total Impressions'
                icon={<Icon icon='mdi:link' />}
              />
            </Grid>
            <Grid item xs={6}>
              <AnalyticsOverview />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWeeklySales />

          {/* <AnalyticsSalesCountry /> */}
        </Grid>
        {/* <CardHeader
        title='Activity Timeline'
        sx={{ '& .MuiCardHeader-avatar': { mr: 2.5 } }}
        avatar={<Icon icon='mdi:format-list-bulleted' />}
        titleTypographyProps={{ sx: { color: 'text.primary' } }}
        action={
          <OptionsMenu
            iconButtonProps={{ size: 'small' }}
            options={['Share timeline', 'Suggest edits', { divider: true }, 'Report bug']}
          />
        }
      /> */}
        {/* <CardContent>
        <Timeline sx={{ my: 0, py: 0 }}>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='warning' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Client Meeting</Typography>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  Today
                </Typography>
              </Box>
              <Typography sx={{ mb: 2, color: 'text.secondary' }}>Project meeting with john @10:15am</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src='/images/avatars/2.png' sx={{ mr: 4, width: 38, height: 38 }} />
                <div>
                  <Typography sx={{ fontWeight: 500 }}>Lester McCarthy (Client)</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>CEO of Infibeam</Typography>
                </div>
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='info' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Create a new project for client</Typography>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  2 Days Ago
                </Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary' }}>Add files to new design folder</Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='primary' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Shared 2 New Project Files</Typography>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  6 Days Ago
                </Typography>
              </Box>
              <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ color: 'text.secondary' }}>Sent by Mollie Dixon</Typography>
                <Avatar src='/images/avatars/3.png' sx={{ ml: 5, width: 20, height: 20 }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 6, display: 'flex', alignItems: 'center' }}>
                  <img width={20} height={20} alt='app-guidelines' src='/images/icons/file-icons/pdf.png' />
                  <Typography sx={{ ml: 3, fontWeight: 500 }}>App Guidelines</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img width={20} height={20} alt='testing-results' src='/images/icons/file-icons/doc.png' />
                  <Typography sx={{ ml: 3, fontWeight: 500 }}>Testing Results</Typography>
                </Box>
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='success' />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Project status updated</Typography>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                  10 Days Ago
                </Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary' }}>Woocommerce iOS App Completed</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent> */}
      </Grid>
  )
}

export default ActivityTimeline
