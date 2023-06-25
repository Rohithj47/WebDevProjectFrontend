import React, { useCallback, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { UserContext } from "../../context/UserContext";
import { ReactComponent as LocationIcon } from "feather-icons/dist/icons/map-pin.svg";
import { ReactComponent as Ph } from "feather-icons/dist/icons/phone-call.svg";
import { ReactComponent as Loc } from "feather-icons/dist/icons/table.svg";
import { ReactComponent as URL } from "feather-icons/dist/icons/link.svg";

import { breweryImages } from "helpers/imageSources";

const Container = tw.div`relative`;
const SubContainer = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20`;
const TitleStyle = tw.div`flex flex-col items-center sm:items-stretch sm:flex-row justify-between`;
const Header = tw.div`text-4xl sm:text-5xl text-center text-black font-thin uppercase underline`;
const CardContainer = tw.div`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3`;
const Card = tw.div`h-full flex! flex-col max-w-sm relative border border-black`;
const TextInfo = tw.div`py-6 sm:px-10 sm:py-6`;
const Title = tw.h5`text-2xl font-sans uppercase text-black`;
const BreweryInfo = tw.div`flex mr-6 my-2 sm:my-0 pb-2 pt-2`;
const Icon = styled.div`
  ${tw`inline-block p-2 bg-gray-700 text-gray-100`}
  svg {
    ${tw`w-3 h-3`}
  }
`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`w-full h-56 sm:h-64 bg-cover bg-center`,
]);
const Value = tw.div`ml-2 text-sm font-sans text-black`;

export default () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [breweriesByCity, setBreweriesByCity] = useState([]);
  const [city, setCity] = useState("Boston");
  const [setError] = useState("");

  const fetchUserDetails = useCallback(() => {
    let url = "users/profile";
    fetch(process.env.REACT_APP_API_ENDPOINT + url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setCity(data.city);
        setUserContext((oldValues) => {
          return { ...oldValues, details: data };
        });
      } else {
        if (response.status === 401) {
          window.location.reload();
        } else if (response.status == 404) {
          setError("User not found");
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, details: null };
          });
        }
      }
    });
  }, [setUserContext, userContext.token]);

  const fetchBreweriesByCity = useCallback(() => {
    const endpoint = "?by_city=" + city + "&per_page=3";
    fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      setBreweriesByCity([]);
      if (response.ok) {
        const data = await response.json();
        data.forEach((element) => {
          element.image =
            breweryImages[Math.floor(Math.random() * breweryImages.length)];
          setBreweriesByCity((breweriesByCity) => [
            ...breweriesByCity,
            element,
          ]);
        });
      } else {
        alert("Error fetching breweries from API");
      }
    });
  }, [city]);

  useEffect(() => {
    if (!userContext.details && userContext.token) {
      fetchUserDetails();
    }
  }, [userContext.details]);

  useEffect(() => {
    fetchBreweriesByCity();
  }, [city]);

  return (
    <Container>
      <SubContainer>
        <TitleStyle>
          <Header>Popular Breweries in your city - {city}</Header>
        </TitleStyle>
        <CardContainer>
          {breweriesByCity.map((card, index) => (
            <Card key={index}>
              <Link to={"/brewery/" + card.id}>
                <CardImage imageSrc={card.image} />
                <TextInfo>
                  <Title>{card.name}</Title>
                  <BreweryInfo>
                    <Icon>
                      <Loc />
                    </Icon>
                    <Value>{card.city}</Value>
                  </BreweryInfo>
                  <BreweryInfo>
                    <Icon>
                      <URL />
                    </Icon>
                    <Value>{card.website_url}</Value>
                  </BreweryInfo>
                  <BreweryInfo>
                    <Icon>
                      <Ph />
                    </Icon>
                    <Value>{card.phone}</Value>
                  </BreweryInfo>
                  <>
                    <BreweryInfo>
                      <Icon>
                        <LocationIcon />
                      </Icon>
                      <Value>{card.street}</Value>
                    </BreweryInfo>
                  </>
                </TextInfo>
              </Link>
            </Card>
          ))}
        </CardContainer>
      </SubContainer>
    </Container>
  );
};
