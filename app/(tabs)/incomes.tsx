import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { useBudgetStore } from '../../store/useBudgetStore';
import { PlusCircle, TrendingUp } from 'lucide-react-native';

export default function IncomesScreen() {
  const { incomes, addIncome } = useBudgetStore();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isFixed, setIsFixed] = useState(true);

  const handleAdd = () => {
    if (!name || !amount) return;
    addIncome({
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      isFixed,
      history: [],
      createdAt: new Date().toISOString()
    });
    setName('');
    setAmount('');
    setIsAdding(false);
  };

  // Logika średniej: jeśli stałe, to po prostu amount. Jeśli zmienne, w pełnej wersji byłaby średnia z historii.
  const getDisplayAmount = (income: any) => {
    if (income.isFixed || income.history.length === 0) return income.amount;
    const sum = income.history.reduce((a: number, b: any) => a + b.amount, 0);
    return sum / income.history.length;
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-5 pt-8">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Moduł</Text>
            <Text className="text-white text-3xl font-bold">Przychody</Text>
          </View>
          <TouchableOpacity onPress={() => setIsAdding(!isAdding)} className="bg-blue-600/20 p-3 rounded-full">
            <PlusCircle color="#60A5FA" size={24} />
          </TouchableOpacity>
        </View>

        {isAdding && (
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
            <Text className="text-white font-bold mb-4">Dodaj nowe źródło</Text>
            <TextInput
              placeholder="Nazwa (np. Wypłata UoP, Zlecenia)"
              placeholderTextColor="#71717A"
              className="bg-zinc-800 text-white p-4 rounded-xl mb-3"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Kwota (PLN)"
              placeholderTextColor="#71717A"
              keyboardType="numeric"
              className="bg-zinc-800 text-white p-4 rounded-xl mb-4"
              value={amount}
              onChangeText={setAmount}
            />
            <View className="flex-row justify-between items-center mb-6 px-1">
              <Text className="text-zinc-300 font-medium">Stały przychód?</Text>
              <Switch
                value={isFixed}
                onValueChange={setIsFixed}
                trackColor={{ false: '#3F3F46', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <TouchableOpacity onPress={handleAdd} className="bg-blue-600 rounded-xl py-4 items-center">
              <Text className="text-white font-bold text-lg">Zapisz</Text>
            </TouchableOpacity>
          </View>
        )}

        {incomes.length === 0 && !isAdding && (
          <Text className="text-zinc-500 text-center mt-10">Brak przychodów. Dodaj pierwsze źródło.</Text>
        )}

        {incomes.map(inc => (
          <View key={inc.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-3 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-blue-900/30 p-3 rounded-xl mr-4">
                <TrendingUp size={24} color="#60A5FA" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">{inc.name}</Text>
                <Text className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                  {inc.isFixed ? 'STAŁY' : 'ZMIENNY'}
                </Text>
              </View>
            </View>
            <Text className="text-emerald-400 font-black text-lg">+{getDisplayAmount(inc).toLocaleString()} <Text className="text-zinc-500 text-sm">PLN</Text></Text>
          </View>
        ))}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
