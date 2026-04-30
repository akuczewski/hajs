import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Briefcase, Activity, CheckCircle, Plus, CreditCard } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useBudgetStore } from '../../store/useBudgetStore';

export default function CashflowScreen() {
  const { incomes, fixedExpenses } = useBudgetStore();
  
  const fixedIncomes = incomes.filter(i => i.isFixed);
  const variableIncomes = incomes.filter(i => !i.isFixed);
  
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <View className="px-5 py-4 flex-row justify-between items-center border-b border-zinc-800">
        <Text className="text-white text-xl font-bold">Cashflow</Text>
        <TouchableOpacity>
          <Text className="text-[#10B981] font-semibold text-base">Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {/* Total Box */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-8 items-start">
          <Text className="text-zinc-400 font-medium mb-2">Total Monthly Income</Text>
          <Text className="text-[#34D399] text-5xl font-extrabold tracking-tighter">${totalIncome.toLocaleString()}</Text>
        </View>

        {/* Fixed Income */}
        <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">Fixed Income (Salary)</Text>
        {fixedIncomes.length === 0 && (
          <Text className="text-zinc-600 mb-6 px-1">Brak stałych przychodów.</Text>
        )}
        {fixedIncomes.map(inc => (
          <View key={inc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Briefcase color="#10B981" size={24} />
              <Text className="text-white font-bold text-lg ml-3">{inc.name}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-lg mr-3">${inc.amount.toLocaleString()}</Text>
              <CheckCircle color="#10B981" size={20} />
            </View>
          </View>
        ))}

        {/* Variable Income */}
        <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-4 mb-3 px-1">Variable Income (Freelance, Bonus)</Text>
        {variableIncomes.length === 0 && (
          <Text className="text-zinc-600 mb-6 px-1">Brak zmiennych przychodów.</Text>
        )}
        {variableIncomes.map(inc => (
          <View key={inc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 relative overflow-hidden">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Activity color="#10B981" size={20} />
                <Text className="text-white font-bold text-lg ml-2">{inc.name}</Text>
              </View>
              <Text className="text-white font-bold text-lg">${inc.amount.toLocaleString()}</Text>
            </View>
            
            <View className="flex-row justify-between items-end">
              <View className="w-1/2 h-12">
                <Svg height="100%" width="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {/* Random path for mock - in reality we would map over history */}
                  <Path d="M0 30 L 20 10 L 40 35 L 60 5 L 80 20 L 100 0" fill="none" stroke="#34D399" strokeWidth="2" />
                </Svg>
                <Text className="text-zinc-600 text-[10px] mt-1">Last 5 Months</Text>
              </View>
              
              <View className="items-end mr-12">
                <Text className="text-zinc-400 text-xs font-medium">Calculated Average</Text>
                <Text className="text-[#34D399] font-bold text-lg">${inc.amount}/mo</Text>
              </View>
            </View>

            <TouchableOpacity className="absolute bottom-4 right-4 bg-[#34D399] p-3 rounded-full shadow-lg border border-[#059669]">
              <Plus color="#022C22" size={24} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Fixed Expenses */}
        <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-8 mb-3 px-1">Fixed Expenses</Text>
        {fixedExpenses.length === 0 && (
          <Text className="text-zinc-600 mb-6 px-1">Brak stałych wydatków.</Text>
        )}
        {fixedExpenses.map(exp => (
          <View key={exp.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <CreditCard color="#F87171" size={24} />
              <View className="ml-3">
                <Text className="text-white font-bold text-lg">{exp.name}</Text>
                <Text className="text-zinc-500 text-xs uppercase">{exp.category}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-lg">-${exp.amount.toLocaleString()}</Text>
            </View>
          </View>
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
