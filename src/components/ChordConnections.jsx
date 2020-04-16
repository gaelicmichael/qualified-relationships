/***
 * ChoralConnections -- All entities are outer rings on chart, relations
 *    between them are chords between them.
 * 
 * Derived from https://vx-demo.now.sh/chord
 * 
 * TODO
 *    All
 */


import React, { Fragment, useState, useContext } from 'react';

// VX
import { Group } from '@vx/group';
import { Arc } from '@vx/shape';
import { Chord, Ribbon } from '@vx/chord';
import { scaleOrdinal } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';

import { localPoint } from '@vx/event';
import { withTooltip, Tooltip } from '@vx/tooltip';

function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

const pixWidth = 600;
const pixHeight = 600;
const centerSize = 20;
const centerY = pixHeight / 2;
const centerX = pixWidth / 2;

const white = '#ffffff';
const grey = '#999999';
const black = '#000000';

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

  const outerRadius = Math.min(pixWidth, pixHeight) * 0.5 - (centerSize + 10);
  const innerRadius = outerRadius - centerSize;

// TODO -- calculate matrix of connections
  let matrix = [[]];

  function mouseOverEntity(event, group) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const labelStr = `${entity.label}: ${entity.typeLabel}, ${entity.start} - ${entity.end}`;
    showTooltip({ tooltipLeft: coords.x, tooltipTop: coords.y, tooltipData: { label: labelStr } });
  }

  function mouseOverRelation(event, chord) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    const labelStr = `${entity.label}: ${entity.typeLabel}, ${entity.start} - ${entity.end}`;
    showTooltip({ tooltipLeft: coords.x, tooltipTop: coords.y, tooltipData: { label: labelStr } });
  }

  return (
    <div className="Chords">
      <svg width={pixWidth} height={pixHeight}>
        <rect width={pixWidth} height={pixHeight} fill={grey} rx={8} />
        <Group top={centerY} left={centerX}>
          <Chord matrix={matrix} padAngle={0.05} sortSubgroups={descending}>
            {({ chords }) => {
              return (
                <g>
                  {chords.groups.map((group, i) => {
                    // const arcIndex = group.index;

                    return (
                      <Arc key={`key-${i}`} data={group} fill={color(i)}
                        innerRadius={innerRadius} outerRadius={outerRadius}
                        onMouseOver={(event) => mouseOverEntity(event, group)}
                        onMouseOut={hideTooltip}
                      />
                    );
                  })}

                  {chords.map((chord, i) => {
                    // const sourceIndex = chord.source.index;
                    // const targetIndex = chord.target.index;

                    return (
                      <Ribbon key={`ribbon-${i}`} chord={chord} fill={color(i)} radius={innerRadius}
                        onMouseOver={(event) => mouseOverRelation(event, chord)}
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
    </div>
  );
};

export default withTooltip(ChordConnections);