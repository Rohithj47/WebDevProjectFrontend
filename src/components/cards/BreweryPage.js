import React, { useCallback, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import ReviewsCard from "components/cards/ReviewsCard";
import Header from "components/headers/light.js";
import tw from "twin.macro";
import styled from "styled-components";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { PrimaryButton } from "components/misc/Buttons";

import { ReactComponent as PhoneIcon } from "feather-icons/dist/icons/phone-call.svg";
import { ReactComponent as MapPinIcon } from "feather-icons/dist/icons/map-pin.svg";
import { ReactComponent as ExtLinkIcon } from "feather-icons/dist/icons/external-link.svg";
import { ReactComponent as ListIcon } from "feather-icons/dist/icons/list.svg";
import { ReactComponent as LikeIcon } from "feather-icons/dist/icons/heart.svg";
import { ReactComponent as DislikeIcon } from "feather-icons/dist/icons/thumbs-down.svg";
import { ReactComponent as ReviewsIcon } from "feather-icons/dist/icons/message-circle.svg";
import { ReactComponent as VisitsIcon } from "feather-icons/dist/icons/check-circle.svg";

import { breweryImages } from "helpers/imageSources";
import { getFormattedPhoneNumber } from "helpers/dataUtil";

import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-2 md:py-2`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(
  Column
)`md:w-6/12 lg:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-6/12 mt-8 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-8 lg:mr-16 md:order-first`
    : tw`md:ml-8 lg:ml-16 md:order-last`,
]);

const Steps = tw.ul`mt-0`;
const Step = tw.li`mt-8 flex flex-col md:flex-row items-center md:items-start`;
const StepText = tw.div`mt-3 md:mt-0 md:ml-6`;
const StepHeading = tw.h6`mt-3 leading-none text-xl font-semibold`;
const StepDescription = tw.p`mt-3 max-w-xs leading-loose text-sm text-gray-600 font-medium`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-15 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-cover bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8`;

const Heading = tw(
  SectionHeading
)`text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;

const Statistics = tw.div`mt-3 lg:mt-4 xl:mt-8 flex flex-wrap`;
const Statistic = tw.div`text-lg sm:text-2xl lg:text-3xl w-1/2 mt-4 lg:mt-10 text-center md:text-left`;
const Value = tw.div`font-bold text-primary-500`;
const Key = tw.div`font-medium text-gray-700`;

const OwnButton = tw(PrimaryButton)`mt-16 mx-auto`;

export default ({ textOnLeft = false }) => {
  const { bid } = useParams();
  const [userContext, setUserContext] = useContext(UserContext);
  const [brewery, setBrewery] = useState(null);
  const [breweryStats, setBreweryStats] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [visited, setVisited] = useState(false);
  const [owned, setOwned] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchBreweryById = useCallback(() => {
    fetch("https://api.openbrewerydb.org/v1/breweries/" + bid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        setBrewery(null);
        if (response.ok) {
          const data = await response.json();
          data.image =
            breweryImages[Math.floor(Math.random() * breweryImages.length)];
          setBrewery(data);
        } else {
          setError("Could not Find Brewery");
        }
      })
      .catch((error) => {
        setError("Could not Find Brewery");
      });
  }, [bid]);

  const fetchBreweryStats = useCallback(() => {
    let endpoint = "breweries/stats/" + bid;
    fetch(process.env.REACT_APP_API_ENDPOINT + endpoint, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setBreweryStats(data);
          setLiked(data.likedByUser);
          setDisliked(data.dislikedByUser);
          setVisited(data.visitedByUser);
          setOwned(data.ownedByUser);
          setUserRole(data.userRole);
        }
      })
      .catch((error) => {
        setError("Could not Find Brewery");
      });
  }, [bid, userContext.token]);

  const setLike = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    let endpoint = "breweries/like";
    fetch(process.env.REACT_APP_API_ENDPOINT + endpoint, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ bid, liked }),
    }).then(async (response) => {
      setIsSubmitting(false);
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
      } else {
        alert("Could not find Brewery");
      }
    });
  };

  const setDislike = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    let endpoint = "breweries/dislike";
    fetch(process.env.REACT_APP_API_ENDPOINT + endpoint, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ bid, disliked }),
    }).then(async (response) => {
      setIsSubmitting(false);
      if (response.ok) {
        const data = await response.json();
        setDisliked(data.disliked);
      } else {
        alert("Could not find Brewery");
      }
    });
  };

  const setVisit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    let endpoint = "breweries/visit";
    fetch(process.env.REACT_APP_API_ENDPOINT + endpoint, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ bid, visited }),
    }).then(async (response) => {
      setIsSubmitting(false);
      if (response.ok) {
        const data = await response.json();
        setVisited(data.visited);
      } else {
        alert("Could not find Brewery");
      }
    });
  };

  const setOwn = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    let endpoint = "breweries/own";
    fetch(process.env.REACT_APP_API_ENDPOINT + endpoint, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ bid, owned }),
    }).then(async (response) => {
      setIsSubmitting(false);
      if (response.ok) {
        const data = await response.json();
        setOwned(data.owned);
      } else {
        alert("Could not find Brewery");
      }
    });
  };

  useEffect(() => {
    fetchBreweryById();
  }, [bid]);

  useEffect(() => {
    if (userContext.token != null) {
      fetchBreweryStats();
    }
  }, [bid, userContext.token]);

  useEffect(() => {
    fetchBreweryStats();
  }, [liked, disliked, visited]);

  useEffect(() => {
    if (userContext.token != null) {
      fetchBreweryStats();
    }
  });

  return (
    <>
      <Header />
      <Container>
        {error && (
          <ContentWithPaddingXl>
            <HeaderRow>
              <Heading>{error}</Heading>
            </HeaderRow>
          </ContentWithPaddingXl>
        )}
        {!error && brewery && (
          <TwoColumn>
            <ImageColumn>
              <Image imageSrc={brewery && brewery.image} />
            </ImageColumn>
            <TextColumn textOnLeft={textOnLeft}>
              <TextContent>
                <Heading>{brewery.name}</Heading>
                <TwoColumn>
                  <TextColumn textOnLeft={true}>
                    <Steps>
                      <Step>
                        <StepText>
                          <ListIcon />
                          <StepHeading>{"Type"}</StepHeading>
                          <StepDescription>
                            {brewery.brewery_type}
                          </StepDescription>
                        </StepText>
                      </Step>
                      <Step>
                        <StepText
                          as="a"
                          href={"tel:" + brewery.phone}
                          target="_blank"
                        >
                          <PhoneIcon />
                          <StepHeading>{"Phone"}</StepHeading>
                          <StepDescription>
                            {getFormattedPhoneNumber(brewery.phone)}
                          </StepDescription>
                        </StepText>
                      </Step>
                    </Steps>
                  </TextColumn>
                  <TextColumn textOnLeft={false}>
                    <Steps>
                      <Step>
                        <StepText
                          as="a"
                          href={brewery.website_url}
                          target="_blank"
                        >
                          <ExtLinkIcon />
                          <StepHeading>{"Website"}</StepHeading>
                          <StepDescription>
                            {brewery.website_url ? brewery.website_url : "NA"}
                          </StepDescription>
                        </StepText>
                      </Step>
                      <Step>
                        <StepText>
                          <MapPinIcon />
                          <StepHeading>{"Address"}</StepHeading>
                          <StepDescription>
                            {brewery.street +
                              "\n" +
                              brewery.city +
                              ", " +
                              brewery.state +
                              "\n" +
                              brewery.country}
                          </StepDescription>
                        </StepText>
                      </Step>
                    </Steps>
                  </TextColumn>
                </TwoColumn>

                {userContext.token != null && (
                  <Statistics>
                    <Statistic>
                      <LikeIcon
                        color="red"
                        width="42"
                        height="42"
                        fill={liked ? "red" : "white"}
                        onClick={setLike}
                        disabled={isSubmitting}
                      />
                      <Value>{(breweryStats && breweryStats.likes) || 0}</Value>
                      <Key>Likes</Key>
                    </Statistic>
                    <Statistic>
                      <DislikeIcon
                        color={disliked ? "white" : "black"}
                        width="42"
                        height="42"
                        fill={disliked ? "blue" : "white"}
                        onClick={setDislike}
                        disabled={isSubmitting}
                      />
                      <Value>
                        {(breweryStats && breweryStats.dislikes) || 0}
                      </Value>
                      <Key>Disikes</Key>
                    </Statistic>
                    <Statistic>
                      <VisitsIcon
                        color={visited ? "white" : "black"}
                        width="42"
                        height="42"
                        fill={visited ? "green" : "white"}
                        onClick={setVisit}
                        disabled={isSubmitting}
                      />
                      <Value>
                        {(breweryStats && breweryStats.visits) || 0}
                      </Value>
                      <Key>Visits</Key>
                    </Statistic>
                    <Statistic>
                      <ReviewsIcon color="purple" width="42" height="42" />
                      <Value>
                        {(breweryStats && breweryStats.reviewsCount) || 0}
                      </Value>
                      <Key>Reviews</Key>
                    </Statistic>
                  </Statistics>
                )}
                {userRole === "admin" && (
                  <OwnButton onClick={setOwn}>
                    {owned ? "Sell" : "Own"}
                  </OwnButton>
                )}
              </TextContent>
            </TextColumn>
          </TwoColumn>
        )}

        <ReviewsCard bid={bid} userRole={userRole} />

        <DecoratorBlob1 />
        <DecoratorBlob2 />
      </Container>
    </>
  );
};
