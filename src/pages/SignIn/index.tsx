import React from "react";
import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from "../../assets/apple.svg"
import GoogleSvg from "../../assets/google.svg"
import LogoSvg from "../../assets/logo.svg"

import { SignInSocialButton } from "../../components/SignInSocialButton"

import { 
    Container,
    Header,
    Title,
    TitleWrapper,
    SignInTitle,
    Footer,
    FooterWrapper
} from "./styles";

export function SignIn() {
    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>Control your {'\n'}finances easily</Title>
                </TitleWrapper>
                <SignInTitle>Log in with one of {'\n'} the accounts below</SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton 
                        title="Log in with Google Account"
                        svg={GoogleSvg}
                    />
                    <SignInSocialButton 
                        title="Log in with Apple Account"
                        svg={AppleSvg}
                    />
                </FooterWrapper>
            </Footer>
        </Container>
    )
}