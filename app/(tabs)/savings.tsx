import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useBudgetStore } from '../../store/useBudgetStore';
import { PiggyBank, Target, Plus, ShieldCheck, Car, Plane } from 'lucide-react-native';

const iconMap: Record<string, JSX.Element> = {
  'Car': <Car color="#10B981" size={24} />,
  'Shield': <ShieldCheck color="#3B82F6" size={24} />,
  'Plane': <Plane color="#F59E0B" size={24} />,
  'Default': <Target color="#8B5CF6" size={24} />
};

export default function SavingsScreen() {
  const { sinkingFunds, addSinkingFund } = useBudgetStore();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const totalSaved = sinkingFunds.reduce((acc, curr) => acc + curr.savedAmount, 0);
  const totalTarget = sinkingFunds.reduce((acc, curr) => acc + curr.targetAmount, 0);

  const handleAdd = () => {
    if (!name || !target || !deadline) return;
    addSinkingFund({
      id: Date.now().toString(),
      name,
      targetAmount: parseFloat(target),
      deadline,
      savedAmount: 0,
      createdAt: new Date().toISOString()
    });
    setName('');
    setTarget('');
    setDeadline('');
    setIsAdding(false);
  };

  const calculateMonthly = (targetAmount: number, savedAmount: number, deadline: string) => {
    // Uproszczona kalkulacja dla MVP (zakłada formę "YYYY-MM")
    // W pełnej wersji trzeba wyliczyć różnicę w miesiącach między aktualną datą a deadline
    const remaining = targetAmount - savedAmount;
    // Przyjmijmy 12 miesięcy dla mocku MVP jeśli nie ma dobrej walidacji daty
    return remaining > 0 ? remaining / 12 : 0; 
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <View className="px-5 py-4 flex-row justify-between items-center border-b border-zinc-800">
        <Text className="text-white text-xl font-bold">Sinking Funds</Text>
        <TouchableOpacity onPress={() => setIsAdding(!isAdding)}>
          <Plus color="#10B981" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        
        {/* Total Summary Box */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-8 flex-row items-center justify-between">
          <View>
            <Text className="text-zinc-400 font-medium mb-1">Total Savings</Text>
            <Text className="text-[#34D399] text-4xl font-extrabold tracking-tighter">${totalSaved.toLocaleString()}</Text>
            <Text className="text-zinc-500 text-xs mt-1">Goal: ${totalTarget.toLocaleString()}</Text>
          </View>
          <View className="bg-[#262A2E] p-4 rounded-full border border-zinc-700">
            <PiggyBank color="#34D399" size={32} />
          </View>
        </View>

        {isAdding && (
          <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
            <Text className="text-white font-bold mb-4">Create New Fund</Text>
            <TextInput
              placeholder="Goal Name (e.g., Car Insurance)"
              placeholderTextColor="#71717A"
              className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Target Amount ($)"
              placeholderTextColor="#71717A"
              keyboardType="numeric"
              className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
              value={target}
              onChangeText={setTarget}
            />
            <TextInput
              placeholder="Deadline (e.g. 2024-12)"
              placeholderTextColor="#71717A"
              className="bg-[#262A2E] text-white p-4 rounded-xl mb-5"
              value={deadline}
              onChangeText={setDeadline}
            />
            <TouchableOpacity onPress={handleAdd} className="bg-[#10B981] rounded-xl py-4 items-center">
              <Text className="text-[#022C22] font-bold text-lg">Save Fund</Text>
            </TouchableOpacity>
          </View>
        )}

        {sinkingFunds.length === 0 && !isAdding && (
          <Text className="text-zinc-500 text-center mt-10">Brak celów rocznych. Kliknij + aby dodać nową skarbonkę.</Text>
        )}

        {sinkingFunds.map(fund => {
          const progressPercent = Math.min((fund.savedAmount / fund.targetAmount) * 100, 100);
          const monthlyRequired = calculateMonthly(fund.targetAmount, fund.savedAmount, fund.deadline);

          return (
            <View key={fund.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-4">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center">
                  <View className="bg-[#262A2E] p-3 rounded-xl mr-4">
                    {iconMap['Default']}
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">{fund.name}</Text>
                    <Text className="text-zinc-500 text-xs">Deadline: {fund.deadline}</Text>
                  </View>
                </View>
                <View className="bg-[#34D399]/20 px-2 py-1 rounded-md">
                  <Text className="text-[#34D399] text-[10px] font-bold">In progress</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-white font-bold">${fund.savedAmount.toLocaleString()}</Text>
                  <Text className="text-zinc-500 font-medium">of ${fund.targetAmount.toLocaleString()}</Text>
                </View>
                <View className="h-2 w-full bg-[#262A2E] rounded-full overflow-hidden">
                  <View className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${progressPercent}%` }} />
                </View>
              </View>

              <View className="flex-row justify-between items-center bg-[#111315] p-3 rounded-xl border border-[#272A2E]">
                <Text className="text-zinc-400 text-xs">Monthly to save</Text>
                <Text className="text-white font-bold">${monthlyRequired.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
