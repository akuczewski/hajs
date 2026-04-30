import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useBudgetStore } from '../../store/useBudgetStore';
import { PiggyBank, Target, Plus, ShieldCheck, Car, Plane, Wallet, Landmark, Banknote, Bitcoin, LineChart, Coins, Trash2 } from 'lucide-react-native';
import { AccountType } from '../../store/types';
import Svg, { Path } from 'react-native-svg';

const accountIconMap: Record<AccountType, JSX.Element> = {
  'BANK': <Landmark color="#3B82F6" size={24} />,
  'DEPOSIT': <ShieldCheck color="#8B5CF6" size={24} />,
  'CASH': <Banknote color="#10B981" size={24} />,
  'CRYPTO': <Bitcoin color="#F59E0B" size={24} />,
  'PRECIOUS_METAL': <Coins color="#EAB308" size={24} />,
  'BONDS': <Wallet color="#9CA3AF" size={24} />,
  'STOCKS': <LineChart color="#EC4899" size={24} />
};

const accountTypeLabels: Record<AccountType, string> = {
  'BANK': 'Konto Bankowe',
  'DEPOSIT': 'Lokata',
  'CASH': 'Gotówka',
  'CRYPTO': 'Kryptowaluty (BTC)',
  'PRECIOUS_METAL': 'Złoto / Kruszce',
  'BONDS': 'Obligacje',
  'STOCKS': 'Akcje / ETF'
};

const iconMap: Record<string, JSX.Element> = {
  'Car': <Car color="#10B981" size={24} />,
  'Shield': <ShieldCheck color="#3B82F6" size={24} />,
  'Plane': <Plane color="#F59E0B" size={24} />,
  'Default': <Target color="#8B5CF6" size={24} />
};

