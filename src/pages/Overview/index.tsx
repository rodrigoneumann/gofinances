import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { VictoryPie } from 'victory-native'
import { RFValue } from "react-native-responsive-fontsize";
import { addMonths, format, subMonths } from "date-fns"

import { 
    Container, 
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectIcon,
    MonthSelectButton,
    Month,
    LoadContainer
} from "./styles"

import { useFocusEffect } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useTheme } from "styled-components"
import { useAuth } from "../../hooks/auth";

import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import theme from "../../global/styles/theme";


interface TransactionDataProps {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string,
    name: string,
    total: number,
    totalFormatted: string,
    color: string;
    percentage: string;
}


export function Overview() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const [selectedDate, setSelectDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false)

    const theme = useTheme();

    const { user } = useAuth();

    function handleDateChange( action: 'next' | 'prev') {
        if(action === 'next') {
            setSelectDate(addMonths(selectedDate, 1));            
        } else {
            setSelectDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = `@gofinances:transactions_user:${user.id}`
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expenses = responseFormatted.filter( 
            (expenses: TransactionDataProps) => 
            expenses.type === 'negative' &&
            new Date(expenses.date).getMonth() === selectedDate.getMonth() &&
            new Date(expenses.date).getFullYear() === selectedDate.getFullYear()
            
            );

        const expensesTotal = expenses.reduce( (accumulator: number , expense: TransactionDataProps) => {
            return accumulator + Number(expense.amount);
        }, 0);

        

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expenses.forEach( (expense: TransactionDataProps) => {
                if(expense.category === category.key) {
                    (categorySum) += Number(expense.amount)
                }
            })

            if( categorySum > 0){
                const totalFormatted = categorySum.toLocaleString('en-GB', {
                    style: 'currency',
                    currency: 'GBP'
                })

                const percentage = `${(categorySum / expensesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percentage
                });
            }
        })
        setTotalByCategories(totalByCategory);
        setIsLoading(false);
        
    }

    useFocusEffect(useCallback(() => {
        loadData()
    }, [selectedDate]));
    

    return(
    <Container>
        <Header>
            <Title>Report by category</Title>
        </Header>
        { 
        isLoading ? 
        <LoadContainer>
            <ActivityIndicator 
                color={theme.colors.primary}
                size="large"
            />
        </LoadContainer> : 

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight()
                }}
            >
                <MonthSelect>
                    <MonthSelectButton onPress={() => handleDateChange('prev')}>
                        <MonthSelectIcon name="chevron-left" />
                    </MonthSelectButton>

                    <Month>{format(selectedDate, 'MMMM, yyyy')}</Month>

                    <MonthSelectButton onPress={() => handleDateChange('next')}>
                        <MonthSelectIcon name="chevron-right" />
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}

                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape
                            }
                        }}
                        labelRadius={50}
                        x="percentage"
                        y="total" />
                </ChartContainer>
                {totalByCategories.map(item => (
                    <HistoryCard
                        key={item.key}
                        title={item.name}
                        amount={item.totalFormatted}
                        color={item.color} />
                ))}
            </Content>
        }
    </Container>
    )
}