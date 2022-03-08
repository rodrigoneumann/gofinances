import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert, Keyboard, Platform } from "react-native"
import { useTheme } from 'styled-components'
import { TouchableWithoutFeedback } from "react-native-gesture-handler"

import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from "../../assets/apple.svg"
import GoogleSvg from "../../assets/google.svg"
import LogoSvg from "../../assets/logo.svg"

import { useAuth } from '../../hooks/auth'

import { SignInSocialButton } from "../../components/SignInSocialButton"
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { 
    Container,
    Header,
    Title,
    TitleWrapper,
    SignInTitle,
    Footer,
    FooterWrapper
} from "./styles";
import styled from "styled-components/native";

export function SignIn() {
    const [ isLoading, setIsLoading ] = useState(false)
    const { signInWithGoogle, signInWithApple } = useAuth()

    const theme = useTheme();

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true);
            return await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert('Unable to connect to Google account')
            setIsLoading(false);
        }
    }

    async function handleSignInWithApple() {
        try {
            setIsLoading(true);
            return await signInWithApple()
        } catch (error) {
            console.log(error);
            Alert.alert('Unable to connect to Apple account')
            setIsLoading(false);
        }
    }
    
    return (
        <GestureHandlerRootView style={{ flex: 1}}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                style={{ height: "100%" }}
            >
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
                                onPress={handleSignInWithGoogle}
                            />
                            { Platform.OS === 'ios' &&
                                <SignInSocialButton 
                                title="Log in with Apple Account"
                                svg={AppleSvg}
                                onPress={handleSignInWithApple}
                            />
                            }
                        </FooterWrapper>

                        { isLoading && 
                            <ActivityIndicator
                                color={theme.colors.shape} 
                                style={{ marginTop: 18}}    
                            /> }
                    </Footer>
                </Container>
            </TouchableWithoutFeedback>
        </GestureHandlerRootView>
    )
}