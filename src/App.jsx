import { experimental_use as use, Suspense, useState, useEffect } from "react";

import GPS from "./gps";

const idsFetch = fetch("/ids.json").then(async (res) => ({
  status: res.status,
  data: res.status === 200 ? await res.json() : null,
}));

const cachedFetches = {};
const cachedFetch = (url) => {
  if (!cachedFetches[url]) {
    cachedFetches[url] = fetch(url).then(async (res) => ({
      status: res.status,
      data: res.status === 200 ? await res.json() : null,
    }));
  }
  return cachedFetches[url];
};

const Detail = ({ id }) => {
  const data = use(cachedFetch(`/${id}.json`));

  console.log(`Rendering Detail ${id}`);

  return <div>{JSON.stringify(data)}</div>;
};

const Names = () => {
  const ids = use(idsFetch);

  console.log(`Rendering names ${ids.data}`);

  return (
    <div>
      {ids?.data.map((id) => (
        <Detail key={id} id={id} />
      ))}
    </div>
  );
};

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      const ids = await cachedFetch("/ids.json");
      await Promise.all(ids.data.map((id) => cachedFetch(`/${id}.json`)));
      setInitialized(true);
    }
    init();
  }, []);

  return (
    <div className="App">
      {initialized && (
        <Suspense>
          <Names />
        </Suspense>
      )}
    </div>
  );
}

export default App;
