import "slick-carousel/slick/slick.css";
import React, { useContext, useState, useCallback, useEffect } from "react"
import { UserContext } from "../../context/UserContext"
import Slider from "react-slick";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import loveIllustrationImageSrc from "images/love-illustration.svg";
import { ReactComponent as StarIconBase } from "images/star-icon.svg";
import { ReactComponent as ArrowLeftIcon } from "images/arrow-left-3-icon.svg";
import { ReactComponent as ArrowRightIcon } from "images/arrow-right-3-icon.svg";
import { ReactComponent as SubmitButtonIcon } from "feather-icons/dist/icons/send.svg";
import { ReactComponent as DeleteIcon } from "feather-icons/dist/icons/trash.svg";

const Row = tw.div`flex flex-col md:flex-row justify-between items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 xl:w-6/12 flex-shrink-0 relative`;
const TextColumn = styled(Column)(props => [
    tw`md:w-7/12 xl:w-6/12 mt-16 md:mt-0`,
    props.textOnLeft ? tw`md:pr-12 lg:pr-16 md:order-first` : tw`md:pl-12 lg:pl-16 md:order-last`
]);

const DeleteMarker = tw.span`mt-2 mx-auto`;

const Image = styled.img(props => [
    props.imageRounded && tw`rounded`,
    props.imageBorder && tw`border`,
    props.imageShadow && tw`shadow`
]);

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
    SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-6 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const TestimonialSlider = styled(Slider)`
  ${tw`w-full mt-10 text-center md:text-left`}
  .slick-track {
    ${tw`flex`}
  }
  .slick-slide {
    ${tw`h-auto flex justify-center mb-1`}
  }
`;

const Testimonial = tw.div`outline-none h-full flex! flex-col`;
const StarsContainer = styled.div``;
const StarIcon = tw(StarIconBase)`inline-block w-5 h-5 text-orange-400 fill-current mr-1 last:mr-0`;
const TestimonialHeading = tw.div`mt-4 text-xl font-bold`;
const Quote = tw.blockquote`mt-4 mb-8 sm:mb-10 leading-relaxed font-medium text-gray-700`;

const CustomerInfoAndControlsContainer = tw.div`mt-auto flex justify-between items-center flex-col sm:flex-row`;

const CustomerInfo = tw.div`flex flex-col sm:flex-row items-center justify-center lg:justify-start`;
const CustomerProfilePicture = tw.img`rounded-full w-16 h-16 sm:w-20 sm:h-20`;
const CustomerTextInfo = tw.div`text-center md:text-left sm:ml-6 mt-2 sm:mt-0`;
const CustomerName = tw.h5`font-bold text-xl`;
const CustomerTitle = tw.p`font-medium text-secondary-100`;

const Controls = styled.div`
  ${tw`flex mt-8 sm:mt-0`}
  .divider {
    ${tw`my-3 border-r`}
  }
`;
const ControlButton = styled.button`
  ${tw`mx-3 p-4 rounded-full transition duration-300 bg-gray-200 hover:bg-gray-300 text-primary-500 hover:text-primary-700 focus:outline-none focus:shadow-outline`}
  svg {
    ${tw`w-4 h-4 stroke-3`}
  }
`;

const FormContainer = tw.div`w-full flex-1 mt-8`;
const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full mt-8 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const Range = tw.input`w-full mt-6 first:mt-6 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const Textarea = styled(Input).attrs({ as: "textarea" })`
  ${tw`h-24`}
