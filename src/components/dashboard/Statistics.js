// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import axios from 'axios'
import endPoint from 'src/configs/endPoint'
import auth from 'src/configs/auth'

const Statistics = () => {
  const [data, setData] = useState([])
  const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${endPoint.jsonServer}/stats`,
        {
          headers: {
            Authorization: storedToken
          }
        }
      ).then(async response => {
        setData(response.data)
      })
    }
    fetchData()
  }, [])

  const renderStats = (data) => {
    return data.map((stat, index) => (
      <Grid item xs={6} md={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' color={getStatColor(stat.name)} sx={{ mr: 4, width: 42, height: 42 }}>
            <Icon icon={getStatIcon(stat.name)} fontSize='1.5rem' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{stat.name}</Typography>
            <Typography variant='body2'>{stat.value}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  const getStatIcon = (statName) => {
    if (statName === "Campaigns") {
      return "tabler:box"
    }
    if (statName === "Companies") {
      return "tabler:building"
    }
    if (statName === "Employees") {
      return "tabler:users"
    }
    if (statName === "Total Amount") {
      return "tabler:heart-handshake"
    }
  }

  const getStatColor = (statName) => {
    if (statName === "Campaigns") {
      return "info"
    }
    if (statName === "Companies") {
      return "error"
    }
    if (statName === "Employees") {
      return "warning"
    }
    if (statName === "Total Amount") {
      return "success"
    }
  }

  return (
    <Card>
      <CardHeader
        title='Statistics'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        action={
          <></>
        }
      />
      <CardContent
        sx={{ pt: theme => `${theme.spacing(7)} !important`, pb: theme => `${theme.spacing(7.5)} !important` }}
      >
        <Grid container spacing={6}>
          {renderStats(data)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Statistics
