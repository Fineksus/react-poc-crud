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
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import DraftEditorControlled from 'src/components/form-controls/DraftEditorControlled'

const FORM_MODE_UPDATE = 'UPDATE';
const FORM_MODE_INSERT = 'NEW';

const CampaignFormModal = (props) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (props.show) {
        const storedToken = window.localStorage.getItem(auth.storageTokenKeyName)

        if (props.formMode == FORM_MODE_UPDATE) {
          await axios.get(`${endPoint.jsonServer}/campaigns/${props.campaignIdToUpdate}`,
            {
              headers: {
                Authorization: storedToken
              }
            }).then(async response => {
              const campaign = response.data
              setValue('name', campaign.name)
              setValue('targetAmount', campaign.targetAmount)
              setValue('description', campaign.description)
              setValue('htmlContent', campaign.htmlContent)
              setValue('flyer', campaign.flyer)
              setValue('isActive', campaign.isActive)
            }).catch(error => {
              toast.error(error)
            })
        } else if (props.formMode === FORM_MODE_INSERT) {
          setValue('name', '')
          setValue('targetAmount', 0)
          setValue('description', '')
          setValue('htmlContent', '')
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
      await axios.put(`${endPoint.jsonServer}/campaigns/${props.campaignIdToUpdate}`, { ...model }, {
        headers: {
          Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`
        },
      }).then(response => {
        toast.success("Record updated")
        props.modalShow(false)
        reset()
      }).catch(error => {
        props.modalShow(false)
        toast.error("Record could not update")
      })
    } else if (props.formMode === FORM_MODE_INSERT) {
      axios.post(`${endPoint.jsonServer}/campaigns/`, { ...model },
        {
          headers: {
            Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`
          }
        }).then(response => {
          toast.success("Record added")
          props.modalShow(false)
        }).catch(error => {
          props.modalShow(false)
          toast.error("Error")
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
        props.modalShow(false)
        document.getElementById('form').reset
        reset()
      }}
      onBackdropClick={() => props.modalShow(false)}
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
            onClick={() => props.modalShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Campaign Form
            </Typography>
            <Typography variant='body2'>Save by filling in your contact details..</Typography>
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
                  name='targetAmount'
                  control={control}
                  rules={{ required: false }}
                  defaultValue={''}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='number'
                      value={value}
                      label='Target Amount'
                      onChange={onChange}
                    />
                  )}
                />
                {errors.targetAmount && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-targetAmount'>
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
                  name='htmlContent'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <EditorWrapper>
                      <DraftEditorControlled
                        onEditorChange={(editorContent) => {
                          onChange(editorContent)
                        }}
                        defaultValue={value}
                      />
                    </EditorWrapper>
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
          <Button type='reset' variant='outlined' color='secondary' onClick={() => props.modalShow(false)}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog >
  )
}

export default CampaignFormModal
