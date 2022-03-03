import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

interface Props extends RectButtonProps {
    title: string;
    svg: React.FC<SvgProps>
}

import { 
    Button,
    ImgContainer,
    Text,
} from "./styles"

export function SignInSocialButton({
    title,
    svg: Svg,
    ...rest
}: Props) {
    return (
        <Button >
            <ImgContainer>
                <Svg />
            </ImgContainer>

            <Text>
                {title}
            </Text>
        </Button>
    )
}