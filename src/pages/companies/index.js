import { useEffect, useState, useCallback } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import DialogCompanyForm from './company-form'
import axios from 'axios'
import auth from 'src/configs/auth'
import endPoint from 'src/configs/endPoint'
import toast from 'react-hot-toast'

const FORM_MODE_UPDATE = 'UPDATE';
const FORM_MODE_INSERT = 'NEW';

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const statusObj = {
  true: { title: 'Active', color: 'success' },
  false: { title: 'Passive', color: 'error' },
}

const Companies = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(7)
  const [searchText, setSearchText] = useState()
  const [filteredData, setFilteredData] = useState([])
  const [formShow, setFormShow] = useState(false)
  const [companyIdToUpdate, setCompanyIdToUpdate] = useState()
  const [formMode, setFormMode] = useState()

  const handleEdit = (rowData) => {
    setFormMode(FORM_MODE_UPDATE)
    setCompanyIdToUpdate(rowData.id)
    setFormShow(true)
  }

  const handleInsertNewRecord = () => {
    setFormMode(FORM_MODE_INSERT)
    setFormShow(true)
  }

  const columns = [
    {
      flex: 0.10,
      field: 'name',
      headerName: 'Name',
      renderCell: params => {
        return (
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.name} {params.row.lastName}
          </Typography>
        )
      }
    },
    {
      flex: 0.175,
      headerName: 'Description',
      field: 'description',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.description}
        </Typography>
      )
    },
    {
      flex: 0.175,
      maxWidth: 100,
      field: 'isActive',
      headerName: 'Status',
      renderCell: params => {
        const status = statusObj[params.row.isActive]

        return (
          <CustomChip
            rounded
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.175,
      maxWidth: 100,
      headerName: '',
      field: "click",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <ListItemIcon onClick={() => { handleEdit(params.row) }}>
              <Icon icon='tabler:edit' fontSize={20} />
            </ListItemIcon>
          </div>
        )
      }
    }
  ]

  const handleSearch = (searchValue) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')

    const filteredRows = data.filter(row => {
      return Object.keys(row).some(field => {
        // @ts-ignore
        return searchRegex.test(row[field].toString())
      })
    })
    if (searchValue.length) {
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  const fetchData = useCallback(
    async () => {
      await axios.get(`${endPoint.jsonServer}/companies/`,
        {
          headers: {
            Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`
          }
        }).then(response => {
          setData(response.data)
        }).catch(error => {
          toast.error(error)
        })
    }, []
  )

  useEffect(() => {
    if (formShow == false) {
      fetchData()
    }
  }, [formShow])

  return (
    <>
      <Card>
        <CardHeader title='Companies' />
        <Box
          sx={{
            gap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: theme => theme.spacing(2, 5, 4, 5)
          }}
        >
          <Button variant='outlined' startIcon={<Icon icon='tabler:plus' />} onClick={handleInsertNewRecord}>
            New Record
          </Button>
          <TextField
            value={searchText}
            size='small'
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search'
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 2, display: 'flex' }}>
                  <Icon icon='tabler:search' fontSize={20} />
                </Box>
              ),
              endAdornment: (
                <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => { handleSearch('') }}>
                  <Icon icon='tabler:x' fontSize={20} />
                </IconButton>
              )
            }}
            sx={{
              width: {
                xs: 1,
                sm: 'auto'
              },
              '& .MuiInputBase-root > svg': {
                mr: 2
              }
            }}
          />
        </Box>
        <DataGrid
          disableRowSelectionOnClick
          autoHeight
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[7, 10, 25, 50]}
          rows={filteredData.length ? filteredData : data}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          sortModel={[
            { field: 'name', sort: 'asc' }
          ]}
        />
      </Card>
      <DialogCompanyForm
        show={formShow}
        formMode={formMode}
        companyIdToUpdate={companyIdToUpdate}
        formShow={setFormShow}
      />
    </>
  )
}

export default Companies
