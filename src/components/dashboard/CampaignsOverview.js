// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import axios from 'axios'
import endPoint from 'src/configs/endPoint'
import auth from 'src/configs/auth'
import FilePathUtils from 'src/@core/utils/file-paths'

const CampaignsOverview = () => {
  const [data, setData] = useState([])
  const [status, setStatus] = useState(true)

  const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${endPoint.jsonServer}/campaignsoverview?isActive=${status}`,
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
  }, [status])

  return (
    <Card>
      <CardHeader
        title='Campaigns'
        subheader=''
        action={
          <OptionsMenu
            options={[
              {
                text: 'Active',
                menuItemProps: {
                  onClick: () => {
                    setStatus(true)
                  }
                }
              },
              {
                text: 'Completed',
                menuItemProps: {
                  onClick: () => {
                    setStatus(false)
                  }
                }
              },
            ]}
          />
        }
      />
      <CardContent
        sx={
          { maxHeight: '400px', overflowY: 'auto' }
        }
      >
        {data.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== data.length - 1 ? 4.5 : undefined
              }}
            >
              <img alt={item.name} src={`../${FilePathUtils.campaignFlyersPath}/${item.flyer ? item.flyer : 'default.jpg'}`} width={64} />
              <Box
                sx={{
                  ml: 4,
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.name}</Typography>
                  <Typography sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>{`${item.targetAmount} - ${item.totalAmount}`}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinearProgress
                    value={item.progress}
                    variant='determinate'
                    color={item.progress == "100" ? "success" : "info"}
                    sx={{ mr: 4, height: 8, width: 200 }}
                  />
                  <Typography sx={{ color: 'text.disabled' }}>{`${item.progress}%`}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default CampaignsOverview
