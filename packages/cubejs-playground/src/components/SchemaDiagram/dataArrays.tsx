import { playgroundFetch } from '../../shared/helpers';
import { groups } from './groups';

const createCubes = (schemaCubes: any, groups: any) => {
  const cubeNames = Object.keys(schemaCubes);

  const createCubeNode = (name: string, group?: string) => {
    const schemaCube = schemaCubes[name];

    const temp = ['dimensions', 'measures', 'extends'].reduce(
      (acc, propertyName) => ({
        ...acc,
        ...(schemaCube[propertyName] && {
          [propertyName]: Object.keys(schemaCube[propertyName]).map(
            (value) => ({ name: value })
          ),
        }),
      }),
      {}
    );

    return {
      key: name,
      ...(group && { group }),
      ...temp,
    };
  };

  const processGroup = (
    {
      name,
      colour,
      cubes,
      groups: nestedGroups,
    }: { name: string; colour: string; cubes: any; groups: any },
    parentGroupName?: string
  ) => {
    // turn list of cube names in cubes for the data array
    const groupCubes = cubes
      .filter((cubeName: string) => cubeNames.indexOf(cubeName) >= 0)
      .map((cubeName: string) => createCubeNode(cubeName, name));

    // recuse on the list of nested groups if it exists
    const nestedCubes =
      nestedGroups &&
      nestedGroups.map((group: any) => processGroup(group, name)).flat();

    return [
      {
        key: name,
        isGroup: true,
        ...(colour && { colour }),
        ...(parentGroupName && { group: parentGroupName }),
      },
      ...groupCubes,
      ...(nestedCubes ? nestedCubes : []),
    ];
  };

  const groupedCubes = groups.map((group: any) => processGroup(group)).flat();

  // find cubes that are not in any group and create a node for them
  const freeCubes = cubeNames
    .filter(
      (cubeName) =>
        !Boolean(
          groupedCubes.find((groupedCube: any) => groupedCube.key === cubeName)
        )
    )
    .map((cubeName) => createCubeNode(cubeName));

  return groupedCubes.concat(freeCubes);
};

const generateDataArrays = async () => {
  const response = await playgroundFetch('/playground/schema-graph');
  const { cubes: schemaCubes } = await response.json();

  const cubes = createCubes(schemaCubes, groups);
  const joins = Object.keys(schemaCubes)
    .map(
      (cubeName) =>
        schemaCubes[cubeName].joins &&
        Object.keys(schemaCubes[cubeName].joins).map((joinToCubeName) => ({
          key: `${cubeName}-${joinToCubeName}`,
          from: cubeName,
          to: joinToCubeName,
          ...schemaCubes[cubeName].joins[joinToCubeName],
        }))
    )
    .flat()
    .filter((join) => Boolean(join));
  return { cubes, joins };
};

export { generateDataArrays };
