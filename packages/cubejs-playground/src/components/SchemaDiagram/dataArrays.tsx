import { playgroundFetch } from '../../shared/helpers';

const generateDataArrays = async () => {
  console.info('making playground call');
  const response = await playgroundFetch('/playground/schema-graph');
  const { cubes: schemaCubes } = await response.json();

  console.info('got data', schemaCubes);

  const cubes = Object.keys(schemaCubes).map((cubeName) => ({ key: cubeName }));
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
