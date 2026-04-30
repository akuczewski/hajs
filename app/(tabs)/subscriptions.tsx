import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { Settings, Smartphone, Receipt, Plus } from 'lucide-react-native';
import { useBudgetStore } from '../../store/useBudgetStore';

export default function SubscriptionsScreen() {
  const { liabilities, toggleLiabilityPayment, addLiability } = useBudgetStore();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7); // np. '2023-10'

  const totalSubs = liabilities.reduce((acc, curr) => acc + curr.monthlyPayment, 0);

  const handleAdd = () => {
    if (!name || !amount) return;
    addLiability({
      id: Date.now().toString(),
      name,
      type: 'SUBSCRIPTION',
      monthlyPayment: parseFloat(amount),
      paymentHistory: [],
      createdAt: new Date().toISOString()
    });
    setName('');
    setAmount('');
    setIsAdding(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <View className="px-5 py-4 flex-row justify-between items-center border-b border-zinc-800">
        <Text className="text-white text-xl font-bold">Subscriptions & Debits</Text>
        <TouchableOpacity onPress={() => setIsAdding(!isAdding)}>
          <Plus color="#3B82F6" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {/* Total Box */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-8 items-center">
          <Text className="text-zinc-400 font-medium mb-2">Total Monthly Subscriptions</Text>
          <Text className="text-white text-5xl font-extrabold tracking-tighter mb-2">${totalSubs.toLocaleString()}</Text>
          <Text className="text-zinc-500 text-sm">Based on {liabilities.length} active items</Text>
        </View>

        {isAdding && (
          <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
            <Text className="text-white font-bold mb-4">Add Subscription / Debit</Text>
            <TextInput
              placeholder="Name (e.g., Netflix)"
              placeholderTextColor="#71717A"
              className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Monthly Payment ($)"
              placeholderTextColor="#71717A"
              keyboardType="numeric"
              className="bg-[#262A2E] text-white p-4 rounded-xl mb-5"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity onPress={handleAdd} className="bg-[#3B82F6] rounded-xl py-4 items-center">
              <Text className="text-white font-bold text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* List Header */}
        <View className="flex-row justify-between items-end mb-4 px-1">
          <Text className="text-white font-bold text-lg">Active Subscriptions</Text>
          <Text className="text-zinc-500 text-xs font-medium">Paid this Month</Text>
        </View>

        {/* List Items */}
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

        {liabilities.length === 0 && !isAdding && (
          <Text className="text-zinc-500 text-center mb-6 mt-4">Brak subskrypcji. Kliknij + aby dodać.</Text>
        )}

        {/* Google Mockup */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mt-6 mb-10">
          <View className="flex-row items-center mb-3">
            <Smartphone color="#3B82F6" size={24} />
            <Text className="text-white font-bold text-lg ml-3">Google Account Integration</Text>
          </View>
          <Text className="text-white font-bold mb-1">Detected Subscriptions</Text>
          <Text className="text-zinc-400 text-sm mb-5 leading-5">
            Connect your Google account to automatically track new subscriptions and bills. 3 potential items found.
          </Text>
          <TouchableOpacity className="bg-[#3B82F6] rounded-xl py-4 items-center">
            <Text className="text-white font-bold text-lg">Connect Google Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
