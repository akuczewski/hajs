import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useBudgetStore, CURRENCY_SYMBOLS } from '../../store/useBudgetStore';
import { useTranslation } from '../../store/i18n';
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
  const { sinkingFunds, addSinkingFund, accounts, addAccount, deleteAccount, updateAccount, updateSinkingFundBalance, currency } = useBudgetStore();
  const { t } = useTranslation();
  const symbol = CURRENCY_SYMBOLS[currency] || 'zł';
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'GOALS'>('ASSETS');

  // Edit Assets State
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [editAssetName, setEditAssetName] = useState('');
  const [editAssetBalance, setEditAssetBalance] = useState('');

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
              <Text className="text-zinc-400 font-medium mb-2">{t('savings.totalNetWorth')}</Text>
              <Text className="text-[#3B82F6] text-5xl font-extrabold tracking-tighter">{symbol}{totalNetWorth.toLocaleString()}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => setIsAddingAsset(!isAddingAsset)}
              className="bg-[#1C1F22] border border-dashed border-zinc-700 py-4 rounded-2xl items-center flex-row justify-center mb-6"
            >
              <Plus color="#3B82F6" size={20} />
              <Text className="text-[#3B82F6] font-bold ml-2">{t('savings.addAsset')}</Text>
            </TouchableOpacity>

            {isAddingAsset && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
                <Text className="text-white font-bold mb-4">{t('savings.newAsset')}</Text>
                <TextInput
                  placeholder={t('savings.assetName')}
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={assetName}
                  onChangeText={setAssetName}
                />
                <TextInput
                  placeholder={`${t('savings.currentValue')} (${symbol})`}
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-5"
                  value={assetBalance}
                  onChangeText={setAssetBalance}
                />
                
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {Object.entries(ACCOUNT_ICONS).map(([type, icon]) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setAssetType(type as AccountType)}
                      className={`p-3 rounded-xl border ${assetType === type ? 'bg-[#3B82F6]/20 border-[#3B82F6]' : 'bg-[#262A2E] border-transparent'}`}
                    >
                      {React.createElement(icon as any, { color: assetType === type ? '#3B82F6' : '#71717A', size: 24 })}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity onPress={handleAddAsset} className="bg-[#3B82F6] rounded-xl py-4 items-center">
                  <Text className="text-white font-bold text-lg">{t('savings.saveAsset')}</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 px-1">{t('savings.yourAssets')}</Text>
            {accounts.length === 0 && <Text className="text-zinc-600 px-1">{t('savings.noAssets')}</Text>}
            {accounts.map(acc => (
              <View key={acc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="bg-[#262A2E] p-3 rounded-xl mr-4">
                    {React.createElement(ACCOUNT_ICONS[acc.type] as any, { color: '#3B82F6', size: 24 })}
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">{acc.name}</Text>
                    <Text className="text-zinc-500 text-xs uppercase">{acc.type}</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-lg mr-3">{symbol}{acc.balance.toLocaleString()}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setEditingAsset(acc.id);
                      setEditAssetName(acc.name);
                      setEditAssetBalance(acc.balance.toString());
                    }}
                    className="bg-[#262A2E] p-2 rounded-lg mr-2"
                  >
                    <LineChart color="#60A5FA" size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteAccount(acc.id)} className="bg-[#262A2E] p-2 rounded-lg">
                    <Trash2 color="#EF4444" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Modal visible={!!editingAsset} transparent animationType="fade">
              <View className="flex-1 bg-black/60 justify-center px-6">
                <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6">
                  <Text className="text-white text-xl font-bold mb-4">{t('savings.newAsset')}</Text>
                  <TextInput
                    placeholder={t('savings.assetName')}
                    placeholderTextColor="#71717A"
                    className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                    value={editAssetName}
                    onChangeText={setEditAssetName}
                  />
                  <TextInput
                    placeholder={`${t('savings.currentValue')} (${symbol})`}
                    placeholderTextColor="#71717A"
                    keyboardType="numeric"
                    className="bg-[#262A2E] text-white p-4 rounded-xl mb-6"
                    value={editAssetBalance}
                    onChangeText={setEditAssetBalance}
                  />
                  <View className="flex-row gap-3">
                    <TouchableOpacity 
                      onPress={() => setEditingAsset(null)}
                      className="flex-1 bg-[#262A2E] py-4 rounded-xl items-center"
                    >
                      <Text className="text-white font-bold">{t('settings.cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => {
                        updateAccount(editingAsset!, { name: editAssetName, balance: parseFloat(editAssetBalance) || 0 });
                        setEditingAsset(null);
                      }}
                      className="flex-1 bg-[#3B82F6] py-4 rounded-xl items-center"
                    >
                      <Text className="text-white font-bold">{t('cashflow.saveIncome')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

        {activeTab === 'GOALS' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 flex-row items-center justify-between">
              <View>
                <Text className="text-zinc-400 font-medium mb-1">{t('savings.totalSavingsGoals')}</Text>
                <Text className="text-[#34D399] text-4xl font-extrabold tracking-tighter">{symbol}{totalSaved.toLocaleString()}</Text>
                <Text className="text-zinc-500 text-xs mt-1">{t('savings.goal')}: {symbol}{totalTarget.toLocaleString()}</Text>
              </View>
              <View className="bg-[#262A2E] p-4 rounded-full border border-zinc-700">
                <PiggyBank color="#34D399" size={32} />
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setIsAddingGoal(!isAddingGoal)}
              className="bg-[#1C1F22] border border-dashed border-zinc-700 py-4 rounded-2xl items-center flex-row justify-center mb-6"
            >
              <Plus color="#34D399" size={20} />
              <Text className="text-[#34D399] font-bold ml-2">{t('savings.addGoal')}</Text>
            </TouchableOpacity>

            {isAddingGoal && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
                <Text className="text-white font-bold mb-4">{t('savings.newGoal')}</Text>
                <TextInput
                  placeholder={t('savings.goalName')}
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={goalName}
                  onChangeText={setGoalName}
                />
                <TextInput
                  placeholder={`${t('savings.targetAmount')} (${symbol})`}
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={goalTarget}
                  onChangeText={setGoalTarget}
                />
                <TextInput
                  placeholder={t('savings.deadline')}
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-5"
                  value={goalDeadline}
                  onChangeText={setGoalDeadline}
                />
                <TouchableOpacity onPress={handleAddGoal} className="bg-[#34D399] rounded-xl py-4 items-center">
                  <Text className="text-[#111315] font-bold text-lg">{t('savings.saveGoal')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {sinkingFunds.length === 0 && <Text className="text-zinc-600 px-1">{t('savings.noGoals')}</Text>}
            {sinkingFunds.map(fund => {
              const progressPercent = Math.min(100, (fund.savedAmount / fund.targetAmount) * 100);
              const monthlyRequired = (fund.targetAmount - fund.savedAmount) / 12;

              return (
                <View key={fund.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-5">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                      <View className="bg-[#34D399]/10 p-2 rounded-lg mr-3">
                        <Target color="#34D399" size={20} />
                      </View>
                      <View>
                        <Text className="text-white font-bold text-lg">{fund.name}</Text>
                        <Text className="text-zinc-500 text-xs">{t('savings.inProgress')}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => updateSinkingFundBalance(fund.id, monthlyRequired)}
                      className="bg-[#34D399] px-4 py-2 rounded-xl"
                    >
                      <Text className="text-[#111315] font-bold text-xs">+ {symbol}{monthlyRequired.toFixed(0)}</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mb-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-white font-bold">{symbol}{fund.savedAmount.toLocaleString()}</Text>
                      <Text className="text-zinc-500 font-medium">{t('savings.of')} {symbol}{fund.targetAmount.toLocaleString()}</Text>
                    </View>
                    <View className="h-2 w-full bg-[#262A2E] rounded-full overflow-hidden">
                      <View className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${progressPercent}%` }} />
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center bg-[#111315] p-3 rounded-xl border border-[#272A2E]">
                    <Text className="text-zinc-400 text-xs">{t('savings.monthlyToSave')}</Text>
                    <Text className="text-white font-bold">{symbol}{monthlyRequired.toFixed(2)}</Text>
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
