import React, { useCallback, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import tw from "twin.macro";
import styled from "styled-components";
import { UserContext } from "../../context/UserContext"
// import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons";
import { ReactComponent as LocationIcon } from "feather-icons/dist/icons/map-pin.svg";
import { ReactComponent as ChevronLeftIcon } from "feather-icons/dist/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "feather-icons/dist/icons/chevron-right.svg";
import { ReactComponent as PhoneIcon } from "feather-icons/dist/icons/phone.svg";
import { ReactComponent as MapIcon } from "feather-icons/dist/icons/map.svg";

import { breweryImages } from "helpers/imageSources";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20`;

const HeadingWithControl = tw.div`flex flex-col items-center sm:items-stretch sm:flex-row justify-between`;
const Heading = tw.div`text-4xl sm:text-5xl text-center text-black font-thin uppercase underline`;
const Controls = tw.div`flex items-center`;
const PrimaryButtonBase = tw.button`px-8 py-3 font-bold rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline focus:outline-none transition duration-300`;

const ControlButton = styled(PrimaryButtonBase)`
  ${tw`mt-4 sm:mt-0 first:ml-0 ml-6 rounded-full p-2`}
  svg {
    ${tw`w-6 h-6`}
  }
`;
const PrevButton = tw(ControlButton)``;
const NextButton = tw(ControlButton)``;

const CardSlider = styled(Slider)`
  ${tw`mt-16`}
  .slick-track { 
    ${tw`flex`}
  }
  .slick-slide {
    ${tw`h-auto flex justify-center mb-1`}
  }
`;
const Card = tw.div`h-full flex! flex-col max-w-sm relative border border-black`;
const CardImage = styled.div(props => [
    `background-image: url("${props.imageSrc}");`,
    tw`w-full h-56 sm:h-64 bg-cover bg-center`
]);

const TextInfo = tw.div`py-6 sm:px-10 sm:py-6`;
const TitleReviewContainer = tw.div`flex flex-col sm:flex-row sm:justify-between sm:items-center`;
const Title = tw.h5`text-2xl font-sans uppercase text-black`;

const SecondaryInfoContainer = tw.div`flex flex-col sm:flex-row mt-2 sm:mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;
const IconContainer = styled.div`
  ${tw`inline-block rounded-full p-2 bg-gray-700 text-gray-100`}
  svg {
    ${tw`w-3 h-3`}
  }
`;
const Text = tw.div`ml-2 text-sm font-sans text-black`;

export default () => {
    // useState is used instead of useRef below because we want to re-render when sliderRef becomes available (not null)
    const [sliderRef, setSliderRef] = useState(null);
    const sliderSettings = {
        arrows: false,
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 2,
                }
            },

            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    };

    const [userContext, setUserContext] = useContext(UserContext);
    const [breweriesByCity, setBreweriesByCity] = useState([]);
    const [city, setCity] = useState("Boston");
    const [setError] = useState("");

    const fetchUserDetails = useCallback(() => {
        let endpoint = "users/profile";
        fetch(process.env.REACT_APP_API_ENDPOINT + endpoint, {
            method: "GET",
            credentials: "include",
            // Pass authentication token as bearer token in header
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
        }).then(async response => {
            if (response.ok) {
                const data = await response.json()
                setCity(data.city)
                setUserContext(oldValues => {
                    return { ...oldValues, details: data }
                })
            } else {
                if (response.status === 401) {
                    window.location.reload()
                } else if (response.status == 404) {
                    setError("User not found")
                } else {
                    setUserContext(oldValues => {
                        return { ...oldValues, details: null }
                    })
                }
            }
        })
    }, [setUserContext, userContext.token])

    const fetchBreweriesByCity = useCallback(() => {
        const endpoint = "?by_city=" + city + "&per_page=3";
        fetch("https://api.openbrewerydb.org/v1/breweries" + endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async response => {
            setBreweriesByCity([])
            if (response.ok) {
                const data = await response.json()
                data.forEach(element => {
                    element.image = breweryImages[Math.floor(Math.random() * breweryImages.length)];
                    setBreweriesByCity(breweriesByCity => [...breweriesByCity, element]);
                });
            } else {
                alert("Could not fetch Breweries")
            }
        })
    }, [city])

    useEffect(() => {
        if (!userContext.details && userContext.token) {
            fetchUserDetails()
        }
    }, [userContext.details])

    useEffect(() => {
        fetchBreweriesByCity();
    }, [city])

    return (
        <Container>
            <Content>
                <HeadingWithControl>
                    <Heading>Popular Breweries in your city - {city}</Heading>
                    <Controls>
                        <PrevButton onClick={sliderRef?.slickPrev}><ChevronLeftIcon /></PrevButton>
                        <NextButton onClick={sliderRef?.slickNext}><ChevronRightIcon /></NextButton>
                    </Controls>
                </HeadingWithControl>
                <CardSlider ref={setSliderRef} {...sliderSettings}>
                    {breweriesByCity.map((card, index) => (
                        <Card key={index}>
                            <Link to={"/brewery/" + card.id}>
                                <CardImage imageSrc={card.image} />
                                <TextInfo>
                                    <TitleReviewContainer>
                                        <Title>{card.name}</Title>
                                    </TitleReviewContainer>
                                    <SecondaryInfoContainer>
                                        <IconWithText>
                                            <IconContainer>
                                                <MapIcon />
                                            </IconContainer>
                                            <Text>{card.city + ", " + card.state}</Text>
                                        </IconWithText>
                                        <IconWithText>
                                            <IconContainer>
                                                <PhoneIcon />
                                            </IconContainer>
                                            <Text as="a" href={"tel:" + card.phone} target="_blank">{card.phone}</Text>
                                        </IconWithText>
                                    </SecondaryInfoContainer>
                                    <SecondaryInfoContainer>
                                        <IconWithText>
                                            <IconContainer>
                                                <LocationIcon />
                                            </IconContainer>
                                            <Text as="a" href={handleDirections(card.latitude, card.longitude)} target="_blank" >{card.street}</Text>
                                        </IconWithText>
                                    </SecondaryInfoContainer>
                                </TextInfo>
                            </Link>
                            {/* <PrimaryButton as="a" href={card.website_url} target="_blank">Visit Website</PrimaryButton> */}
                        </Card>
                    ))}
                </CardSlider>
            </Content>
        </Container>
    );
};

const handleDirections = (latitude, longitude) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
};
