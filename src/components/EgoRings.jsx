/***
 * EgoRings -- User selects the entity from a list; that entity
 *      is put at center of graph, each connected entity on a ring
 *      moving outwards. User can select number of rings displayed.
 * 
 * TODO
 *    All
 */


import React, { Fragment, useState, useContext } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// VX
import { localPoint } from '@vx/event';
import { scaleLinear } from '@vx/scale';
// import { Tree } from '@vx/hierarchy';
// import { Group } from '@vx/group';
import { withTooltip, Tooltip } from '@vx/tooltip';

// App-specific components
import TimeSlider from './TimeSlider'
import { TimeContext } from '../TimeConstraintsContext';

const buttonWidth = 200;  // Pixel width of button column (with entity names)

const pixWidth = 600;
const pixHeight = 600;
const centerY = pixHeight / 2;
const centerX = pixWidth / 2;

const startRadius = 20;   // pixel start of circles (1st ring)
const endRadius = ((pixWidth / 2) - 20);  // pixel end of circles (last ring)

// const white = '#ffffff';
const grey = '#999999';
const black = '#000000';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  outerWrapper: {
    display: 'flex',
    padding: theme.spacing(0),
    '& > *': {
      margin: theme.spacing(0),
    },
  },
  buttonColumn: {
    width: buttonWidth,
    maxHeight: `${pixHeight}px`,
    overflowY: 'scroll',
    fontSize: '10px',
    flexShrink: 0,
    margin: theme.spacing(0),
  },
  buttonPaper: {
    width: buttonWidth,
  },
  button: {
    fontSize: '10px',
    padding: theme.spacing(1),
  },
  graph: {
    flexGrow: 1,
    padding: theme.spacing(0),
    margin: theme.spacing(0),
  },
  tooltip: {
    backgroundColor: 'black',
    color: 'lightblue',
    padding: 6,
    fontSize: 12,
    boxShadow: '0 4px 8px 0 rgba(25, 29, 34, 0.1)',
    pointerEvents: 'none',
    maxWidth: '250px',
    borderRadius: 3,
    border: '2px solid rgba(25, 29, 34, 0.12)',
  },
}));

function EgoRings(props) {
  const {
    inheritClasses,
    qrManager,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    hideTooltip,
    showTooltip,
  } = props;

  const ringClasses = useStyles();
  const [state] = useContext(TimeContext);

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [numRings, setNumRings] = useState(3);

  // Get list of entities qualified by time parameters
  const visibleEntities = qrManager.getEntities(state.active, state.current);

  // As Time Slider may have made last selection invisible, check that it is still available
  if (selectedEntity && state.active) {
    let appears = false;
    for (let i=0; i<visibleEntities.length; i++) {
      let thisEntity = visibleEntities[i];
      if (thisEntity === selectedEntity) {
        appears = true;
        break;
      }
    }
    if (!appears) {
      setSelectedEntity(null);
    }
  }

  let ringScale;
  let relations = [];

  // Translate time values to pixels
  const radiusAccessor = p => ringScale(p.data.pos);

  // If an entity has been selected, create hierarchical tree centered on it
  if (selectedEntity !== null) {
    ringScale = scaleLinear({ domain: [1, numRings], range: [startRadius, endRadius] });
    let tree = qrManager.getEntityHierarchy(selectedEntity, numRings, state.active, state.current);
    console.log("Node hierarchy ", tree);
  }

  function mouseOverRelation(event, datum) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const labelStr = `${datum.type}: ${datum.start} - ${datum.end}, ${datum.entity1} (${datum.role1}) and ${datum.entity2} (${datum.role2})`;
    showTooltip({ tooltipLeft: coords.x, tooltipTop: coords.y, tooltipData: { label: labelStr } });
  }

  function clickEntityBtn(entity) {
    setSelectedEntity(entity);
  }

  function selectNumRings(event) {
    setNumRings(event.target.value);
  }

  return (
    <Fragment>
      <TimeSlider classes={inheritClasses} />

      <FormControl className={ringClasses.formControl}>
        <InputLabel id="select-num-rings-label">Degrees of Separation</InputLabel>
        <Select labelId="select-num-rings-label" id="select-num-rings" value={numRings} onChange={selectNumRings}>
          <MenuItem value={1}>One</MenuItem>
          <MenuItem value={2}>Two</MenuItem>
          <MenuItem value={3}>Three</MenuItem>
          <MenuItem value={4}>Four</MenuItem>
          <MenuItem value={5}>Five</MenuItem>
        </Select>
      </FormControl>
  
      <div className={ringClasses.outerWrapper}>
        <div className={ringClasses.buttonColumn}>
          <ButtonGroup orientation="vertical" color="primary" aria-label="vertical contained primary button group small"
            variant="contained" >
              { visibleEntities.map((e) => (
                <Button className={ringClasses.button} key={e.id}
                    variant={selectedEntity === e ? "outlined" : ""}
                    onClick={() => clickEntityBtn(e)}
                >
                  { e.label }
                </Button>
              ))};
          </ButtonGroup>
        </div>
        <main className={ringClasses.graph}>
          <svg width={pixWidth} height={pixHeight}>
            <rect rx={10} width={pixWidth} height={pixHeight} fill={grey} />
          </svg>
        </main>
      </div>

      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft}>
          <div className={ringClasses.tooltip}>
            { tooltipData.label }
          </div>
        </Tooltip>
      )}
    </Fragment>
  )
}

export default withTooltip(EgoRings);
