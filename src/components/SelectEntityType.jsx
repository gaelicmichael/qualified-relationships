/***
 **
 **/


import React from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
}));

export function SelectEntityType({ types, selected, onChange }) {
  const selectClasses = useStyles();

  return (
    <FormControl className={selectClasses.formControl}>
      <InputLabel id="select-entity-type-label">Show Entities Of Type</InputLabel>
      <Select labelId="select-entity-type-label" id="select-entity-type" value={selected} onChange={onChange}>
        { types.map(typeDef =>
          <MenuItem key={typeDef.key} value={typeDef.key}>{typeDef.label}</MenuItem>
        )}
      </Select>
    </FormControl>
  )
}
