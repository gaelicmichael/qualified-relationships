/***
 * ChoralConnections -- All entities are outer rings on chart, relations
 *    between them are chords between them.
 * 
 * Derived from https://vx-demo.now.sh/chord
 *  using D3 chord package https://github.com/d3/d3-chord/tree/v1.0.6 
 * 
 * TODO
 */


import React, { Fragment, useContext } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';

// VX
import { Group } from '@vx/group';
import { Arc } from '@vx/shape';
import { Chord, Ribbon } from '@vx/chord';
import { localPoint } from '@vx/event';
import { withTooltip, Tooltip } from '@vx/tooltip';

// App-specific components
import TimeSlider from './TimeSlider'
import { TimeContext } from '../TimeConstraintsContext';

function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

const pixWidth = 600;
const pixHeight = 600;
const centerSize = 20;
const centerY = pixHeight / 2;
const centerX = pixWidth / 2;

// const white = '#ffffff';
const grey = '#999999';
const black = '#000000';

const useStyles = makeStyles((theme) => ({
  outerWrapper: {
    display: 'flex',
    padding: theme.spacing(0),
    '& > *': {
      margin: theme.spacing(0),
    },
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

function ChordConnections (props) {
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

  const chordClasses = useStyles();
  const [state] = useContext(TimeContext);

  const outerRadius = Math.min(pixWidth, pixHeight) * 0.5 - (centerSize + 10);
  const innerRadius = outerRadius - centerSize;

  let { matrix, linkIndices, entities, relations } = qrManager.getMatrix(state.active, state.current);

  function mouseOverEntity(event, expandedEntity) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const labelStr = `${expandedEntity.label}: ${expandedEntity.typeLabel}, ${expandedEntity.start} - ${expandedEntity.end}`;
    showTooltip({ tooltipLeft: coords.x, tooltipTop: coords.y, tooltipData: { label: labelStr } });
  }

  function mouseOverRelation(event, expandedRelation, sourceIndex, targetIndex) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const fromEntity = entities[sourceIndex];
    const toEntity = entities[targetIndex];
    const labelStr = `${expandedRelation.typeLabel} from ${fromEntity.label} (as ${expandedRelation.role1}) `+
            `to ${toEntity.label} (as ${expandedRelation.role2}) ${expandedRelation.start} - ${expandedRelation.end}`;
    showTooltip({ tooltipLeft: coords.x, tooltipTop: coords.y, tooltipData: { label: labelStr } });
  }

  return (
    <Fragment>
      <TimeSlider classes={inheritClasses} />

      <div className={chordClasses.outerWrapper}>
        <main className={chordClasses.graph}>
          <svg width={pixWidth} height={pixHeight}>
            <rect width={pixWidth} height={pixHeight} fill={grey} rx={8} />
            <Group top={centerY} left={centerX}>
              <Chord matrix={matrix} padAngle={0.05} sortSubgroups={descending}>
                {({ chords }) => {
                  return (
                    <g>
                      {chords.groups.map((group, i) => {
                        const expandedEntity = qrManager.expandEntity(entities[group.index]);

                        return (
                          <Arc key={`key-${i}`} data={group} fill={expandedEntity.typeColor}
                            innerRadius={innerRadius} outerRadius={outerRadius}
                            strokeWidth={1} stroke={black}
                            onMouseOver={(event) => mouseOverEntity(event, expandedEntity)}
                            onMouseOut={hideTooltip}
                          />
                        );
                      })}

                      {chords.map((chord, i) => {
                        const sourceIndex = chord.source.index;
                        const targetIndex = chord.target.index;
                        const linkIndex = linkIndices[sourceIndex][targetIndex];
                        const expandedRelation = qrManager.expandRelation(relations[linkIndex]);

                        return (
                          <Ribbon key={`ribbon-${i}`} chord={chord} fill={expandedRelation.typeColor} radius={innerRadius}
                            strokeWidth={1} stroke={black}
                            onMouseOver={(event) => mouseOverRelation(event, expandedRelation, sourceIndex, targetIndex)}
                            onMouseOut={hideTooltip}
                          />
                        );
                      })}
                    </g>
                  );
                }}
              </Chord>
            </Group>
          </svg>
        </main>
      </div>

      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft}>
          <div className={chordClasses.tooltip}>
            { tooltipData.label }
          </div>
        </Tooltip>
      )}
    </Fragment>
  );
};

export default withTooltip(ChordConnections);