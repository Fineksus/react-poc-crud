import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Statistics from 'src/components/dashboard/Statistics'
import CampaignsOverview from 'src/components/dashboard/CampaignsOverview'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import TopEmployees from 'src/components/dashboard/TopEmployees'
import TopCompanies from 'src/components/dashboard/TopCompanies'

const Home = () => {

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <Statistics />
        </Grid>

        <Grid item xs={6} md={6}>
          <TopEmployees />
        </Grid>

        <Grid item xs={6} md={6}>
          <TopCompanies />
        </Grid>

        <Grid item xs={12} md={12}>
          <CampaignsOverview />
        </Grid>

      </Grid>
    </ApexChartWrapper>

  )
}

export default Home
