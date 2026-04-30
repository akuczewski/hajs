import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { Briefcase, Activity, CheckCircle, Plus, CreditCard, Receipt, Smartphone } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useBudgetStore } from '../../store/useBudgetStore';

export default function CashflowScreen() {
  const { incomes, fixedExpenses, liabilities, toggleLiabilityPayment } = useBudgetStore();
  const [activeTab, setActiveTab] = useState<'INCOMES' | 'EXPENSES'>('INCOMES');
  
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Incomes setup
  const fixedIncomes = incomes.filter(i => i.isFixed);
  const variableIncomes = incomes.filter(i => !i.isFixed);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  // Expenses setup
  const totalExpenses = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 
                        liabilities.reduce((acc, curr) => acc + curr.monthlyPayment, 0);

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <View className="px-5 py-4 border-b border-zinc-800">
        <Text className="text-white text-2xl font-bold mb-4">Cashflow</Text>
        
        {/* Toggle / Segmented Control */}
        <View className="flex-row bg-[#1C1F22] rounded-xl p-1 border border-[#272A2E]">
          <TouchableOpacity 
            onPress={() => setActiveTab('INCOMES')}
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'INCOMES' ? 'bg-[#262A2E] shadow-sm' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'INCOMES' ? 'text-[#34D399]' : 'text-zinc-500'}`}>INCOMES</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('EXPENSES')}
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'EXPENSES' ? 'bg-[#262A2E] shadow-sm' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'EXPENSES' ? 'text-yellow-500' : 'text-zinc-500'}`}>EXPENSES</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        
        {activeTab === 'INCOMES' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-8 items-start">
              <Text className="text-zinc-400 font-medium mb-2">Total Monthly Income</Text>
              <Text className="text-[#34D399] text-5xl font-extrabold tracking-tighter">${totalIncome.toLocaleString()}</Text>
            </View>

            {/* Fixed Income */}
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">Fixed Income (Salary)</Text>
            {fixedIncomes.length === 0 && <Text className="text-zinc-600 mb-6 px-1">Brak stałych przychodów.</Text>}
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
            <View className="flex-row justify-between items-center mt-4 mb-3 px-1">
              <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Variable Income</Text>
              <TouchableOpacity><Plus color="#10B981" size={20} /></TouchableOpacity>
            </View>
            {variableIncomes.length === 0 && <Text className="text-zinc-600 mb-6 px-1">Brak zmiennych przychodów.</Text>}
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
          </View>
        )}

        {activeTab === 'EXPENSES' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-8 items-start">
              <Text className="text-zinc-400 font-medium mb-2">Total Monthly Expenses & Subs</Text>
              <Text className="text-yellow-500 text-5xl font-extrabold tracking-tighter">${totalExpenses.toLocaleString()}</Text>
            </View>

            {/* Subscriptions / Liabilities */}
            <View className="flex-row justify-between items-end mb-4 px-1">
              <Text className="text-white font-bold text-lg">Subscriptions & Debits</Text>
              <Text className="text-zinc-500 text-xs font-medium">Paid this Month</Text>
            </View>
            {liabilities.map(sub => {
              const isPaidThisMonth = sub.paymentHistory.includes(currentMonth);
              return (
                <View key={sub.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4 mb-3 flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-[#262A2E] p-2 rounded-xl mr-4">
                      <Receipt color="#8B5CF6" size={24} />
                    </View>
                    <View>
                      <Text className="text-white font-bold text-lg">{sub.name}</Text>
                      <Text className="text-zinc-500 text-xs">Monthly fee</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-white font-bold text-lg mr-4">${sub.monthlyPayment}</Text>
                    <Switch
                      value={isPaidThisMonth}
                      onValueChange={() => toggleLiabilityPayment(sub.id, currentMonth)}
                      trackColor={{ false: '#3F3F46', true: '#10B981' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              );
            })}
            {liabilities.length === 0 && <Text className="text-zinc-500 mb-6">Brak subskrypcji.</Text>}

            {/* Google Mockup */}
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mt-4 mb-8">
              <View className="flex-row items-center mb-3">
                <Smartphone color="#3B82F6" size={24} />
                <Text className="text-white font-bold text-lg ml-3">Google Account Integration</Text>
              </View>
              <Text className="text-zinc-400 text-sm mb-4 leading-5">
                Connect your Google account to automatically track new subscriptions and bills. 3 potential items found.
              </Text>
              <TouchableOpacity className="bg-[#3B82F6] rounded-xl py-3 items-center">
                <Text className="text-white font-bold">Connect Google Account</Text>
              </TouchableOpacity>
            </View>

            {/* Fixed Expenses */}
            <View className="flex-row justify-between items-center mt-2 mb-3 px-1">
              <Text className="text-white font-bold text-lg">Fixed Expenses</Text>
              <TouchableOpacity><Plus color="#3B82F6" size={20} /></TouchableOpacity>
            </View>
            {fixedExpenses.length === 0 && <Text className="text-zinc-600 mb-6 px-1">Brak stałych wydatków.</Text>}
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

          </View>
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