`
const Label = tw.label`mt-6 first:mt-6 py-6 focus:outline-none text-lg font-medium transition duration-300 hocus:border-primary-200 text-start`

export default ({
    bid,
    userRole,
    imageSrc = loveIllustrationImageSrc,
    imageRounded = true,
    imageBorder = false,
    imageShadow = false,
    subheading = "Testimonials",
    heading = "Our Clients Love Us.",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam.",
    textOnLeft = false,
    testimonials = [
        {
            stars: 5,
            profileImageSrc:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
            heading: "Amazing User Experience",
            quote:
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
            customerName: "Charlotte Hale",
            customerTitle: "CEO, Delos Inc."
        },
        {
            stars: 5,
            profileImageSrc:
                "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
            heading: "Love the Developer Experience and Design Principles !",
            quote:
                "Sinor Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            customerName: "Adam Cuppy",
            customerTitle: "Founder, EventsNYC"
        }
    ]
}) => {
    const [sliderRef, setSliderRef] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [userContext, setUserContext] = useContext(UserContext)

    const [title, setTitle] = useState("")
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(1)
    const [refresh, setRefresh] = useState(0)

    const [reviewsList, setReviewsList] = useState([])

    const formSubmitHandler = e => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        const genericErrorMessage = "Something went wrong! Please try again later."
        fetch(process.env.REACT_APP_API_ENDPOINT + "breweries/review", {
            method: "PUT",
            credentials: "include",
            // Pass authentication token as bearer token in header
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({ bid, title, review, rating }),
        }).then(async response => {
            setIsSubmitting(false)
            if (response.ok) {
                const data = await response.json()
                setTitle("")
                setReview("")
                setRating(1)
                setRefresh(refresh + 1)
            } else {
                setError("Could not review Brewery")
            }
        })
    }

    const deleteReviewHandler = (bid, username) => {
        setIsSubmitting(true)
        setError("")

        const genericErrorMessage = "Something went wrong! Please try again later."
        fetch(process.env.REACT_APP_API_ENDPOINT + "breweries/review", {
            method: "DELETE",
            credentials: "include",
            // Pass authentication token as bearer token in header
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({ bid, username }),
        }).then(async response => {
            setIsSubmitting(false)
            if (response.ok) {
                const data = await response.json()
                setRefresh(refresh + 1)
            } else {
                setError("Failed. Only owners can delete reviews")
            }
        })
    }

    const fetchBreweryReviews = useCallback(() => {
        let endpoint = "breweries/review/" + bid;
        fetch(process.env.REACT_APP_API_ENDPOINT + endpoint, {
            method: "GET",
            credentials: "include",
            // Pass authentication token as bearer token in header
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${userContext.token}`,
            },
        }).then(async response => {
            if (response.ok) {
                const data = await response.json()
                setReviewsList(data);
            }
        }).catch(error => {
            setError("Could not Find Brewery")
        })
    }, [bid, userContext.token, refresh])

    useEffect(() => {
        // if (userContext.token != null) {
        fetchBreweryReviews();
        // }
    }, [bid, userContext.token, refresh])

    return (
        <Container>
            <ContentWithPaddingXl>
                <Row>
                    <TextColumn textOnLeft={false}>

                        {userRole == 'user' &&
                            <FormContainer>
                                <Form onSubmit={formSubmitHandler} >
                                    <Input
                                        type="string"
                                        placeholder="Title"
                                        required={true}
                                        value={title}
                                        onChange={e => setTitle(e.target.value)} />
                                    <Textarea
                                        type="string"
                                        placeholder="Your Review"
                                        required={true}
                                        value={review}
                                        onChange={e => setReview(e.target.value)} />
                                    <Label htmlFor="rating">{"Rating: " + rating}</Label>
                                    <Range
                                        type="range"
                                        placeholder="Rating"
                                        value={rating}
                                        min="1" max="5" step="1"
                                        name="rating"
                                        onChange={e => setRating(e.target.value)} />
                                    <SubmitButton disabled={isSubmitting} type="submit">
                                        <SubmitButtonIcon className="icon" />
                                        <span className="text">{`${isSubmitting ? "Reviewing" : "Review"}`}</span>
                                    </SubmitButton>
                                </Form>
                                {error && <p tw="mt-6 text-sm text-red-500 text-center">{error}</p>}
                            </FormContainer>
                        }
                    </TextColumn>
                    <TextColumn textOnLeft={true}>
                        <TestimonialSlider arrows={false} ref={setSliderRef}>
                            {reviewsList.map((review, index) => (
                                <Testimonial key={index}>
                                    <StarsContainer>
                                        {Array.from({ length: review.rating }).map((_, indexIcon) => (
                                            <StarIcon key={indexIcon} />
                                        ))}
                                    </StarsContainer>
                                    <TestimonialHeading>{review.title}</TestimonialHeading>

                                    {userRole == 'admin' &&
                                        <DeleteMarker onClick={() => deleteReviewHandler(review.bid, review.username)}>
                                            <DeleteIcon color="red" />
                                        </DeleteMarker>
                                    }

                                    <Quote>{review.review}</Quote>
                                    <CustomerInfoAndControlsContainer>
                                        <a href={"/profile/" + review.username}>
                                            <CustomerInfo>
                                                <CustomerProfilePicture src={review.photo} alt="avatar" />
                                                <CustomerTextInfo>
                                                    <CustomerName>{review.firstName + " " + review.lastName}</CustomerName>
                                                    <CustomerTitle>{review.username}</CustomerTitle>
                                                </CustomerTextInfo>
                                            </CustomerInfo>
                                        </a>
                                        <Controls>
                                            <ControlButton onClick={sliderRef?.slickPrev}>
                                                <ArrowLeftIcon />
                                            </ControlButton>
                                            <div className="divider" />
                                            <ControlButton onClick={sliderRef?.slickNext}>
                                                <ArrowRightIcon />
                                            </ControlButton>
                                        </Controls>
                                    </CustomerInfoAndControlsContainer>
                                </Testimonial>
                            ))}
                        </TestimonialSlider>
                    </TextColumn>
                </Row>
            </ContentWithPaddingXl>
        </Container>
    );
};
