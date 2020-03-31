import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


function displayTimeVal(value) {
  return `${value}°C`;
}

function TimeSlider({ classes, timeParams }) {
  const [active, setActive] = useState(false);
  const [timeVal, setTimeVal] = useState(timeParams.default);

  function handleClick(event) {
    setActive(event.target.checked)
  }

  function changeTime(event, newTime) {
    setTimeVal(newTime)
  }

  return (
    <Grid container className={classes.root} alignItems="center">
      <Grid item xs={3}>
        <FormControlLabel
          control={
            <Switch checked={active} onChange={handleClick} name="timeSliderOn" color="primary" />
          }
          label="Limit By Time"
        />
      </Grid>
      <Grid item xs={9}>
        <Slider value={timeVal} defaultValue={timeParams.default}
            min={timeParams.start} max={timeParams.end}
            step={timeParams.step} marks valueLabelDisplay="auto" onChange={changeTime}
            getAriaValueText={displayTimeVal} aria-labelledby="discrete-slider-small-steps"
        />
      </Grid>
    </Grid>
  )
}

export default TimeSlider;