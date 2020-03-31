import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { TimeContext } from '../TimeConstraintsContext';

function displayTimeVal(value) {
  return `${value}°C`;
}

// INPUT: classes is object with CSS classes
//        timeParams is object with start, end, step, default
//        callback takes (active, timeVal)
function TimeSlider({ classes }) {
  const [state, dispatch] = useContext(TimeContext);

  function setActive(event) {
    dispatch({ type: 'SET_ACTIVE', payload: event.target.checked });
  }

  function setCurrent(event, newValue) {
    dispatch({ type: 'SET_CURRENT', payload: newValue });
  }

  return (
    <Grid container className={classes.root} alignItems="center">
      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Switch checked={state.active} onChange={setActive} name="timeSliderOn" color="primary" />
          }
          label="Limit By Time"
        />
      </Grid>
      <Grid item xs={9}>
        <Slider value={state.current} defaultValue={state.initial}
            min={state.start} max={state.end}
            step={state.step} marks valueLabelDisplay="auto" onChange={setCurrent}
            getAriaValueText={displayTimeVal} aria-labelledby="discrete-slider-small-steps"
        />
      </Grid>
    </Grid>
  )
}

export default TimeSlider;