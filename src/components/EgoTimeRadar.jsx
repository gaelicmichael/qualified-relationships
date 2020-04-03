// TODO
//    Create Relationship type filter
//    Use actual data for times, colors, etc
//    Overlay of time rings with labels

import React, { Fragment, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Material-UI
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

// VX
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';


// App-specific components
import TimeSlider from './TimeSlider'
import { TimeContext } from '../TimeConstraintsContext';

const pixWidth = 600;
const pixHeight = 600;

const buttonWidth = 200;


const white = '#ffffff';
const grey = '#777777';
const black = '#000000';

const useStyles = makeStyles((theme) => ({
  outerWrapper: {
    display: 'flex',
    padding: theme.spacing(0),
    '& > *': {
      margin: theme.spacing(0),
    },
  },
  buttonColumn: {
    width: buttonWidth,
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
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
    margin: theme.spacing(1),
  },
  tooltip: {
    backgroundColor: 'black',
    color: 'lightblue',
    padding: 6,
    fontSize: 12,
    boxShadow: '0 4px 8px 0 rgba(25, 29, 34, 0.1)',
    pointerEvents: 'none',
    borderRadius: 3,
    border: '2px solid rgba(25, 29, 34, 0.12)',
  },
}));

const dummyData = [
  { label: 'A', value: 100, inner:  20, outer: 60 },
  { label: 'B', value:  25, inner: 100, outer: 200 },
  { label: 'C', value:  75, inner:  50, outer: 190 },
  { label: 'D', value:  30, inner: 110, outer: 160 }
];

const valueAccessor = d => d.value;
const outerRadiusAccessor = p => p.data.outer;
const innerRadiusAccessor = p => p.data.inner;

function EgoTimeRadar(props) {
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

  const radarClasses = useStyles();
  const [state] = useContext(TimeContext);

  const [selectedID, setSelectedID] = useState(null);
  const visibleEntities = qrManager.getEntities(state.active, state.current);

  // As Time Slider may have made last selection invisible, check that it is still available
  if (selectedID !== null && state.active) {
    let appears = false;
    for (let i=0; i<visibleEntities.length; i++) {
      let thisEntity = visibleEntities[i];
      if (thisEntity.id === selectedID) {
        appears = true;
        break;
      }
    }
    if (!appears) {
      setSelectedID(null);
    }
  }

  // const radius = Math.min(pixWidth, pixHeight) / 2;
  const centerY = pixHeight / 2;
  const centerX = pixWidth / 2;


  function mouseOverRelation(event, datum) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({ tooltipLeft: coords.x, tooltipTop: coords.y, tooltipData: { label: datum.label } });
  }

  function clickEntityBtn(entity) {
    setSelectedID(entity.id);
  }

  return (
    <Fragment>
      <TimeSlider classes={inheritClasses} />

      <div className={radarClasses.outerWrapper}>
        <ButtonGroup orientation="vertical" color="primary" aria-label="vertical contained primary button group small"
          variant="contained" className={radarClasses.buttonColumn}>
            { visibleEntities.map((e) => (
              <Button className={radarClasses.button} key={e.id}
                  variant={selectedID === e.id ? "outlined" : ""}
                  onClick={() => clickEntityBtn(e)}
              >
                { e.label }
              </Button>
            ))};
        </ButtonGroup>
        <main className={radarClasses.content}>
          <svg width={pixWidth} height={pixHeight}>
            <rect rx={10} width={pixWidth} height={pixHeight} fill={grey} />
            <Group top={centerY} left={centerX}>
              <Pie data={dummyData} pieValue={valueAccessor} cornerRadius={4} padAngle={0.01}
                outerRadius={outerRadiusAccessor} innerRadius={innerRadiusAccessor}
              >
                {pie => {
                  return pie.arcs.map((arc, i) => {
                    return (
                      <g key={`seg-${arc.data.label}-${i}`}>
                        <path d={pie.path(arc)} fill={white} fillOpacity={1}
                          onMouseOver={(event) => mouseOverRelation(event, arc.data)}
                          onMouseOut={hideTooltip}
                        />
                      </g>
                    );
                  });
                }}
              </Pie>
            </Group>
          </svg>
        </main>
      </div>

      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft}>
          <div className={radarClasses.tooltip}>
            { 'The label is ' + tooltipData.label }
          </div>
        </Tooltip>
      )}
    </Fragment>
  )
}

export default withTooltip(EgoTimeRadar);
