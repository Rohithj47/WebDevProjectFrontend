import React, { useCallback, useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext"

import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { ReactComponent as StarIcon } from "images/star-icon.svg";

import { breweryImages } from "helpers/imageSources";
import { getFormattedPhoneNumber } from "helpers/dataUtil";
import { getRandomCards } from "helpers/dataUtil";

import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw(SectionHeading)``;
const TabsControl = tw.div`flex flex-col bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0 justify-center`;


const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${props => props.active && tw`bg-primary-500! text-gray-100!`}
  }
`;

const TabContent = tw(motion.div)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12 justify-center`;

const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(motion.a)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;
const CardRatingContainer = tw.div`leading-none absolute inline-flex bg-gray-100 bottom-0 left-0 ml-4 mb-4 rounded-full px-5 py-2 items-end`;
const CardRating = styled.div`
  ${tw`mr-1 text-sm font-bold flex items-end`}
  svg {
    ${tw`w-4 h-4 fill-current text-orange-400 mr-1`}
  }
`;

const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-0 flex justify-center items-center`}
`;
const CardButton = styled(PrimaryButtonBase)`
  ${tw`text-sm absolute top-0 right-0`}
`;


const CardReview = tw.div`font-medium text-xs text-gray-600 text-right`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-15 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

export default ({
    heading = "Checkout the Menu",
}) => {
    const { uid } = useParams();

    const [userContext, setUserContext] = useContext(UserContext);

    const [likedBreweries, setLikedBreweries] = useState([]);
    const [dislikedBreweries, setDislikedBreweries] = useState([]);
    const [visitedBreweries, seVisitedBreweries] = useState([]);
    const [ownedBreweries, setOwnedBreweries] = useState([]);

    const [role, setRole] = useState([]);

    const breweriesData = {
    }
    if (role == 'admin' || ownedBreweries.length > 0) {
        breweriesData.Owned = getRandomCards(ownedBreweries)
    }
    else {
        breweriesData.Liked = getRandomCards(likedBreweries)
        breweriesData.Disliked = getRandomCards(dislikedBreweries)
        breweriesData.Visited = getRandomCards(visitedBreweries)
    }

    const tabsKeys = Object.keys(breweriesData);
    const [activeTab, setActiveTab] = useState(tabsKeys[0]);
    const [error, setError] = useState("")

    const fetchUserDetails = useCallback(() => {
        let endpoint = uid == undefined ? "users/profile" : "users/profile/" + uid;
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
                setRole(data.role);

                // likes
                data.likes.forEach(element => {
                    fetch("https://api.openbrewerydb.org/v1/breweries/" + element, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(async response => {
                        if (response.ok) {
                            const data = await response.json()
                            data.image = breweryImages[Math.floor(Math.random() * breweryImages.length)];
                            setLikedBreweries(likedBreweries => [...likedBreweries, data]);

                        } else {
                            alert("Could not fetch Breweries")
                        }
                    })
                });

                // dislikes
                data.dislikes.forEach(element => {
                    fetch("https://api.openbrewerydb.org/v1/breweries/" + element, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(async response => {
                        if (response.ok) {
                            const data = await response.json()
                            data.image = breweryImages[Math.floor(Math.random() * breweryImages.length)];
                            setDislikedBreweries(dislikedBreweries => [...dislikedBreweries, data]);

                        } else {
                            alert("Could not fetch Breweries")
                        }
                    })
                });

                // visited
                data.visits.forEach(element => {
                    fetch("https://api.openbrewerydb.org/v1/breweries/" + element, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(async response => {
                        if (response.ok) {
                            const data = await response.json()
                            data.image = breweryImages[Math.floor(Math.random() * breweryImages.length)];
                            seVisitedBreweries(visitedBreweries => [...visitedBreweries, data]);

                        } else {
                            alert("Could not fetch Breweries")
                        }
                    })
                });

                // owned
                data.owns.forEach(element => {
                    fetch("https://api.openbrewerydb.org/v1/breweries/" + element, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(async response => {
                        if (response.ok) {
                            const data = await response.json()
                            data.image = breweryImages[Math.floor(Math.random() * breweryImages.length)];
                            setOwnedBreweries(ownedBreweries => [...ownedBreweries, data]);

                        } else {
                            alert("Could not fetch Breweries")
                        }
                    })
                });

                setUserContext(oldValues => {
                    return { ...oldValues, details: data }
                })
            } else {
                if (response.status === 401) {
                    // Edge case: when the token has expired.
                    // This could happen if the refreshToken calls have failed due to network error or
                    // User has had the tab open from previous day and tries to click on the Fetch button
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

    useEffect(() => {
        if (!userContext.details && userContext.token) {
            fetchUserDetails()
        }
        if (role == 'admin' || ownedBreweries.length > 0) {
            setActiveTab("Owned")
        }
    })

    useEffect(() => {
        if (uid != undefined) {
            fetchUserDetails()
        }
        if (role == 'admin' || ownedBreweries.length > 0) {
            setActiveTab("Owned")
        }
    }, [])

    return (
        <Container>
            <ContentWithPaddingXl>
                <HeaderRow>
                    <Header>{heading}</Header>
                    <TabsControl>
                        {Object.keys(breweriesData).map((tabName, index) => (
                            <TabControl key={index} active={activeTab === tabName} onClick={() => setActiveTab(tabName)}>
                                {tabName}
                            </TabControl>
                        ))}
                    </TabsControl>
                </HeaderRow>

                {tabsKeys.map((tabKey, index) => (
                    <TabContent
                        key={index}
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
                            }
                        }}
                        transition={{ duration: 0.4 }}
                        initial={activeTab === tabKey ? "current" : "hidden"}
                        animate={activeTab === tabKey ? "current" : "hidden"}
                    >
                        {breweriesData[tabKey].map((card, index) => (
                            <CardContainer key={index}>
                                <Link to={"/brewery/" + card.id}>
                                    <Card className="group" href={card.name} initial="rest" whileHover="hover" animate="rest">
                                        <CardImageContainer imageSrc={card.image}>
                                            <CardRatingContainer>
                                                <CardReview>{getFormattedPhoneNumber(card.phone)}</CardReview>
                                            </CardRatingContainer>
                                            <CardHoverOverlay
                                                variants={{
                                                    hover: {
                                                        opacity: 1,
                                                        height: "auto"
                                                    },
                                                    rest: {
                                                        opacity: 0,
                                                        height: 0
                                                    }
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <CardButton>Visit</CardButton>
                                            </CardHoverOverlay>
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
                ))}
            </ContentWithPaddingXl>
            <DecoratorBlob1 />
            <DecoratorBlob2 />
        </Container>
    );
};