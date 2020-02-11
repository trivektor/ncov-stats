import React, {Fragment} from "react";
import {scaleLinear} from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
  Marker,
  Annotation,
} from "react-simple-maps";
import {min, max} from "lodash-es";
import {geoCentroid} from "d3-geo";

import {useRemoteData} from "./hooks";

const nameMappings = {
  "United States of America": "United States",
};

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

function App() {
  const {
    loading: worldLatestDataLoading,
    data: worldLatestData,
    error: worldLatestDataError,
  } = useRemoteData("https://raw.githubusercontent.com/CryptoKass/ncov-data/master/world.latest.bno.json");

  if (worldLatestDataLoading) return "Loading...";

  const countryIndicies = Object.entries(worldLatestData.country).reduce((acc, [index, country]) => {
    acc[country] = index;
    return acc;
  }, {});

  return (
    <Fragment>
      <header>
        Corona Virus Worldwide Cases Map
      </header>
      <ComposableMap projection="geoMercator">
        <ZoomableGroup zoom={1}>
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          <Geographies geography={geoUrl}>
            {
              ({geographies}) => {
                const casesCount = Object.values(worldLatestData.cases);
                const maxCases = max(casesCount);
                const minCases = min(casesCount);
                const colorScale = scaleLinear()
                  .domain([minCases, maxCases])
                  .range(["#ffa5b7", "#ff1e4b"]);

                return geographies.map((geo) => {
                  const countryName = nameMappings[geo.properties.NAME] || geo.properties.NAME;
                  const countryIndex = countryIndicies[countryName];
                  const cases = worldLatestData.cases[countryIndex];
                  const props = {
                    key: geo.rsmKey,
                    geography: geo,
                    fill: cases ? colorScale(cases) : "#F5F4F6",
                  };
                  const centroid = geoCentroid(geo);

                  return (
                    <Fragment>
                      <Geography {...props} />
                      {
                        cases && (
                          <Marker coordinates={centroid}>
                             <text y="2" fontSize={7} textAnchor="middle">
                               {geo.properties.NAME}
                             </text>
                           </Marker>
                        )
                      }
                    </Fragment>
                  );
                });
              }
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </Fragment>
  );
}

export default App;
