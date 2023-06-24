import React from "react";
import { Link } from "react-router-dom";
import Header, {
  NavLink,
  LogoLink,
  NavToggle,
  DesktopNavLinks,
} from "../headers/light.js";
import tw from "twin.macro";
import styled from "styled-components";

const StyledHeader = styled(Header)`
  <${tw`pt-8 max-w-none`}>
  ${DesktopNavLinks} ${NavLink}, ${LogoLink} {
    ${tw`text-gray-100 hover:border-gray-300 hover:text-gray-300`}
  }
  ${NavToggle}.closed {
    // ${tw`text-gray-100 hover:text-primary-500`}
  }
`;
const Container = styled.div`
  ${tw`relative -mx-8 -mt-8 bg-center bg-cover`}
  background-image: url("https://images.pexels.com/photos/5537785/pexels-photo-5537785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
`;

const HeroContainer = tw.div`z-20 relative px-4 sm:px-8 max-w-screen-xl mx-auto`;
const SingleColumn = tw.div`pt-24 pb-32 px-4 flex justify-center items-center flex-col`;

const Heading = styled.h1`
  ${tw`text-3xl text-center lg:text-left sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-none`}
  span {
    ${tw`inline-block mt-2`}
  }
`;

const PrimaryAction = tw.button`px-6 py-3 mt-8 text-base sm:mt-12 sm:px-8 sm:py-4 bg-white text-black font-semibold rounded-lg`;

export default () => {
  return (
    <Container>
      <HeroContainer>
        <StyledHeader />
        <SingleColumn>
          <Heading>
            <span>Brewery reviews on fingertips</span>
          </Heading>
          <Link to="/register">
            <PrimaryAction>Sign up</PrimaryAction>
          </Link>
        </SingleColumn>
      </HeroContainer>
    </Container>
  );
};
