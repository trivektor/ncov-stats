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
} from "react-simple-maps";
import {min, max} from "lodash-es";
import {geoCentroid} from "d3-geo";

import {useRemoteData, useWindowDimensions} from "./hooks";

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
  const {width, height} = useWindowDimensions();

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
      <ComposableMap
        projection="geoMercator"
        width={width}
        height={height}>
        <ZoomableGroup center={[100, 40]} zoom={2}>
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

                return (
                  <Fragment>
                    {
                      geographies.map((geo) => {
                        const countryName = nameMappings[geo.properties.NAME] || geo.properties.NAME;
                        const countryIndex = countryIndicies[countryName];
                        const cases = worldLatestData.cases[countryIndex];
                        const props = {
                          key: geo.rsmKey,
                          geography: geo,
                          fill: cases ? colorScale(cases) : "#F5F4F6",
                        };

                        return <Geography {...props} />;
                      })
                    }
                    {
                      geographies.map((geo) => {
                        const countryName = nameMappings[geo.properties.NAME] || geo.properties.NAME;
                        const countryIndex = countryIndicies[countryName];
                        const cases = worldLatestData.cases[countryIndex];
                        const centroid = geoCentroid(geo);

                        return cases && (
                          <Marker key={geo.rsmKey} coordinates={centroid}>
                             <text x="-15" y="2" fontSize={8}>
                               {geo.properties.NAME} ({cases.toLocaleString()})
                             </text>
                           </Marker>
                        )
                      })
                    }
                  </Fragment>
                );
              }
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <div id="attribution">
        Data by
        {" "}
        <a
          href="https://github.com/CryptoKass/ncov-data"
          rel="noopener noreferrer"
          target="_blank">
          CryptoKass
        </a>
      </div>
    </Fragment>
  );
}

export default App;
