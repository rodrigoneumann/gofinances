import React, { useState } from "react";
import { Modal } from 'react-native'
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
    } = useForm();

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
        const data = {
            name: form.name,
            amount: form.amount,
            category: category.key,
            transactionType
        }
        console.log(data)
    }

    return (
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
                    />
                    <InputForm 
                        name="amount"
                        control={control}
                        placeholder="Price"
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
    )
}