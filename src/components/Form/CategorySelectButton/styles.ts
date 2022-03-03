import styled from "styled-components/native";
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from "react-native-gesture-handler"
import { Feather } from '@expo/vector-icons'

export const Container = styled(RectButton).attrs({
    activeOpacity: 0.7
})`
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border-radius: 5px;

    margin-top: 16px;
`

export const Category = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    padding: 18px 16px;
`

export const Icon = styled(Feather)`
    font-size: ${RFValue(20)}px;
    padding-right: 13px;

    color: ${({ theme }) => theme.colors.text};
`