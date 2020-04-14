/***
 * EgoRings -- User selects the entity from a list; that entity
 *      is put at center of graph, each connected entity on a ring
 *      moving outwards. User can select number of rings displayed.
 * 
 * This was initially derived from https://vx-demo.now.sh/linkTypes
 *
 * TODO
 *    Create Context with reducers to simplify interaction
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

// D3
import { hierarchy } from 'd3-hierarchy';
import { pointRadial } from 'd3-shape';

// VX
import { localPoint } from '@vx/event';
import { Tree } from '@vx/hierarchy';
import { Group } from '@vx/group';
import { LinkRadial } from '@vx/shape';
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
const stepPercent = 0.5;

const white = '#ffffff';
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
  const [numRings, setNumRings] = useState(2);

  // Get list of entities qualified by time parameters
  const visibleEntities = qrManager.getEntities(state.active, state.current);

  let tree;

  if (selectedEntity !== null) {
    let prepTree = true;

    // As Time Slider may have made last selection invisible, check that it is still available
    if (state.active) {
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
        prepTree = false;
      }
    }
    // If an entity has been selected and is valid, create hierarchical tree centered on it
    if (prepTree) {
      let eh = qrManager.getEntityHierarchy(selectedEntity, numRings, state.active, state.current);
      tree = hierarchy(eh);
    }
  }

  function mouseOverEntity(event, entity) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const labelStr = `${entity.label}: ${entity.typeLabel}, ${entity.start} - ${entity.end}`;
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
          <MenuItem value={1}>Two</MenuItem>
          <MenuItem value={2}>Three</MenuItem>
          <MenuItem value={3}>Four</MenuItem>
          <MenuItem value={4}>Five</MenuItem>
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
              ))}
          </ButtonGroup>
        </div>
        <main className={ringClasses.graph}>
          <svg width={pixWidth} height={pixHeight}>
            <rect rx={10} width={pixWidth} height={pixHeight} fill={grey} />
            { (selectedEntity !== null && tree !== null) && (
              <Tree root={tree} size={[2 * Math.PI, endRadius-startRadius]}
                separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
              >
                {data => (
                  <Group top={centerY} left={centerX}>
                    {data.links().map((link, i) =>
                      <LinkRadial data={link} percent={+stepPercent}
                        stroke={black} strokeWidth="1" fill="none" key={i}
                      />
                     )}
                    {data.descendants().map((node, key) => {
                      const width = 30, height = 20;
                      const [radialX, radialY] = pointRadial(node.x, node.y);
                      const fullEntity = qrManager.expandEntity(node.data.entity);
                      const strokeDash = !node.data.children ? '0' : '2,2';
                      const rounding = !node.data.children ? 5 : 0;

                      return (
                        <Group top={radialY} left={radialX} key={key}>
                          {node.depth === 0 && (
                            <circle r={12} fill={fullEntity.typeColor}
                              stroke={white} strokeWidth={1} strokeDasharray={strokeDash}
                              onMouseOver={(event) => mouseOverEntity(event, fullEntity)}
                              onMouseOut={hideTooltip}    
                            />
                            )}
                          {node.depth !== 0 && (
                            <rect height={height} width={width} y={-height / 2} x={-width / 2}
                              fill={fullEntity.typeColor} rx={rounding}
                              stroke={white} strokeWidth={1} strokeDasharray={strokeDash}
                              onMouseOver={(event) => mouseOverEntity(event, fullEntity)}
                              onMouseOut={hideTooltip}    
                            />
                          )}
                        </Group>
                      )
                    })}
                  </Group>
                )}
              </Tree>
            )}
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
