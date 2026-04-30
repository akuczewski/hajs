import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useBudgetStore } from '../../store/useBudgetStore';
import { Wallet, TrendingUp, CreditCard, PieChart } from 'lucide-react-native';

export default function DashboardScreen() {
  const { accounts, incomes, fixedExpenses } = useBudgetStore();

  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalFixed = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const safeToSpend = totalIncome - totalFixed;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-5 pt-8">
        
        {/* Header - Net Worth */}
        <View className="mb-8 items-center mt-4">
          <Text className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-2">Twój Majątek Netto</Text>
          <Text className="text-white text-5xl font-bold tracking-tighter">
            {totalNetWorth.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} <Text className="text-2xl text-blue-400">PLN</Text>
          </Text>
        </View>

        {/* Szybkie Akcje */}
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity className="flex-1 bg-blue-600/20 border border-blue-500/30 rounded-2xl py-4 items-center flex-row justify-center space-x-2">
            <TrendingUp size={20} color="#60A5FA" />
            <Text className="text-blue-400 font-semibold ml-2">Przychód</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl py-4 items-center flex-row justify-center space-x-2">
            <CreditCard size={20} color="#A1A1AA" />
            <Text className="text-zinc-300 font-semibold ml-2">Wydatek</Text>
          </TouchableOpacity>
        </View>

        {/* Zero Based Budgeting Summary */}
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <View className="flex-row items-center mb-6">
            <PieChart size={24} color="#C084FC" />
            <Text className="text-white text-xl font-bold ml-3">Budżet na ten miesiąc</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-zinc-400 text-base">Przewidywane Przychody</Text>
            <Text className="text-emerald-400 font-bold text-lg">+{totalIncome.toLocaleString()} PLN</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-zinc-400 text-base">Wydatki & Zobowiązania</Text>
            <Text className="text-rose-400 font-bold text-lg">-{totalFixed.toLocaleString()} PLN</Text>
          </View>

          <View className="h-px bg-zinc-800 w-full mb-5" />

          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-white font-semibold text-lg">Do odłożenia</Text>
              <Text className="text-zinc-500 text-xs mt-1">Pay yourself first</Text>
            </View>
            <Text className="text-purple-400 text-3xl font-black">{safeToSpend.toLocaleString()} PLN</Text>
          </View>
        </View>

        {/* Konta */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-white text-xl font-bold">Moje Konta</Text>
          <TouchableOpacity>
            <Text className="text-blue-400 font-medium">Dodaj</Text>
          </TouchableOpacity>
        </View>

        {accounts.map(acc => (
          <TouchableOpacity key={acc.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-zinc-800 p-3 rounded-xl mr-4">
                <Wallet size={24} color="#A1A1AA" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">{acc.name}</Text>
                <Text className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{acc.type}</Text>
              </View>
            </View>
            <Text className="text-white font-black text-lg">{acc.balance.toLocaleString('pl-PL')} <Text className="text-zinc-500 text-sm">{acc.currency}</Text></Text>
          </TouchableOpacity>
        ))}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
