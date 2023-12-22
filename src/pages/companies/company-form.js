import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import endPoint from 'src/configs/endPoint'
import FilePathUtils from 'src/@core/utils/file-paths'
import auth from 'src/configs/auth'
import axios from 'axios'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Icon from 'src/@core/components/icon'
import { CircularProgress, FormControlLabel, FormHelperText, Switch } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

const FORM_MODE_UPDATE = 'UPDATE';
const FORM_MODE_INSERT = 'NEW';

const CompanyForm = (props) => {
  const [loading, setLoading] = useState(false)
  const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)

  useEffect(() => {
    const fetchData = async () => {
      if (props.show) {
        if (props.formMode == FORM_MODE_UPDATE) {
          await axios.get(`${endPoint.jsonServer}/companies/${props.companyIdToUpdate}`,
            {
              headers: {
                Authorization: storedToken
              }
            }).then(async response => {
              const company = response.data
              setValue('name', company.name)
              setValue('description', company.description)
              setValue('logo', company.logo)
              setValue('isActive', company.isActive)
            }).catch(error => {
              toast.error(error)
            })
        } else if (props.formMode === FORM_MODE_INSERT) {
          setValue('name', '')
          setValue('description', '')
          setValue('isActive', true)
        }
      }
    }
    fetchData();
  }, [props.show])

  const onSubmit = async () => {
    setLoading(true)
    const model = getValues()
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(1000)
    if (props.formMode === FORM_MODE_UPDATE) {
      await axios.put(`${endPoint.jsonServer}/companies/${props.companyIdToUpdate}`, { ...model }, {
        headers: {
          Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`
        },
      }).then(response => {
        toast.success(response.data.message)
        props.formShow(false)
        reset()
      }).catch(error => {
        props.formShow(false)
        toast.error(error.response.data.message)
      })
    } else if (props.formMode === FORM_MODE_INSERT) {
      axios.post(`${endPoint.jsonServer}/companies/`, { ...model },
        {
          headers: {
            Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`
          }
        }).then(response => {
          toast.success(response.data.message)
          props.formShow(false)
        }).catch(error => {
          props.formShow(false)
          toast.error(error.response.data.message)
        })
    }
    setLoading(false)
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors }
  } = useForm()

  // ** States
  return (
    <Dialog
      fullWidth
      open={props.show}
      maxWidth='md'
      scroll='body'
      onClose={() => {
        props.formShow(false)
        document.getElementById('form').reset
        reset()
      }}
      onBackdropClick={() => props.formShow(false)}
    >
      <form id='form' onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => props.formShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Company Form
            </Typography>
            <Typography variant='body2'>Save by filling details..</Typography>
          </Box>

          <Grid container spacing={5}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Name'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-name'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: false }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      rows={5}
                      value={value}
                      label='Description'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.description && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-description'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='isActive'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label='Active ?' />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button type='submit' variant='contained'>
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
            Submit
          </Button>
          <Button type='reset' variant='outlined' color='secondary' onClick={() => props.formShow(false)}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog >
  )
}

export default CompanyForm
