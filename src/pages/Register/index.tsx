import React, { useState } from "react";
import { Keyboard,
         Modal,
         TouchableWithoutFeedback,
         Alert
} from 'react-native'

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form' 

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

    const { 
        control,
        handleSubmit,
        formState : { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeButtonSelect(type: 'up' | 'down') {
        setTransactionType(type)
    }
    
    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }
    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    function handleRegister(form: FormData) {
        if (!transactionType)
            return Alert.alert('Select transaction type')
        if (category.key === 'category')
            return Alert.alert('Select Category')

        const data = {
            name: form.name,
            amount: form.amount,
            category: category.key,
            transactionType
        }
        console.log(data)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                onPress={() => handleTransactionTypeButtonSelect('up')}
                                isActive={transactionType === 'up'}
                            />
                            <TransactionTypeButton 
                                type='down'
                                title='Outcome'
                                onPress={() => handleTransactionTypeButtonSelect('down')}
                                isActive={transactionType === 'down'}
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
    )
}