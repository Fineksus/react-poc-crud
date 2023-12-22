// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { CircularProgress } from '@mui/material'
import axios from 'axios'
import auth from 'src/configs/auth'

const DropZoneFileUploader = ({ label, allowedTypes, maxFiles, endPoint, onChange }) => {
  // ** State
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)


  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: maxFiles,
    maxSize: 2000000,
    accept: allowedTypes,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error(`You can only upload ${maxFiles} files & maximum size of 2 MB.`)
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const handleUploadFiles = async () => {
    setLoading(true)
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(1000)
    const formData = new FormData()
    formData.append('file', files[0])
    axios.post(endPoint, formData,
      {
        headers: {
          Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`,
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        toast.success(response.data.message)
        onChange(response.data.data)
      }).catch(error => {
        toast.error(error.response.data.message)
      })
    setLoading(false)
  }

  const fileList = files.map(file => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box
            sx={{
              mb: 8.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
            }}
          >
            <Icon icon='tabler:upload' fontSize='1.75rem' />
          </Box>
          <Typography variant='h4' sx={{ mb: 2.5 }}>
            {label}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Allowed *.jpeg, *.jpg, *.png, *.gif</Typography>
          {/*<Typography sx={{ color: 'text.secondary' }}>Max 2 files and max size of 2 MB</Typography>*/}
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button onClick={handleUploadFiles} variant='contained'>
              {loading ? (
                <CircularProgress
                  sx={{
                    color: 'common.white',
                    width: '20px !important',
                    height: '20px !important',
                    mr: theme => theme.spacing(2)
                  }}
                />
              ) : null}
              Upload Files
            </Button>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default DropZoneFileUploader
