import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useBudgetStore } from '../../store/useBudgetStore';
import { PlusCircle, Wallet, Bitcoin, Gem, Landmark } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const accountsMock = [
  { id: '1', name: 'Bank Accounts', balance: '$850,000', icon: <Landmark color="#10B981" size={20} />, growth: '+20%' },
  { id: '2', name: 'Cash & Equivalents', balance: '$210,000', icon: <Wallet color="#10B981" size={20} />, growth: '+20%' },
  { id: '3', name: 'Crypto Holdings', balance: '$150,000', icon: <Bitcoin color="#F59E0B" size={20} />, growth: '+15%' },
  { id: '4', name: 'Precious Metals', balance: '$35,000', icon: <Gem color="#10B981" size={20} />, growth: '+5%' },
];

export default function DashboardScreen() {
  const { incomes, fixedExpenses } = useBudgetStore();

  // Mocked totals from design
  const totalIncome = 18500;
  const totalExpenses = 6200;
  
  const incomePercent = '85%';
  const expensesPercent = '30%';

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <ScrollView className="flex-1">
        {/* Header - Net Worth */}
        <View className="px-5 pt-8">
          <Text className="text-white text-3xl font-bold mb-1">Net Worth</Text>
          <Text className="text-[#34D399] text-6xl font-extrabold tracking-tighter mb-4">
            $1,245,000
          </Text>
        </View>

        {/* SVG Chart (Static Curve Mockup) */}
        <View className="h-40 w-full relative -mt-4">
          <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#34D399" stopOpacity="0.3" />
                <Stop offset="1" stopColor="#111315" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Path
              d="M0 60 Q 25 80, 50 40 T 100 30 L 100 100 L 0 100 Z"
              fill="url(#grad)"
            />
            <Path
              d="M0 60 Q 25 80, 50 40 T 100 30"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
            />
          </Svg>
          <Text className="absolute bottom-2 right-5 text-zinc-500 text-xs">Last 6 months</Text>
        </View>

        {/* Accounts Slider */}
        <View className="pl-5 mb-8">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={accountsMock}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-[#1C1F22] rounded-2xl p-4 mr-4 w-40 border border-[#272A2E]">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="bg-[#262A2E] p-2 rounded-lg">
                    {item.icon}
                  </View>
                  <View className="bg-[#10B981]/20 px-2 py-1 rounded-md">
                    <Text className="text-[#34D399] text-[10px] font-bold">{item.growth}</Text>
                  </View>
                </View>
                <Text className="text-zinc-400 text-xs font-medium mb-1">{item.name}</Text>
                <Text className="text-white text-xl font-bold">{item.balance}</Text>
              </View>
            )}
          />
        </View>

        {/* Monthly Summary */}
        <View className="px-5 mb-8">
          <Text className="text-white text-xl font-bold mb-5">Monthly Summary</Text>
          
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-zinc-400 font-medium">Total Income: ${totalIncome.toLocaleString()}</Text>
              <Text className="text-zinc-400 font-medium">{incomePercent}</Text>
            </View>
            <View className="h-3 w-full bg-[#1C1F22] rounded-full overflow-hidden">
              <View className="h-full bg-[#34D399] rounded-full" style={{ width: incomePercent }} />
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-zinc-400 font-medium">Total Expenses: ${totalExpenses.toLocaleString()}</Text>
              <Text className="text-zinc-400 font-medium">{expensesPercent}</Text>
            </View>
            <View className="h-3 w-full bg-[#1C1F22] rounded-full overflow-hidden">
              <View className="h-full bg-yellow-600 rounded-full" style={{ width: expensesPercent }} />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-[#10B981] rounded-xl py-4 items-center flex-row justify-center border border-[#059669]">
              <PlusCircle size={20} color="#022C22" />
              <Text className="text-[#022C22] font-bold text-base ml-2">Add Transaction</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-[#FBBF24] rounded-xl py-3 items-center border border-[#D97706] justify-center">
              <View className="flex-row items-center mb-0.5">
                <Wallet size={16} color="#451A03" />
                <Text className="text-[#451A03] font-bold text-base ml-2">Pay Yourself First</Text>
              </View>
              <Text className="text-[#78350F] text-[10px] font-bold">Suggested: $2,000</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
