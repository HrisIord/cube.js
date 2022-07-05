import React, { useState, useEffect } from 'react';

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

import { generateDataArrays } from './dataArrays';

const colours = {
  darkplum: 'rgb(20,20,70)',
  mutedplum: 'rgb(67,67,107)',
  periwinkle: 'rgb(176, 174, 255)',
  lightlilac: 'rgb(243,240,255)',
  lightlavender: 'rgb(222,222,241)',
  lightpink: 'rgb(252, 168, 193)',
};

go.GraphObject.defineBuilder('ToolTip', function (args) {
  var ad = go.GraphObject.make(
    go.Adornment,
    'Auto',
    {
      isShadowed: true,
      shadowColor: 'rgba(0, 0, 0, .4)',
      shadowOffset: new go.Point(0, 3),
      shadowBlur: 5,
    },
    go.GraphObject.make(go.Shape, {
      name: 'Border',
      figure: 'RoundedRectangle',
      parameter1: 1,
      parameter2: 1,
      fill: colours.periwinkle,
      stroke: colours.periwinkle,
      spot1: new go.Spot(0, 0, 4, 6),
      spot2: new go.Spot(1, 1, -4, -4),
    })
  );
  return ad;
});

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

    const detailSectionTemplate = (title, bindingId, row) =>
      $(
        go.Panel,
        'Table',
        {
          name: `${bindingId}Section`,
          row,
          padding: 5,
          visible: false,
          stretch: go.GraphObject.Horizontal,
        },
        new go.Binding('visible', bindingId, (arr) => arr.length > 0),

        $(go.TextBlock, title, {
          row: 0,
          column: 0,
          alignment: go.Spot.Center,
          font: 'italic bold 10pt sans-serif',
          stroke: colours.mutedplum,
          stretch: go.GraphObject.Horizontal,
        }),

        $('PanelExpanderButton', bindingId.toUpperCase(), {
          row: 0,
          column: 1,
          alignment: go.Spot.TopRight,
        }),
        $(
          go.Panel,
          'Vertical',
          {
            name: bindingId.toUpperCase(),
            row: 1,
            column: 0,
            columnSpan: 2,
            margin: 3,
            stretch: go.GraphObject.Fill,
            defaultAlignment: go.Spot.Left,
            visible: false,
          },
          new go.Binding('itemArray', bindingId),
          {
            itemTemplate: $(
              go.Panel,
              'Auto',
              $(
                go.TextBlock,
                { stroke: colours.mutedplum },
                new go.Binding('text', 'name')
              )
            ),
          }
        )
      );

    diagram.nodeTemplate = $(
      go.Node,
      'Auto', // the whole node panel
      new go.Binding('location', 'location').makeTwoWay(),
      $(go.Shape, 'RoundedRectangle', {
        fill: colours.lightlilac,
        stroke: colours.lightlavender,
        strokeWidth: 3,
      }),

      $(
        go.Panel,
        'Table',
        { margin: 8, stretch: go.GraphObject.Fill },

        $(
          go.TextBlock,
          {
            row: 0,
            alignment: go.Spot.TopCenter,
            margin: new go.Margin(0, 24, 0, 2), // leave room for Button
            font: 'bold 16px sans-serif',
            stroke: colours.darkplum,
          },
          new go.Binding('text', 'key')
        ),

        // the collapse/expand button
        $('PanelExpanderButton', 'METADATA', {
          row: 0,
          alignment: go.Spot.TopRight,
        }),

        // the table header
        $(
          go.Panel,
          'Table',
          {
            name: 'METADATA',
            row: 1,
            visible: false,
          },

          // Dimensions Tab
          detailSectionTemplate('Dimensions', 'dimensions', 0),
          detailSectionTemplate('Measures', 'measures', 1),
          detailSectionTemplate('Extends', 'extends', 2)
        )
      ) // end Table Panel
    );

    const linkToolTipTemplate = $(
      go.Panel,
      'Horizontal',
      $(go.TextBlock, 'Relationship:', {
        margin: 3,
        stroke: colours.darkplum,
        font: 'bold 14px sans-serif',
      }),
      $(
        go.TextBlock,
        {
          margin: 3,
          stroke: colours.darkplum,
          font: 'bold 14px sans-serif',
        },
        new go.Binding('text', 'relationship')
      )
    );

    diagram.linkTemplate = $(
      go.Link, // the whole link panel
      {
        // routing: go.Link.AvoidsNodes,
        layerName: 'Foreground',
        corner: 5,
        curve: go.Link.JumpOver,
      },
      $(go.Shape, { stroke: colours.darkplum, strokeWidth: 2 }), // the link shape
      $(
        go.Shape, // the arrowhead
        {
          toArrow: 'Boomerang',
          stroke: colours.darkplum,
          fill: colours.darkplum,
          scale: 1,
        }
      ),
      {
        toolTip: $('ToolTip', linkToolTipTemplate),
      }
    );

    diagram.groupTemplate = $(
      go.Group,
      'Auto',
      $(
        go.Shape,
        'Rectangle',
        {
          fill: 'rgba(128,128,128,0.33)',
        },
        new go.Binding('fill', 'colour'),
        new go.Binding('stroke', 'colour')
      ),
      $(
        go.Panel,
        'Table',
        { margin: 1 }, // avoid overlapping border with table contents
        $(go.RowColumnDefinition, { row: 0, background: 'white' }), // header is white
        $('SubGraphExpanderButton', { row: 0, column: 0, margin: 3 }),
        $(
          go.TextBlock, // title is centered in header
          {
            row: 0,
            column: 1,
            font: 'bold 14px sans-serif',
            textAlign: 'center',
            stretch: go.GraphObject.Horizontal,
            margin: 5,
          },
          new go.Binding('text', 'key')
        ),
        $(
          go.Placeholder, // becomes zero-sized when Group.isSubGraphExpanded is false
          { row: 1, columnSpan: 2, padding: 10, alignment: go.Spot.TopLeft },
          new go.Binding('padding', 'isSubGraphExpanded', function (exp) {
            return exp ? 10 : 0;
          }).ofObject()
        )
      )
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
