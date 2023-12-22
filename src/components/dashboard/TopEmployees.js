// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import endPoint from 'src/configs/endPoint'
import auth from 'src/configs/auth'
import axios from 'axios'
import FilePaths from 'src/@core/utils/file-paths'


const TopEmployees = () => {
  const [data, setData] = useState([])
  const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${endPoint.jsonServer}/top-employees`,
        {
          headers: {
            Authorization: storedToken
          }
        }
      ).then(async response => {
        console.log(response.data)
        setData(response.data)
      })
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader
        title='Top Employees'
        subheader={`Top employees by scores`}
        action={
          <></>
        }
      />
      <CardContent
        sx={
          { maxHeight: '400px', overflowY: 'auto' }
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
                <Typography variant='h6'>{item.nickName} | {item.name} {item.surName}</Typography>
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

export default TopEmployees
