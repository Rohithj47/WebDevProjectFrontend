import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";

import { breweryImages } from "helpers/imageSources";

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw(SectionHeading)`text-black font-thin uppercase underline`;
const CardContainer = tw.div``;

const Card = tw(
  motion.a
)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;

const CardImageContainer = styled.div`
  ${(props) =>
    css`
      background-image: url("${props.imageSrc}");
    `}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;
const CardRatingContainer = tw.div`leading-none absolute inline-flex bg-gray-100 bottom-0 left-0 ml-4 mb-4 rounded-full px-5 py-2 items-end`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;

export default ({ heading = "Checkout the Menu" }) => {
  const [microBreweries, setMicroBreweries] = useState([]);
  const [brewPubs, setBrewpubs] = useState([]);
  const [largeBreweries, setLargeBreweries] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [closed, setUpClosed] = useState([]);


  const fetchBreweriesByType = useCallback(() => {
    let endpoint = "?by_type=micro&per_page=3";
    // 1- Micro
    fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        data.forEach((element) => {
          element.image =
            breweryImages[Math.floor(Math.random() * breweryImages.length)];
          setMicroBreweries((microBreweries) => [...microBreweries, element]);
        });
      } else {
        alert("Could not fetch Breweries");
      }
    });

    // // 2 - BrewPubs
    // endpoint = "?by_type=brewpub&per_page=3";
    // fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }).then(async (response) => {
    //   if (response.ok) {
    //     const data = await response.json();
    //     data.forEach((element) => {
    //       element.image =
    //         breweryImages[Math.floor(Math.random() * breweryImages.length)];
    //       setBrewpubs((brewPubs) => [...brewPubs, element]);
    //     });
    //   } else {
    //     alert("Could not fetch Breweries");
    //   }
    // });

    // 3 - Large
    endpoint = "?by_type=large&per_page=3";
    fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        data.forEach((element) => {
          element.image =
            breweryImages[Math.floor(Math.random() * breweryImages.length)];
          setLargeBreweries((largeBreweries) => [...largeBreweries, element]);
        });
      } else {
        alert("Could not fetch Breweries");
      }
    });

    // 4 - Upcoming
    endpoint = "?by_type=planning&per_page=3";
    fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        data.forEach((element) => {
          element.image =
            breweryImages[Math.floor(Math.random() * breweryImages.length)];
          setUpcoming((bars) => [...bars, element]);
        });
      } else {
        alert("Could not fetch Breweries");
      }
    });

    // 5 - Closed
    endpoint = "?by_type=closed&per_page=3";
    fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        data.forEach((element) => {
          element.image =
            breweryImages[Math.floor(Math.random() * breweryImages.length)];
          setUpClosed((bars) => [...bars, element]);
        });
      } else {
        alert("Could not fetch Breweries");
      }
    });
  }, []);

  useEffect(() => {
    fetchBreweriesByType();
  }, []);

  return (
    <Container>
      <ContentWithPaddingXl>
        <Header>{heading}</Header>
        {microBreweries.length > 0 && (
          <SectionWithCards title="Micro Breweries" data={microBreweries} />
        )}
        {/* {brewPubs.length > 0 && (
          <SectionWithCards title="Brew Pubs" data={brewPubs} />
        )} */}
        {largeBreweries.length > 0 && (
          <SectionWithCards title="Large Breweries" data={largeBreweries} />
        )}
        {upcoming.length > 0 && (
          <SectionWithCards title="Upcoming Breweries" data={upcoming} />
        )}
        {closed.length > 0 && (
          <SectionWithCards title="Permanently Closed Breweries" data={closed} />
        )}
      </ContentWithPaddingXl>
      {/* <DecoratorBlob1 /> */}
      {/* <DecoratorBlob2 /> */}
    </Container>
  );
};

const SectionWithCards = ({ title, data }) => (
  <div>
    <HeaderRow>
      <ContentWithPaddingXl>
        <Header>{title}</Header>
      </ContentWithPaddingXl>
    </HeaderRow>

    <CardContainer>
      {data.map((card, index) => (
        <Link to={"/brewery/" + card.id} key={index}>
          <Card className="group" href={card.name} initial="rest">
            <CardImageContainer imageSrc={card.image}>
              <CardRatingContainer>Click for more info</CardRatingContainer>
            </CardImageContainer>
            <CardText>
              <CardPrice>{card.name}</CardPrice>
              <CardTitle>{card.city}</CardTitle>
              <CardContent>{card.street}</CardContent>
            </CardText>
          </Card>
        </Link>
      ))}
    </CardContainer>
  </div>
);