export default function SavingsScreen() {
  const { sinkingFunds, addSinkingFund, accounts, addAccount, deleteAccount } = useBudgetStore();
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'GOALS'>('ASSETS');

  // Goals State
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Assets State
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetAmount, setAssetAmount] = useState('');
  const [assetType, setAssetType] = useState<AccountType>('BANK');

  const totalSaved = sinkingFunds.reduce((acc, curr) => acc + curr.savedAmount, 0);
  const totalTarget = sinkingFunds.reduce((acc, curr) => acc + curr.targetAmount, 0);
  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const handleAddGoal = () => {
    if (!goalName || !goalTarget || !goalDeadline) return;
    addSinkingFund({
      id: Date.now().toString(),
      name: goalName,
      targetAmount: parseFloat(goalTarget),
      deadline: goalDeadline,
      savedAmount: 0,
      createdAt: new Date().toISOString()
    });
    setGoalName('');
    setGoalTarget('');
    setGoalDeadline('');
    setIsAddingGoal(false);
  };

  const handleAddAsset = () => {
    if (!assetName || !assetAmount) return;
    addAccount({
      id: Date.now().toString(),
      name: assetName,
      type: assetType,
      balance: parseFloat(assetAmount),
      currency: 'PLN',
      createdAt: new Date().toISOString()
    });
    setAssetName('');
    setAssetAmount('');
    setIsAddingAsset(false);
  };

  const calculateMonthly = (targetAmount: number, savedAmount: number, deadline: string) => {
    const remaining = targetAmount - savedAmount;
    return remaining > 0 ? remaining / 12 : 0; 
  };

  return (
    <View className="flex-1 bg-[#111315] pt-12">
      <View className="px-5 py-4 border-b border-zinc-800">
        <Text className="text-white text-2xl font-bold mb-4">Savings & Assets</Text>
        
        <View className="flex-row bg-[#1C1F22] rounded-xl p-1 border border-[#272A2E]">
          <TouchableOpacity 
            onPress={() => setActiveTab('ASSETS')}
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'ASSETS' ? 'bg-[#262A2E]' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'ASSETS' ? 'text-[#3B82F6]' : 'text-zinc-500'}`}>ASSETS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('GOALS')}
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'GOALS' ? 'bg-[#262A2E]' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'GOALS' ? 'text-[#34D399]' : 'text-zinc-500'}`}>GOALS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        
        {activeTab === 'ASSETS' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 items-start">
              <Text className="text-zinc-400 font-medium mb-2">Total Net Worth</Text>
              <Text className="text-[#3B82F6] text-5xl font-extrabold tracking-tighter">${totalNetWorth.toLocaleString()}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => setIsAddingAsset(!isAddingAsset)}
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
              className="border border-[#3B82F6] rounded-2xl py-4 flex-row justify-center items-center mb-6"
            >
              <Plus color="#3B82F6" size={20} />
              <Text className="text-[#3B82F6] font-bold ml-2">Dodaj nowe Aktywo / Konto</Text>
            </TouchableOpacity>

            {isAddingAsset && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
                <Text className="text-white font-bold mb-4">Nowe Aktywo</Text>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  {(Object.keys(accountIconMap) as AccountType[]).map(type => (
                    <TouchableOpacity 
                      key={type}
                      onPress={() => setAssetType(type)}
                      className={`mr-3 py-2 px-4 rounded-xl border flex-row items-center ${assetType === type ? 'bg-[#3B82F6]/20 border-[#3B82F6]' : 'bg-[#262A2E] border-[#272A2E]'}`}
                    >
                      {accountIconMap[type]}
                      <Text className={`ml-2 text-xs font-bold ${assetType === type ? 'text-[#3B82F6]' : 'text-white'}`}>
                        {accountTypeLabels[type]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TextInput
                  placeholder="Nazwa (np. mBank, Portfel BTC, Lokata 5%)"
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={assetName}
                  onChangeText={setAssetName}
                />
                <TextInput
                  placeholder="Aktualna wartość ($)"
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-5"
                  value={assetAmount}
                  onChangeText={setAssetAmount}
                />
                <TouchableOpacity onPress={handleAddAsset} className="bg-[#3B82F6] rounded-xl py-4 items-center">
                  <Text className="text-white font-bold text-lg">Zapisz Aktywo</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">Twoje Aktywa</Text>
            {accounts.length === 0 && <Text className="text-zinc-600 mb-6 px-1">Brak dodanych aktywów.</Text>}
            {accounts.map(acc => (
              <View key={acc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <View className="bg-[#262A2E] p-3 rounded-xl mr-3">
                    {accountIconMap[acc.type]}
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">{acc.name}</Text>
                    <Text className="text-zinc-500 text-xs uppercase">{accountTypeLabels[acc.type]}</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-lg mr-3">${acc.balance.toLocaleString()}</Text>
                  <TouchableOpacity onPress={() => deleteAccount(acc.id)} className="bg-[#262A2E] p-2 rounded-lg">
                    <Trash2 color="#EF4444" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'GOALS' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 flex-row items-center justify-between">
              <View>
                <Text className="text-zinc-400 font-medium mb-1">Total Savings Goals</Text>
                <Text className="text-[#34D399] text-4xl font-extrabold tracking-tighter">${totalSaved.toLocaleString()}</Text>
                <Text className="text-zinc-500 text-xs mt-1">Goal: ${totalTarget.toLocaleString()}</Text>
              </View>
              <View className="bg-[#262A2E] p-4 rounded-full border border-zinc-700">
                <PiggyBank color="#34D399" size={32} />
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setIsAddingGoal(!isAddingGoal)}
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
              className="border border-[#10B981] rounded-2xl py-4 flex-row justify-center items-center mb-6"
            >
              <Plus color="#10B981" size={20} />
              <Text className="text-[#10B981] font-bold ml-2">Create New Goal (Sinking Fund)</Text>
            </TouchableOpacity>

            {isAddingGoal && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
                <Text className="text-white font-bold mb-4">New Goal</Text>
                <TextInput
                  placeholder="Goal Name (e.g., Car Insurance, Holidays)"
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={goalName}
                  onChangeText={setGoalName}
                />
                <TextInput
                  placeholder="Target Amount ($)"
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={goalTarget}
                  onChangeText={setGoalTarget}
                />
                <TextInput
                  placeholder="Deadline (e.g. 2024-12)"
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-5"
                  value={goalDeadline}
                  onChangeText={setGoalDeadline}
                />
                <TouchableOpacity onPress={handleAddGoal} className="bg-[#10B981] rounded-xl py-4 items-center">
                  <Text className="text-[#022C22] font-bold text-lg">Save Goal</Text>
                </TouchableOpacity>
              </View>
            )}

            {sinkingFunds.length === 0 && !isAddingGoal && (
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
          </View>
        )}
        
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
