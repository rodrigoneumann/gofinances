import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useTheme } from 'styled-components'
import { useFocusEffect } from '@react-navigation/native'

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
    TransactionsList,
    LogoutButton,
    LoadContainer
    } from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLighProps {
    amount: string;
    lastTransaction: string;
}
interface HightLightData {
    earnings: HighLighProps;
    expenses: HighLighProps;
    total: HighLighProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highLightData, setHighlightData] = useState<HightLightData>({} as HightLightData);

    const theme = useTheme();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ) {
        const lastTransaction = new Date(Math.max.apply( Math, collection
            .filter(
            transaction => transaction.type === type)
            .map(
            transaction => new Date(transaction.date).getTime())))
        
        return `${lastTransaction.getDate()} ${lastTransaction.toLocaleString('en-GB', {month:'long'})}`;
    }

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey)
        const transactions = response ? JSON.parse(response) : [];

        let earningsTotal = 0;
        let expensesTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {

                if (item.type === 'positive') {
                    earningsTotal += Number(item.amount)
                } else {
                    expensesTotal += Number(item.amount)
                }

                const amount = Number(item.amount)
                .toLocaleString('en-GB',{
                    style: 'currency',
                    currency: 'GBP'
                });

                const date = Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            }
        );

        setTransactions(transactionsFormatted);

        const lastEarnings = getLastTransactionDate(transactions, "positive");
        const lastExpenses = getLastTransactionDate(transactions, "negative");
        const totalInterval = `01 to ${lastExpenses}`;
        
        const total = earningsTotal - expensesTotal;

        setHighlightData({
            earnings: {
                amount: earningsTotal.toLocaleString('en-GB', {
                    style: 'currency',
                    currency: 'GBP'
                }),
                lastTransaction: `Last transaction ${lastEarnings}`
            },
            expenses: {
                amount: expensesTotal.toLocaleString('en-GB', {
                    style: 'currency',
                    currency: 'GBP'
                }),
                lastTransaction: `Last transaction ${lastExpenses}`
            },
            total: {
                amount: total.toLocaleString('en-GB', {
                    style: 'currency',
                    currency: 'GBP'
                }),
                lastTransaction: totalInterval
            }
        });
        setIsLoading(false);
    }

    useEffect(() => {
        // const dataKey = '@gofinances:transactions';
        // AsyncStorage.removeItem(dataKey)
        loadTransactions()
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            {
                isLoading ? 
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> : 
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo source={{uri: 'https://avatars.githubusercontent.com/u/6933796?v=4'}}/>
                                <User>
                                    <UserGreeting>Hi,</UserGreeting>
                                    <UserName>Rodrigo</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton>
                                <Icon name='power'/>
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards>
                        <HighlightCard
                            type="up" 
                            title="Income" 
                            amount={highLightData.earnings.amount} 
                            lastTransaction={highLightData.earnings.lastTransaction}/>
                        <HighlightCard
                            type="down" 
                            title="Expense" 
                            amount={highLightData.expenses.amount} 
                            lastTransaction={highLightData.expenses.lastTransaction}/>                
                        <HighlightCard
                            type="total" 
                            title="Balance" 
                            amount={highLightData.total.amount} 
                            lastTransaction={highLightData.total.lastTransaction}/>
                    </HighlightCards>

                    <Transactions>
                        <Title>Transactions</Title>

                        <TransactionsList 
                            data= {transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => 
                                <TransactionCard data={item} />}
                        >

                        </TransactionsList>
                        
                        
                    </Transactions>
                </>
            }   
        </Container>
    )
}


