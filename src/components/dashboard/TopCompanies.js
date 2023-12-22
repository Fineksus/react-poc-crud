// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
import auth from 'src/configs/auth'
import endPoint from 'src/configs/endPoint'
import axios from 'axios'
import FilePaths from 'src/@core/utils/file-paths'

const TopCompanies = () => {
  const [data, setData] = useState([])
  const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${endPoint.jsonServer}/top-companies`,
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

  return (
    <Card>
      <CardHeader
        title='Top Companies'
        subheader={`Top companies by amounts`}
        action={
          <></>
        }
      />
      <CardContent
        sx={
          { maxHeight: '400px', minHeight: '400px', overflowY: 'auto' }
        }>
        {data.map((item, index) => {
          return (
            <Box
              key={item.name}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                mb: index !== data.length - 1 ? 8.25 : undefined
              }}
            >
              <img width={100} height={50} src={`../${FilePaths.companyLogosPath}/${item.logo ? item.logo : 'default.jpg'}`} alt={item.title} />

              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant='h6'>{item.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h6' sx={{ mr: 4, color: 'text.secondary' }}>
                    {item.totalAmount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default TopCompanies
