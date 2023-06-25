import React from "react";
import { Link } from "react-router-dom";
import Header, {
  NavLink,
  LogoLink,
  DesktopNavLinks,
} from "../headers/light.js";
import tw from "twin.macro";
import styled from "styled-components";
import { ReactComponent as Insta } from "feather-icons/dist/icons/instagram.svg";
import { ReactComponent as Facebook } from "feather-icons/dist/icons/facebook.svg";
import { ReactComponent as Twitter } from "feather-icons/dist/icons/twitter.svg";

const StyledHeader = styled(Header)`
  <${tw`pt-8 max-w-none`}>
  ${DesktopNavLinks} ${NavLink}, ${LogoLink} {
    ${tw`text-black hover:border-gray-300 hover:text-white`}
  }
`;
const Container = styled.div`
  ${tw`relative -mx-8 -mt-8 bg-center bg-cover`}
  background-image: url("https://images.pexels.com/photos/5537785/pexels-photo-5537785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
`;


const HeroContainer = tw.div`z-20 relative px-4 sm:px-8 max-w-screen-xl mx-auto`;
const SingleColumn = tw.div`pt-24 pb-8 px-4 flex justify-center items-center flex-col`;
const Buttons = tw.div`flex`;
const ButtonLink = styled(Link)`
  ${tw`px-4 py-2 text-black bg-white text-black border border-black font-sans uppercase mr-4`}
`;
const Caption = styled.div`
  ${tw`leading-none absolute inline-flex inline-grid gap-2 bg-white text-black border border-black bottom-0 right-0 px-5 py-2`}
  grid-template-columns: repeat(4, auto);
`;
const Heading = styled.h1`
  ${tw`text-3xl lg:text-left sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white`} font-family: cursive
`;

export default () => {
  return (
    <Container>
      <HeroContainer>
        <StyledHeader />
        <SingleColumn>
          <Heading>
            <span>Brewery reviews on fingertips</span>
          </Heading>
          <Buttons>
            <ButtonLink to="/login">Log In</ButtonLink>
            <ButtonLink to="/register">Sign Up</ButtonLink>
          </Buttons>
        </SingleColumn>
        <SingleColumn>
          <Caption>Follow us on  <Insta /> <Facebook /> <Twitter /> </Caption> 
        </SingleColumn>
      </HeroContainer>
    </Container>
  );
};
