import React, { useCallback, useContext, useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings";
import { SectionDescription } from "components/misc/Typography";
import { ReactComponent as TwitterIcon } from "images/twitter-icon.svg";
import { ReactComponent as LinkedinIcon } from "images/linkedin-icon.svg";
import { ReactComponent as GithubIcon } from "images/github-icon.svg";

import { getFormattedPhoneNumber } from "helpers/dataUtil";

import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";

const HeadingContainer = tw.div``
const Heading = tw(SectionHeading)``
const Subheading = tw(SubheadingBase)`text-center mb-3`
const Description = tw(SectionDescription)`mx-auto text-center`

const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const TextColumn = styled(Column)(props => [
  tw`md:w-7/12 mt-1 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const TextContent = tw.div`lg:py-1 text-center md:text-left`;
const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`
const Input = tw.input`mt-1 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const RadioInput = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const Label = tw.label`mt-6 first:mt-0 py-0 focus:outline-none text-sm font-medium transition duration-300 hocus:border-primary-200 text-start`
const Select = tw.select`mt-1 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`
const Textarea = styled(Input).attrs({ as: "textarea" })`
  ${tw`h-24`}
`

const Cards = tw.div`flex flex-wrap flex-row justify-center sm:max-w-2xl lg:max-w-5xl mx-auto`
const Card = tw.div`mt-1 w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center`
const CardImage = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`w-64 h-64 bg-contain bg-center rounded`}
`
const CardContent = styled.div`
  ${tw`flex flex-col items-center mt-2`}
  .position {
    ${tw`uppercase font-bold tracking-widest text-xs text-primary-500`}
  }
  .bio {
    ${tw`mb-4 text-center text-xs text-gray-400`}
  }
  .name {
    ${tw`mt-2 text-xl font-medium text-gray-900`}
  }
  .phone {
    ${tw`mt-1 text-center text-sm text-gray-600`}
  }
  .email {
    ${tw`mt-1 text-center text-xs text-gray-500`}
  }
  .city {
    ${tw`mt-1 text-center text-xs text-gray-400`}
  }
`

const CardLinks = styled.div`
  ${tw`mt-6 flex`}
  .link {
    ${tw`mr-8 last:mr-0 text-gray-400 hocus:text-primary-500 transition duration-300`}
    .icon {
      ${tw`fill-current w-6 h-6`}
    }
  }
`

export default ({
  heading = "Meet These Fine Folks.",
  subheading = "Our Team",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  submitButtonText = "Update Profile",
  links = [
    {
      url: "https://twitter.com",
      icon: TwitterIcon,
    },
    {
      url: "https://linkedin.com",
      icon: LinkedinIcon,
    },
    {
      url: "https://github.com",
      icon: GithubIcon,
    },
  ],
  textOnLeft = false,
}) => {
  const { uid } = useParams();

  const navigate = useNavigate();
  const [userContext, setUserContext] = useContext(UserContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [loaderror, setLoaderror] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [role, setRole] = useState("")
  const [bio, setBio] = useState("")
  const [photo, setPhoto] = useState("")

  const formSubmitHandler = e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setStatus("")

    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/profile", {
      method: "PUT",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({ firstName, lastName, username, email, phone, bio, city, role }),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
          if (response.status === 400) {
            setError("Please fill all the fields correctly!")
          } else if (response.status === 401) {
            setError("You are not authenticated")
          } else if (response.status === 500) {
            const data = await response.json()
            if (data.message) setError(data.message || genericErrorMessage)
          } else {
            setError(genericErrorMessage)
          }
        } else {
          const data = await response.json()
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token }
          })
          window.location.reload()
          setStatus("Profile Updated")
        }
      })
      .catch(error => {
        setIsSubmitting(false)
        setError(genericErrorMessage)
      })
  }

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
        setLoaderror("")
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setRole(data.role)
        setBio(data.bio)
        setPhoto(data.photo)
        setCity(data.city)
        if (uid === undefined) {
          setUsername(data.username)
          setEmail(data.email)
          setPhone(getFormattedPhoneNumber(data.phone))
          setUserContext(oldValues => {
            return { ...oldValues, details: data }
          })
        }

      } else {
        if (response.status === 401) {
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to click on the Fetch button
          window.location.reload()
        } else if (response.status == 404) {
          setLoaderror("User not found")
        } else {
          setUserContext(oldValues => {
            return { ...oldValues, details: null }
          })
        }
      }
    })
  }, [setUserContext, userContext.token])

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details && userContext.token) {
      fetchUserDetails()
    }
  }, [userContext.details, fetchUserDetails])

  useEffect(() => {
    if (uid != undefined) {
      fetchUserDetails()
    }
  })

  // Navigate out for anonymous users
  useEffect(() => {
    const timer = setTimeout(() => {
      if (uid == undefined && !userContext.details) {
        navigate('/login')
        console.log(userContext)
      }
    }, 1000);
    return () => clearTimeout(timer);
  })

  const Container = tw.div`flex justify-center items-center h-screen`;
  const TextColumn = styled(Column)(props => [
    tw`md:w-7/12 mt-1 md:mt-0 flex justify-center`, // Updated class name to 'my-textcolumn'
    props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
  ]);
  

  return (
    <Container>
      <HeadingContainer>
        {/* {subheading && <Subheading>{subheading}</Subheading>} */}
        {/* {heading && <Heading>{heading}</Heading> } */}
        {/* {loaderror && <p tw="mt-6 text-xs text-red-500 text-center">{loaderror}</p>} */}
        {loaderror && <Description>{loaderror}</Description>}
      </HeadingContainer>
      {loaderror == "" &&
        <TwoColumn>
          <Cards>
            <Card>
              <CardImage imageSrc={photo} />
              <CardContent>
                <span className="position">{role == "user" ? "Patron" : "Owner"}</span>
                <span className="name">{firstName + " " + lastName}</span>
                <span className="bio">{bio}</span>
                <span className="phone">{getFormattedPhoneNumber(phone)}</span>
                <span className="email">{email}</span>
                <span className="city">{city}</span>
                <CardLinks>
                  {links.map((link, linkIndex) => (
                    <a key={linkIndex} className="link" href={link.url}>
                      <link.icon className="icon" />
                    </a>
                  ))}
                </CardLinks>

                {status && <p tw="mt-6 text-sm text-green-500 text-center">{status}</p>}
              </CardContent>
            </Card>
          </Cards>
          {userContext.token && uid == undefined &&
            <TextColumn textOnLeft={textOnLeft}>
              <TextContent>
                <Form onSubmit={formSubmitHandler}>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="string"
                    name="firstName"
                    placeholder={"Your First Name"}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)} />
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="string"
                    name="lastName"
                    placeholder={"Your Last Name"}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)} />

                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="string"
                    name="username"
                    disabled={true}
                    placeholder={"Your Username"}
                    value={username}
                    onChange={e => setUsername(e.target.value)} />

                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder={"Your Email"}
                    value={email}
                    onChange={e => setEmail(e.target.value)} />

                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder={"Your Phone (XXX-XXX-XXXX)"}
                    value={phone}
                    onChange={e => setPhone(e.target.value)} />

                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    type="string"
                    name="bio"
                    placeholder={"Your Bio Here"}
                    value={bio}
                    onChange={e => setBio(e.target.value)} />

                  <Label htmlFor="city">City</Label>
                  <Select name="city" onChange={e => setCity(e.target.value)}>
                    <option selected={city == "Boston" ? true : false} value="Boston">Boston</option>
                    <option selected={city == "Seattle" ? true : false} value="Seattle">Seattle</option>
                    <option selected={city == "Austin" ? true : false} value="Austin">Austin</option>
                    <option selected={city == "Chicago" ? true : false} value="Chicago">Chicago</option>
                    <option selected={city == "Denver" ? true : false} value="Denver">Denver</option>
                    <option selected={city == "Miami" ? true : false} value="Miami">Miami</option>
                  </Select>

                  {/* <Label htmlFor="role">Role</Label>
                  <Select name="role" onChange={e => setRole(e.target.value)}>
                    <option selected={role == "user" ? true : false} value="user">Patron</option>
                    <option selected={role == "admin" ? true : false} value="admin">Owner</option>
                  </Select> */}
                  <SubmitButton disabled={isSubmitting} type="submit">
                    <span className="text">{`${isSubmitting ? "Updating Profile" : "Update Profile"}`}</span>
                  </SubmitButton>
                  {error && <p tw="mt-6 text-xs text-red-500 text-center">{error}</p>}
                </Form>
              </TextContent>
            </TextColumn>
          }
        </TwoColumn>
      }
    </Container>
  );
};