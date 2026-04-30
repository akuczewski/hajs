import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useBudgetStore } from '../../store/useBudgetStore';
import { PlusCircle, CreditCard } from 'lucide-react-native';

export default function ExpensesScreen() {
  const { fixedExpenses, addFixedExpense } = useBudgetStore();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleAdd = () => {
    if (!name || !amount) return;
    addFixedExpense({
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      category: category || 'Ogólne',
      createdAt: new Date().toISOString()
    });
    setName('');
    setAmount('');
    setCategory('');
    setIsAdding(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-5 pt-8">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Moduł</Text>
            <Text className="text-white text-3xl font-bold">Wydatki Stałe</Text>
          </View>
          <TouchableOpacity onPress={() => setIsAdding(!isAdding)} className="bg-rose-600/20 p-3 rounded-full">
            <PlusCircle color="#FB7185" size={24} />
          </TouchableOpacity>
        </View>

        {isAdding && (
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
            <Text className="text-white font-bold mb-4">Dodaj stały wydatek</Text>
            <TextInput
              placeholder="Nazwa (np. Czynsz, Prąd)"
              placeholderTextColor="#71717A"
              className="bg-zinc-800 text-white p-4 rounded-xl mb-3"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Kategoria (np. Dom)"
              placeholderTextColor="#71717A"
              className="bg-zinc-800 text-white p-4 rounded-xl mb-3"
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              placeholder="Kwota (PLN)"
              placeholderTextColor="#71717A"
              keyboardType="numeric"
              className="bg-zinc-800 text-white p-4 rounded-xl mb-6"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity onPress={handleAdd} className="bg-rose-600 rounded-xl py-4 items-center">
              <Text className="text-white font-bold text-lg">Zapisz</Text>
            </TouchableOpacity>
          </View>
        )}

        {fixedExpenses.length === 0 && !isAdding && (
          <Text className="text-zinc-500 text-center mt-10">Brak wydatków. Dodaj pierwszy wydatek.</Text>
        )}

        {fixedExpenses.map(exp => (
          <View key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-3 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-rose-900/30 p-3 rounded-xl mr-4">
                <CreditCard size={24} color="#FB7185" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">{exp.name}</Text>
                <Text className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                  {exp.category}
                </Text>
              </View>
            </View>
            <Text className="text-rose-400 font-black text-lg">-{exp.amount.toLocaleString()} <Text className="text-zinc-500 text-sm">PLN</Text></Text>
          </View>
        ))}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
