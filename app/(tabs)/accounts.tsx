import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useBudgetStore } from '../../store/useBudgetStore';
import { Landmark, Wallet, Plus, CreditCard, Bitcoin, Gem } from 'lucide-react-native';
import { AccountType } from '../../store/types';

const typeIcons: Record<AccountType, JSX.Element> = {
  'BANK': <Landmark color="#3B82F6" size={24} />,
  'CASH': <Wallet color="#10B981" size={24} />,
  'VIRTUAL': <CreditCard color="#8B5CF6" size={24} />,
  'CRYPTO': <Bitcoin color="#F59E0B" size={24} />,
  'PRECIOUS_METAL': <Gem color="#F43F5E" size={24} />
};

export default function AccountsScreen() {
  const { accounts, addAccount } = useBudgetStore();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<AccountType>('BANK');

  const handleAdd = () => {
    if (!name || !balance) return;
    addAccount({
      id: Date.now().toString(),
      name,
      type,
      balance: parseFloat(balance),
      currency: 'PLN', // Domyślnie
      createdAt: new Date().toISOString()
    });
    setName('');
    setBalance('');
    setIsAdding(false);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <View className="px-5 py-4 flex-row justify-between items-center border-b border-zinc-800">
        <Text className="text-white text-xl font-bold">Accounts</Text>
        <TouchableOpacity onPress={() => setIsAdding(!isAdding)}>
          <Plus color="#3B82F6" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        
        {/* Total Box */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-8 items-center">
          <Text className="text-zinc-400 font-medium mb-2">Total Balance (PLN)</Text>
          <Text className="text-white text-4xl font-extrabold tracking-tighter">${totalBalance.toLocaleString()}</Text>
        </View>

        {isAdding && (
          <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
            <Text className="text-white font-bold mb-4">Add New Account</Text>
            <TextInput
              placeholder="Account Name (e.g. mBank)"
              placeholderTextColor="#71717A"
              className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Balance"
              placeholderTextColor="#71717A"
              keyboardType="numeric"
              className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
              value={balance}
              onChangeText={setBalance}
            />
            
            <Text className="text-zinc-400 text-xs mb-2 ml-1">Account Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
              {(['BANK', 'CASH', 'VIRTUAL', 'CRYPTO', 'PRECIOUS_METAL'] as AccountType[]).map((t) => (
                <TouchableOpacity 
                  key={t}
                  onPress={() => setType(t)}
                  className={`px-4 py-2 rounded-lg border mr-2 ${type === t ? 'bg-[#3B82F6]/20 border-[#3B82F6]' : 'bg-[#262A2E] border-transparent'}`}
                >
                  <Text className={type === t ? 'text-[#3B82F6] font-bold' : 'text-zinc-400'}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={handleAdd} className="bg-[#3B82F6] rounded-xl py-4 items-center">
              <Text className="text-white font-bold text-lg">Save Account</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-white font-bold text-lg mb-4 px-1">Your Accounts</Text>
        
        {accounts.map(acc => (
          <View key={acc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4 mb-3 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-[#262A2E] p-3 rounded-xl mr-4">
                {typeIcons[acc.type]}
              </View>
              <View>
                <Text className="text-white font-bold text-lg">{acc.name}</Text>
                <Text className="text-zinc-500 text-xs font-medium">{acc.type}</Text>
              </View>
            </View>
            <Text className="text-white font-black text-lg">${acc.balance.toLocaleString()}</Text>
          </View>
        ))}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
