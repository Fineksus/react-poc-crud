import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import endPoint from 'src/configs/endPoint'
import auth from 'src/configs/auth'
import axios from 'axios'
import DateTimeUtils from 'src/@core/utils/datetime-utils'
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
import { Alert, CircularProgress, Fade, FormControlLabel, FormHelperText, InputAdornment, OutlinedInput, Switch } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomAutoCompleteServerSide from 'src/components/form-controls/CustomAutoCompleteServerSide'

const FORM_MODE_UPDATE = 'UPDATE';
const FORM_MODE_INSERT = 'NEW';

const EmployeeForm = (props) => {
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState([])
  const [companies, setCompanies] = useState([])

  const [alert, setAlert] = useState(
    {
      "isOpen": false,
      "message": "",
      "severity": "",
      "errors": []
    }
  )
  useEffect(() => {
    const fetchData = async () => {
      if (props.show) {
        const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)

        await axios
          .get(endPoint.jsonServer + '/countries', {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setCountries(response.data)
          }).catch(() => {
            toast.error("Countries could not get")
          })

        await axios
          .get(endPoint.jsonServer + '/companies', {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setCompanies(response.data)
          }).catch(() => {
            toast.error("Companies could not get")
          })

        if (props.formMode == FORM_MODE_UPDATE) {
          await axios.get(`${endPoint.jsonServer}/employees/${props.employeeIdToUpdate}`,
            {
              headers: {
                Authorization: storedToken
              }
            }).then(async response => {
              const employeeToUpdate = response.data
              setValue('firstName', employeeToUpdate.firstName)
              setValue('lastName', employeeToUpdate.lastName)
              setValue('nickName', employeeToUpdate.nickName)
              setValue('companyId', employeeToUpdate.companyId)
              setValue('nationality', employeeToUpdate.nationality)
              setValue('identityNumber', employeeToUpdate.identityNumber)
              setValue('dateOfBirth', DateTimeUtils.parseStringToDate(employeeToUpdate.dateOfBirth))
              setValue('phone1', employeeToUpdate.phone1)
              setValue('phone2', employeeToUpdate.phone2)
              setValue('address', employeeToUpdate.address)
              setValue('email', employeeToUpdate.email)
              setValue('description', employeeToUpdate.description)
              setValue('isActive', employeeToUpdate.isActive)
            }).catch(error => {
              toast.error(error)
            })
        } else if (props.formMode === FORM_MODE_INSERT) {
          setValue('firstName', '')
          setValue('lastName', '')
          setValue('nickName', '')
          setValue('company', '')
          setValue('nationality', '')
          setValue('identityNumber', '')
          setValue('dateOfBirth', '')
          setValue('phone1', '')
          setValue('phone2', '')
          setValue('address', '')
          setValue('email', '')
          setValue('description', '')
          setValue('isActive', true)
        }
      }
    }
    setAlert({
      isOpen: false,
      message: "",
      severity: "",
      errors: []
    });
    fetchData();
  }, [props.show])

  const onSubmit = async () => {
    setLoading(true)
    const model = getValues()
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(1000)
    if (props.formMode === FORM_MODE_UPDATE) {
      axios.put(`${endPoint.jsonServer}/employees/${props.employeeIdToUpdate}`, { ...model },
        {
          headers: {
            Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`
          }
        }).then(response => {
          toast.success("Record Saved")
          props.formShow(false)
          reset()
        }).catch(error => {
          props.formShow(false)
          toast.error(error.response.data.message)
        })
    } else if (props.formMode === FORM_MODE_INSERT) {
      axios.post(`${endPoint.jsonServer}/employees/`, { ...model },
        {
          headers: {
            Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`
          }
        }).then(response => {
          toast.success("Record Saved")
          props.formShow(false)
        }).catch(error => {
          setAlert((prevAlert) => ({
            ...prevAlert,
            "isOpen": true,
            "message": error.response.data.message,
            "severity": "error"
          }))
          toast.success("Error")
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
              Member Form
            </Typography>
            <Typography variant='body2'>Save by filling details..</Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Fade in={alert.isOpen} {...(alert.isOpen ? { timeout: 700 } : {})}>
              <Alert severity={alert.severity}
                action={
                  <IconButton size='small' color='inherit' aria-label='close' onClick={() => setAlert({ "isOpen": false, "message": "", "severity": alert.severity, "errors": [] })}>
                    <Icon icon='tabler:x' />
                  </IconButton>
                }
              >
                <b>{alert.message}</b>
                {alert.errors.length > 0 && (
                  <div>
                    {alert.errors.map((error, index) => (
                      <div key={index}>- {error}</div>
                    ))}
                  </div>
                )}
              </Alert>
            </Fade>
          </Box>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='firstName'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='First Name'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.firstName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-firstName'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='lastName'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Last Name'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.lastName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-lastName'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='nickName'
                  control={control}
                  defaultValue={''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Nick Name'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.nickName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-nickName'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='companyId'
                  control={control}
                  defaultValue={''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      autoHighlight
                      id='autocomplete-company-select'
                      options={companies}
                      getOptionLabel={option => option.name || ''}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : '');
                      }}
                      value={companies.find(company => company.id === value) || null}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={'Company'}
                          onChange={onChange}
                          inputProps={{
                            ...params.inputProps
                          }}
                        />
                      )}
                    />
                  )}
                />
                {errors.company && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-company'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='nationality'
                  control={control}
                  defaultValue={''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      autoHighlight
                      id='autocomplete-country-select'
                      options={countries}
                      getOptionLabel={option => option.name || ''}
                      renderOption={(props, option) => (
                        <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
                          <img
                            alt=''
                            width='20'
                            loading='lazy'
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          />
                          {option.name} ({option.code}) {option.phone}
                        </Box>
                      )}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : '');
                      }}
                      value={countries.find(country => country.id === value) || null}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={'Nationality'}
                          onChange={onChange}
                          inputProps={{
                            ...params.inputProps
                          }}
                        />
                      )}
                    />
                  )}
                />
                {errors.nationality && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-nationality'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='identityNumber'
                  control={control}
                  defaultValue={''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Identity Number'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.identityNumber && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-identityNumber'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='dateOfBirth'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        showYearDropdown
                        showMonthDropdown
                        selected={value}
                        id='month-year-dropdown'
                        dateFormat="dd-MM-yyyy"
                        placeholderText='DD-MM-YYYY'
                        popperPlacement={'bottom-start'}
                        onChange={(selectedDate) => {
                          const utcDate = DateTimeUtils.convertLocalToUTCDate(selectedDate)
                          onChange(utcDate);
                        }}
                        customInput={<TextField label='Date Of Birth' fullWidth />}
                      />
                    </DatePickerWrapper>
                  )}
                />
                {errors.dateOfBirth && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-dateOfBirth'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='phone1'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Phone 1'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.phone1 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-phone1'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='phone2'
                  control={control}
                  rules={{ required: false }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Phone 2'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.phone2 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-phone2'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Email'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-email'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='address'
                  control={control}
                  rules={{ required: false }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Address'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.address && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-address'>
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: false }}
                  defaultValue={''}
                  render={({ field }) => (
                    <TextField
                      rows={4}
                      multiline
                      {...field}
                      label='Description'
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
    </Dialog>
  )
}

export default EmployeeForm
