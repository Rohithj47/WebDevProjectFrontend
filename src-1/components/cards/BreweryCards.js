import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { breweryImages } from "helpers/imageSources";

const Card = tw(
  motion.a
)`border border-black block max-w-xs mx-auto sm:max-w-none sm:mx-0 my-4`;

const BreweryImage = styled.div`
  ${(props) =>
    css`
      background-image: url("${props.imageSrc}");
    `}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative`}
`;

const Title = tw.div`flex flex-col xl:flex-row justify-between items-center `;
const Header = tw.div`text-4xl sm:text-5xl text-center text-black font-thin uppercase underline`; 
const Caption = tw.div`leading-none absolute inline-flex bg-white top-0 right-0 ml-4 mb-4 px-5 py-2 items-end`;
const BreweryInfo = tw.div`pb-4 pl-4`;
const City = tw.h5`text-lg font-semibold group-hover:text-primary-500 text-black`;
const State = tw.p`mt-1 text-sm font-medium text-black`;
const BreweryName = tw.p`mt-4 text-xl font-bold text-black`;

export default ({ heading = "" }) => {
  const [microBreweries, setMicroBreweries] = useState([]);
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
        alert("Error while fetching from API");
      }
    });

    // 2 - Large
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
        alert("Error while fetching from API");
      }
    });

    // 3 - Upcoming
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
        alert("Error while fetching from API");
      }
    });

    // 4 - Closed
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
        alert("Error while fetching from API");
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
    </Container>
  );
};

const SectionWithCards = ({ title, data }) => (
  <div>
    <Title>
      <ContentWithPaddingXl>
        <Header>{title}</Header>
      </ContentWithPaddingXl>
    </Title>

    <div>
      {data.map((card, index) => (
        <Link to={"/brewery/" + card.id} key={index}>
          <Card className="group" href={card.name} initial="rest">
            <BreweryImage imageSrc={card.image}>
              <Caption>Click for more info</Caption>
            </BreweryImage>
            <BreweryInfo>
              <BreweryName>{card.name}</BreweryName>
              <City>{card.city}</City>
              <State>{card.state_province}</State>
            </BreweryInfo>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);
