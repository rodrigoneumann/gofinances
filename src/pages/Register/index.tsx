import React, { useEffect, useState } from "react";
import { Keyboard,
         Modal,
         Alert
} from 'react-native'

import uuid from 'react-native-uuid'

import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useForm } from 'react-hook-form'; 
import { useNavigation } from '@react-navigation/native'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles'

import { InputForm } from "../../components/Form/InputForm";
import { Button } from '../../components/Form/Button'
import { TransactionTypeButton } from "../../components/TransactionTypeButton";
import { CategorySelectButton } from '../../components/Form/CategorySelectButton'

import { CategorySelect } from '../CategorySelect'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLinkBuilder } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type NavigationProps = {
    navigate:(screen:string) => void;
}
interface FormData {
    name: string,
    amount: number
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Name is required'),
    amount: Yup
    .number()
    .typeError('Only Numbers are accepted')
    .positive('The value cannot be negative')
    .required('Amount is required')
})


export function Register(){
    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Category',
    })

    const navigation = useNavigation<NavigationProps>()

    const { 
        control,
        handleSubmit,
        reset,
        formState : { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    // const dataKey = '@gofinances:transactions'

    // useEffect(() => {
    //     async function loadData() {
    //         await AsyncStorage.removeItem(dataKey)
    //     }
    //     loadData() 
    // }, [])

    function handleTransactionTypeButtonSelect(type: 'positive' | 'negative') {
        setTransactionType(type)
    }
    
    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }
    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }


    async function handleRegister(form: FormData) {
        if (!transactionType)
            return Alert.alert('Select transaction type')
        if (category.key === 'category')
            return Alert.alert('Select Category')

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            category: category.key,
            type: transactionType,
            date: new Date()
        }

        try {
        const dataKey = '@gofinances:transactions'
        const data = await AsyncStorage.getItem(dataKey);
        const currentData = data ? JSON.parse(data) : [];
        
        const dataFormatted = [
            ...currentData,
            newTransaction
        ];
        
        await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

        reset();
        setTransactionType('');
        setCategory({
            key: 'category',
            name: 'Category'
        })

        navigation.navigate('List')

        } catch (error) {
            console.log(error);
            Alert.alert("It wasn't possible to save")
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
                        <Title>Register</Title>
                    </Header>
                    
                    <Form>
                        <Fields>
                            <InputForm
                                name="name"
                                control={control}
                                placeholder="Name"
                                autoCapitalize="sentences"
                                autoCorrect={false}
                                error={errors.name && errors.name.message}
                            />
                            <InputForm 
                                name="amount"
                                control={control}
                                placeholder="Price"
                                keyboardType="numeric"
                                error={errors.amount && errors.amount.message}
                            />

                            <TransactionsTypes>
                                <TransactionTypeButton 
                                    type='up'
                                    title='Income'
                                    onPress={() => handleTransactionTypeButtonSelect('positive')}
                                    isActive={transactionType === 'positive'}
                                />
                                <TransactionTypeButton 
                                    type='down'
                                    title='Outcome'
                                    onPress={() => handleTransactionTypeButtonSelect('negative')}
                                    isActive={transactionType === 'negative'}
                                />
                            </TransactionsTypes>

                            <CategorySelectButton 
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                            />
                        </Fields>
                            <Button
                                title="Send"
                                onPress={handleSubmit(handleRegister)}
                            />
                    </Form>

                    <Modal visible={categoryModalOpen}>
                        <CategorySelect
                            category={category}
                            setCategory={setCategory}
                            closeSelectCategory={handleCloseSelectCategoryModal}
                        />
                    </Modal>
                </Container>
        </TouchableWithoutFeedback>
    </GestureHandlerRootView>
    )
}