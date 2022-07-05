import React, { useState, useEffect } from 'react';

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

import { generateDataArrays } from './dataArrays';

const SchemaDiagram = () => {
  const [cubes, setCubes] = useState<any>(null);
  const [joins, setJoins] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { cubes, joins } = await generateDataArrays();
      setCubes(cubes);
      setJoins(joins);
    })();
  }, []);

  const initDiagram = () => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      allowDelete: false,
      allowCopy: false,
      layout: $(go.ForceDirectedLayout),
      'undoManager.isEnabled': true,
    });

    diagram.toolManager.holdDelay = 0;

    diagram.nodeTemplate = $(
      go.Node,
      'Auto', // the whole node panel
      new go.Binding('location', 'location').makeTwoWay(),
      $(go.Shape, 'RoundedRectangle', {
        fill: 'white',
        stroke: '#eeeeee',
        strokeWidth: 3,
      }),
      $(
        go.TextBlock,
        {
          row: 0,
          alignment: go.Spot.Center,
          margin: 10,
          font: 'bold 16px sans-serif',
        },
        new go.Binding('text', 'key')
      )
    );

    const linkToolTipTemplate = $(
      go.Panel,
      'Horizontal',
      $(go.TextBlock, 'Relationship:', {
        margin: 3,
        stroke: '#333333',
        font: 'bold 14px sans-serif',
      }),
      $(
        go.TextBlock,
        {
          margin: 3,
          stroke: '#333333',
          font: 'bold 14px sans-serif',
        },
        new go.Binding('text', 'relationship')
      )
    );

    diagram.linkTemplate = $(
      go.Link, // the whole link panel
      {
        layerName: 'Foreground',
        corner: 5,
        curve: go.Link.JumpOver,
      },
      $(go.Shape), // the link shape
      $(
        go.Shape, // the arrowhead
        { toArrow: 'OpenTriangle', fill: null }
      ),
      {
        toolTip: $('ToolTip', linkToolTipTemplate),
      }
    );

    diagram.model = new go.GraphLinksModel({
      copiesArrays: true,
      copiesArrayObjects: true,
      nodeDataArray: cubes,
      linkDataArray: joins,
    });

    return diagram;
  };

  return cubes && joins ? (
    <ReactDiagram
      initDiagram={initDiagram}
      divClassName=""
      style={{
        width: 1200,
        height: 800,
        border: 'solid 1px black',
        backgroundColor: 'white',
      }}
      nodeDataArray={cubes}
    />
  ) : (
    <div>Loading...</div>
  );
};

export default SchemaDiagram;
