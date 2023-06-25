import React, { useCallback, useState, useEffect } from "react";
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";

import { breweryImages } from "helpers/imageSources";

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw(SectionHeading)``;

const TabContent = tw(
  motion.div
)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12`;
const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
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

const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;

const CardButton = tw(PrimaryButtonBase)`text-sm`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;


const Form = tw.form`mx-auto`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;

const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
  input {
    ${tw`sm:pr-48 pl-8 py-4 sm:py-5 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
  }
  button {
    ${tw`w-full sm:absolute right-0 top-0 bottom-0 bg-primary-500 text-gray-100 font-bold mr-2 my-4 sm:my-2 rounded-full py-4 flex items-center justify-center sm:w-40 sm:leading-none focus:outline-none hover:bg-primary-900 transition duration-300`}
  }
`;

export default ({ heading = "Checkout the Menu" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query"));
  const [breweries, setBreweries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const params = {
      query: searchQuery || "",
    };
    const options = {
      pathname: "/search",
      search: `?${createSearchParams(params)}`,
    };
    navigate(options, { replace: true });

    const endpoint = "/search?query=" + searchQuery + "&per_page=12";
    fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      setIsSubmitting(false);
      setBreweries([]);
      if (response.ok) {
        const data = await response.json();
        data.forEach((element) => {
          element.image =
            breweryImages[Math.floor(Math.random() * breweryImages.length)];
          setBreweries((breweries) => [...breweries, element]);
        });
      } else {
        alert("Could not search Breweries");
      }
    });
  };

  const fetchBreweriesByQuery = useCallback(() => {
    const endpoint = "/search?query=" + searchQuery + "&per_page=12";
    fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      setIsSubmitting(false);
      setBreweries([]);
      if (response.ok) {
        const data = await response.json();
        data.forEach((element) => {
          element.image =
            breweryImages[Math.floor(Math.random() * breweryImages.length)];
          setBreweries((breweries) => [...breweries, element]);
        });
      } else {
        alert("Could not search Breweries");
      }
    });
  }, []);

  useEffect(() => {
    fetchBreweriesByQuery();
  }, []);

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderRow>
          <Header>{heading}</Header>
          <Actions>
            <Form onSubmit={searchSubmitHandler}>
              <Input
                type="text"
                placeholder="Brewey Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SubmitButton disabled={isSubmitting} type="submit">
                <span className="text">{`${
                  isSubmitting ? "Searching" : "Search"
                }`}</span>
              </SubmitButton>
            </Form>
          </Actions>
        </HeaderRow>

          <TabContent
            variants={{
              current: {
                opacity: 1,
                scale: 1,
                display: "flex",
              },
              hidden: {
                opacity: 0,
                scale: 0.8,
                display: "none",
              },
            }}
          > 
            {breweries.map((card, index) => (
              <CardContainer key={index}>
                <Link to={"/brewery/" + card.id}>
                  <Card
                    className="group"
                    href={card.name}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <CardImageContainer imageSrc={card.image}>
                      <CardButton>Visit</CardButton>
                    </CardImageContainer>
                    <CardText>
                      <CardPrice>{card.name}</CardPrice>
                      <CardTitle>{card.city}</CardTitle>
                      <CardContent>{card.street}</CardContent>
                    </CardText>
                  </Card>
                </Link>
              </CardContainer>
            ))}
          </TabContent>
      </ContentWithPaddingXl>
    </Container>
  );
};
