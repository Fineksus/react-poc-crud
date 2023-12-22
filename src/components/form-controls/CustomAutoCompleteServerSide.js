import { CircularProgress, IconButton, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { Fragment, useState } from "react"
import toast from "react-hot-toast";
import CustomAutocomplete from "src/@core/components/mui/autocomplete";
import auth from "src/configs/auth";


const CustomAutoCompleteServerSide = ({ name, label, optionLabelPropertyName, endPoint, defaultValue, onDropDownSelected }) => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleTextChange = async (event) => {
    const term = event.target.value
    if (term.length > 1) {
      setLoading(true)
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(1000)
      axios.get(`${endPoint}/${term}`,
        {
          headers: {
            Authorization: `${localStorage.getItem(auth.storageTokenKeyName)}`
          }
        }).then(response => {
          setLoading(false);
          setOptions(response.data.data)
        }).catch(error => {
          setLoading(false);
          toast.error(error.response.data.message)
        })
    }
  }

  return (
    <Fragment>
      <CustomAutocomplete
        autoHighlight
        id={`autocomplete-${name}`}
        options={options}
        getOptionLabel={option => option[optionLabelPropertyName] || ''}
        removeButton={false}

        onChange={(event, newValue) => {
          onDropDownSelected(newValue ? newValue.id : '');
        }}

        //Option With Image
        //renderOption={(props, option) => (
        //  <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
        //    <img
        //      alt=''
        //      width='20'
        //      loading='lazy'
        //
        //      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
        //      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
        //    />
        //    {option.name}
        //  </Box>
        //)}
        //onChange={(event, newValue) => {
        //  onChange(newValue ? newValue.id : '');
        //}}

        //value={options.find(option => option.id === value) || null}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            value={defaultValue}
            onChange={(event) => handleTextChange(event)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading && <CircularProgress color="primary" size={20} />}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
      />
    </Fragment>
  )
}

export default CustomAutoCompleteServerSide
