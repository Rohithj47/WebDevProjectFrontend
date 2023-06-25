import React from "react";
import Header from "components/headers/light.js";
import BrewerySearch from "components/cards/BrewerySearch";

export default () => {

  return (
    <>
      <Header />
      <BrewerySearch
        heading={
          <>
            Search Breweries
          </>
        }
      />
    </>
  );
};
