import React from 'react';
import { TextInputProps } from 'react-native';
import { Control, Controller } from 'react-hook-form';

import { Input } from '../Input'

interface Props extends TextInputProps {
    control: Control
    name: string;
}

import { 
    Container, 
} from './styles';

export function InputForm({
    control,
    name,
    ...rest 
    }: Props) {

    return (
        <Container>
            <Controller
                control={control}
                render={({ field: {onChange, value}}) => (
                    <Input
                    onChangeText={onChange}
                    value={value}
                    {...rest}
                    />
                )}
                name={name}
            />
        </Container>
    )
}