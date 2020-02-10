import React, {Fragment} from "react";
import {useRemoteData} from "./hooks";

function App() {
  const {
    loading: countriesGeoJsonLoading,
    data: countriesGeoJson,
    error: countriesGeoJsonError,
  } = useRemoteData("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json");
  const {
    loading: worldLatestDataLoading,
    data: worldLatestData,
    error: worldLatestDataError,
  } = useRemoteData("https://raw.githubusercontent.com/CryptoKass/ncov-data/master/world.latest.bno.json");

  if (countriesGeoJsonLoading || worldLatestDataLoading) return "Loading...";

  console.log({countriesGeoJson, worldLatestData});

  return (
    <Fragment>

    </Fragment>
  );
}

export default App;
