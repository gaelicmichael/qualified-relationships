/***
 * EgoTimeRadar -- User chooses an entity, all relationships with that entity
 *    are displayed over time.
 * 
 * TODO
 *    Select type of entity shown on button list
 *    Create Context with reducers to simplify filtering ?
 */

import React, { Fragment, useState, useContext } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';

// VX
import { localPoint } from '@vx/event';
import { scaleLinear } from '@vx/scale';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { withTooltip, Tooltip } from '@vx/tooltip';

// App-specific components
import TimeSlider from './TimeSlider'
import { TimeContext } from '../TimeConstraintsContext';
import { SelectEntityType } from './SelectEntityType';

const buttonWidth = 200;  // Pixel width of button column (with entity names)

const pixWidth = 600;
const pixHeight = 600;
const centerY = pixHeight / 2;
const centerX = pixWidth / 2;

const startRadius = 10;   // pixel start of circles (min-time)
const endRadius = ((pixWidth / 2) - 10);  // pixel end of circles (max-time)

// const white = '#ffffff';
const grey = '#999999';
const black = '#000000';

const useStyles = makeStyles((theme) => ({
  selectedName: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '32ch',
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

  // Get list of entity types
  const entityTypes = qrManager.getEntityTypes();

  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedEntityName, setSelectedEntityName] = useState('');

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

  if (selectedEntityType === null) {
    setSelectedEntityType(entityTypes[0].label);
  }

  let timeScale;
  let relations = [];

  // Translate time values to pixels
  const outerRadiusAccessor = p => timeScale(p.data.end);
  const innerRadiusAccessor = p => timeScale(p.data.start);

  // If an entity has been selected, what is its time range? Use that to create time rings.
  // Compile relationship data!
  if (selectedEntity !== null) {
    let { start, end } = selectedEntity;
    timeScale = scaleLinear({ domain: [start, end], range: [startRadius, endRadius] });
    relations = qrManager.getEntityRelations(selectedEntity, true);
  }

  function mouseOverRelation(event, datum) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const labelStr = `${datum.type}: ${datum.start} - ${datum.end}, ${datum.entity1} (${datum.role1}) and ${datum.entity2} (${datum.role2})`;
    showTooltip({ tooltipLeft: coords.x, tooltipTop: coords.y, tooltipData: { label: labelStr } });
  }

  function clickEntityBtn(entity) {
    setSelectedEntity(entity);
    setSelectedEntityName(entity.label);
  }

  function selectNewEntityType(event) {
    setSelectedEntityType(event.target.value);
  }

  return (
    <Fragment>
      <TimeSlider classes={inheritClasses} />

      <div>
        <SelectEntityType types={entityTypes} selected={selectedEntityType} onChange={selectNewEntityType} />
        <TextField className={radarClasses.selectedName} label="Selected"
          margin="dense" variant="outlined"
          value={ selectedEntityName }
        />
      </div>

      <div className={radarClasses.outerWrapper}>
        <div className={radarClasses.buttonColumn}>
          <ButtonGroup orientation="vertical" color="primary" aria-label="vertical contained primary button group small"
            variant="contained"
          >
            { visibleEntities.map(function(e) {
              if (e.type === selectedEntityType) {
                return (
                  <Button className={radarClasses.button} key={e.id}
                      variant={selectedEntity === e ? "outlined" : ""}
                      onClick={() => clickEntityBtn(e)}
                  >
                    { e.label }
                  </Button>
                )
              }
              return null;
            })}
          </ButtonGroup>
        </div>
        <main className={radarClasses.graph}>
          <svg width={pixWidth} height={pixHeight}>
            <rect rx={10} width={pixWidth} height={pixHeight} fill={grey} />
            <Group top={centerY} left={centerX}>
              <Pie data={relations} pieValue={10} cornerRadius={4} padAngle={0.01}
                outerRadius={outerRadiusAccessor} innerRadius={innerRadiusAccessor}
              >
                {pie => {
                  return pie.arcs.map((arc, i) => {
                    return (
                      <g key={`seg-${arc.data.label}-${i}`}>
                        <path d={pie.path(arc)} fill={arc.data.typeColor} fillOpacity={1}
                          stroke={black} strokeWidth="1"
                          onMouseOver={(event) => mouseOverRelation(event, arc.data)}
                          onMouseOut={hideTooltip}
                        />
                      </g>
                    );
                  });
                }}
              </Pie>
              {timeScale && timeScale.ticks().map((tick, i) => {
                const r = timeScale(tick);
                return (
                  <g key={`time-ring-${i}`}>
                    <circle r={r} stroke={black} strokeWidth="2" fill="none" fillOpacity={0.8} strokeOpacity={0.2} />
                    <text y={-r} dy={'-.33em'} fontSize={8} fill={black} fillOpacity={0.8} textAnchor="middle">
                      {tick}
                    </text>
                  </g>
                );
              })}
            </Group>
          </svg>
        </main>
      </div>

      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft}>
          <div className={radarClasses.tooltip}>
            { tooltipData.label }
          </div>
        </Tooltip>
      )}
    </Fragment>
  )
}

export default withTooltip(EgoTimeRadar);
