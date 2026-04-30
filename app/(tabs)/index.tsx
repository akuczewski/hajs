import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useBudgetStore, CURRENCY_SYMBOLS } from '../../store/useBudgetStore';
import { Wallet, Bitcoin, Landmark, CheckCircle, Circle, ArrowRight, ShieldCheck, Banknote, Coins, LineChart } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { AccountType } from '../../store/types';

const accountIconMap: Record<AccountType, JSX.Element> = {
  'BANK': <Landmark color="#3B82F6" size={20} />,
  'DEPOSIT': <ShieldCheck color="#8B5CF6" size={20} />,
  'CASH': <Banknote color="#10B981" size={20} />,
  'CRYPTO': <Bitcoin color="#F59E0B" size={20} />,
  'PRECIOUS_METAL': <Coins color="#EAB308" size={20} />,
  'BONDS': <Wallet color="#9CA3AF" size={20} />,
  'STOCKS': <LineChart color="#EC4899" size={20} />
};

export default function DashboardScreen() {
  const { incomes, fixedExpenses, accounts, liabilities, toggleLiabilityPayment, toggleFixedExpensePayment, currency } = useBudgetStore();
  const symbol = CURRENCY_SYMBOLS[currency] || 'zł';

  const currentMonth = new Date().toISOString().slice(0, 7);

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  // Zbudowanie miesięcznej listy zadań (Monthly Checklist)
  const checklistItems = [
    ...fixedExpenses.map(exp => ({
      id: exp.id,
      kind: 'FIXED',
      name: exp.name,
      amount: exp.amount,
      isPaid: exp.paymentHistory?.includes(currentMonth) || false
    })),
    ...liabilities.map(lib => ({
      id: lib.id,
      kind: 'LIABILITY',
      name: lib.name,
      amount: lib.monthlyPayment,
      isPaid: lib.paymentHistory?.includes(currentMonth) || false
    }))
  ];

  const paidItemsCount = checklistItems.filter(item => item.isPaid).length;
  const totalItemsCount = checklistItems.length;
  const progressPercent = totalItemsCount > 0 ? (paidItemsCount / totalItemsCount) * 100 : 0;

  const totalMonthlyObligations = checklistItems.reduce((acc, curr) => acc + curr.amount, 0);
  const safeToSpend = totalIncome > totalMonthlyObligations ? totalIncome - totalMonthlyObligations : 0;

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="pt-6">
        
        {/* Header - Net Worth */}
        <View className="px-5 mb-2">
          <Text className="text-zinc-400 font-medium text-sm mb-1 uppercase tracking-widest">Twoje Całkowite Net Worth</Text>
          <Text className="text-[#34D399] text-5xl font-extrabold tracking-tighter">
            {symbol}{totalNetWorth.toLocaleString()}
          </Text>
        </View>

        {/* SVG Chart (Decorative) */}
        <View className="h-32 w-full relative -mt-2">
          <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#34D399" stopOpacity="0.2" />
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
        </View>

        {/* Action Buttons: Pay Yourself First */}
        <View className="px-5 mb-8 -mt-2">
          <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-bold text-lg">Zapłać sobie najpierw 👑</Text>
              <Wallet color="#F59E0B" size={24} />
            </View>
            <Text className="text-zinc-400 text-sm mb-4">Po opłaceniu wszystkich stałych rachunków, do dyspozycji pozostaje Ci kwota, którą możesz przelać na Sinking Funds.</Text>
            <View className="bg-[#111315] p-4 rounded-2xl flex-row justify-between items-center border border-[#272A2E]">
              <Text className="text-zinc-500 font-bold">Wolne środki:</Text>
              <Text className="text-[#F59E0B] font-extrabold text-2xl">{symbol}{safeToSpend.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Monthly Checklist */}
        <View className="px-5 mb-8">
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-white text-xl font-bold mb-1">Do opłacenia w tym miesiącu</Text>
              <Text className="text-zinc-500 text-xs">Oznacz jako zapłacone, aby mieć spokój.</Text>
            </View>
            <Text className="text-[#34D399] font-bold">{paidItemsCount} / {totalItemsCount}</Text>
          </View>

          {/* Progress bar */}
          <View className="h-2 w-full bg-[#1C1F22] rounded-full overflow-hidden mb-5">
            <View className="h-full bg-[#34D399] rounded-full" style={{ width: `${progressPercent}%` }} />
          </View>

          {checklistItems.length === 0 ? (
            <Text className="text-zinc-600 text-center my-4">Brak rachunków w tym miesiącu!</Text>
          ) : (
            checklistItems.map(item => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => {
                  if (item.kind === 'FIXED') toggleFixedExpensePayment(item.id, currentMonth);
                  else toggleLiabilityPayment(item.id, currentMonth);
                }}
                className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${item.isPaid ? 'bg-[#1C1F22] border-[#272A2E]' : 'bg-[#262A2E] border-[#3F3F46]'}`}
              >
                <View className="flex-row items-center">
                  {item.isPaid ? (
                    <CheckCircle color="#34D399" size={24} />
                  ) : (
                    <Circle color="#71717A" size={24} />
                  )}
                  <Text className={`font-bold text-base ml-3 ${item.isPaid ? 'text-zinc-500 line-through' : 'text-white'}`}>
                    {item.name}
                  </Text>
                </View>
                <Text className={`font-bold ${item.isPaid ? 'text-zinc-500 line-through' : 'text-yellow-500'}`}>
                  {symbol}{item.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Read-Only Accounts Slider */}
        <View className="mb-8 pl-5">
          <View className="flex-row justify-between items-center pr-5 mb-4">
            <Text className="text-white text-lg font-bold">Twoje Aktywa</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-zinc-500 text-xs font-bold mr-1">Więcej</Text>
              <ArrowRight color="#71717A" size={14} />
            </TouchableOpacity>
          </View>

          {accounts.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={accounts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="bg-[#1C1F22] rounded-2xl p-4 mr-4 w-40 border border-[#272A2E]">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="bg-[#262A2E] p-2 rounded-lg">
                      {accountIconMap[item.type] || <Landmark color="#3B82F6" size={20} />}
                    </View>
                  </View>
                  <Text className="text-zinc-400 text-xs font-medium mb-1" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-white text-xl font-bold">{symbol}{item.balance.toLocaleString()}</Text>
                </View>
              )}
            />
          ) : (
            <Text className="text-zinc-500 italic pr-5">Nie dodano jeszcze żadnych aktywów. Przejdź do zakładki Savings.</Text>
          )}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
