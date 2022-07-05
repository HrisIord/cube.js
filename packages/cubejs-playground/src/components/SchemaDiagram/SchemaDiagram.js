import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

export const cubes = [
  { key: 'Project' },
  { key: 'Task' },
  { key: 'LibraryTask' },
];

export const joins = [
  {
    key: '1',
    from: 'Project',
    to: 'Task',
    relationship: `hasMany`,
    sql: '${CUBE}.id = ${Task}.project_id',
  },
  {
    key: '2',
    from: 'Task',
    to: 'LibraryTask',
    relationship: `belongsTo`,
    sql: '${CUBE}.standard_id = ${LibraryTask}.id and ${SECURITY_CONTEXT.org.filter(`${LibraryTask}.organization_id`)}',
  },
];

const SchemaDiagram = () => {
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
      }),
      $(
        go.TextBlock,
        {
          margin: 3,
          stroke: '#333333',
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

  return (
    <ReactDiagram
      initDiagram={initDiagram}
      style={{
        width: 1200,
        height: 800,
        border: 'solid 1px black',
        backgroundColor: 'white',
      }}
    />
  );
};

export default SchemaDiagram;
