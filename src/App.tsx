import { lazy, Suspense, useEffect, useMemo } from 'react';

const cache: { [key: string]: any } = {};

const getData = (key: string) => {
  console.log('getData');
  if (cache[key]) {
    return cache[key];
  }

  throw new Promise((resolve) =>
    setTimeout(() => resolve(Math.random().toFixed(8).slice(2)), 100)
  ).then((data) => {
    cache[key] = data;
  });
};

export default () => {
  const data = getData('foo');

  const Component = useMemo(
    () =>
      lazy(async () => {
        console.time('dynamic-import');
        const m = await import('./DynamicImported');
        console.timeEnd('dynamic-import');
        return m;
      }),
    []
  );

  useEffect(() => {
    console.log('mounted');
    return () => console.log('unmount');
  }, []);

  return (
    <Suspense>
      <h1>Foo</h1>
      {data}
      <Component />
    </Suspense>
  );
};
