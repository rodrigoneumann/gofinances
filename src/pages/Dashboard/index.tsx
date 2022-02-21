import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container,
    Header,
    Photo,
    User,
    UserInfo,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList
    } from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {

    const data: DataListProps[] = [
        {
        id: '1',
        type: 'positive',
        title:'Website Development',
        amount:'£3000.00',
        date:'15/01/2022',
        category: {
            name: 'Sales',
            icon: 'dollar-sign'
        }},
        {
        id: '2',
        type: 'negative',
        title:'Lidl - food',
        amount:'£75.00',
        date:'02/02/2022',
        category: {
            name: 'Buy',
            icon: 'shopping-bag'
        }},
        {
        id: '3',
        type: 'positive',
        title:'Website Monthly Service',
        amount:'£250.00',
        date:'01/02/2022',
        category: {
            name: 'Service',
            icon: 'dollar-sign'
        }
    }]

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/6933796?v=4'}}/>
                        <User>
                            <UserGreeting>Hi,</UserGreeting>
                            <UserName>Rodrigo</UserName>
                        </User>
                    </UserInfo>
                    <Icon name='power'/>
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard
                    type="up" 
                    title="Income" 
                    amount="£1750.00" 
                    lastTransaction='April 24'/>
                <HighlightCard
                    type="down" 
                    title="Expense" 
                    amount="£1750.00" 
                    lastTransaction='April 24'/>                
                <HighlightCard
                    type="total" 
                    title="Balance" 
                    amount="£1750.00" 
                    lastTransaction='April 24'/>
            </HighlightCards>

            <Transactions>
                <Title>Transactions</Title>

                <TransactionsList 
                    data= {data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => 
                        <TransactionCard data={item} />}
                >

                </TransactionsList>
                
                
            </Transactions>
        </Container>
    )
}
