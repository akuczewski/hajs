import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useBudgetStore, CURRENCY_SYMBOLS, calculateMonthlyRequired, getSinkingFundBreakEven } from '../../store/useBudgetStore';
import { useTranslation } from '../../store/i18n';
import { PiggyBank, Target, Plus, ShieldCheck, Wallet, Landmark, Banknote, Bitcoin, LineChart, Coins, Trash2, CheckCircle, CalendarDays, Home, Car } from 'lucide-react-native';
import { AccountType } from '../../store/types';
import MonthPickerModal from '../../components/MonthPickerModal';

const ACCOUNT_ICONS: Record<AccountType, any> = {
  'BANK': Landmark,
  'DEPOSIT': ShieldCheck,
  'CASH': Banknote,
  'CRYPTO': Bitcoin,
  'PRECIOUS_METAL': Coins,
  'BONDS': Wallet,
  'STOCKS': LineChart,
  'REAL_ESTATE': Home,
  'CAR': Car,
};

export default function SavingsScreen() {
  const { sinkingFunds, addSinkingFund, deleteSinkingFund, accounts, addAccount, deleteAccount, updateAccount, toggleSinkingFundPayment, currency, activeMonth } = useBudgetStore();
  const { t } = useTranslation();
  const symbol = CURRENCY_SYMBOLS[currency] || 'zł';
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'GOALS'>('ASSETS');

  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [editAssetName, setEditAssetName] = useState('');
  const [editAssetBalance, setEditAssetBalance] = useState('');

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

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
      paymentHistory: [],
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
      currency,
      createdAt: new Date().toISOString()
    });
    setAssetName('');
    setAssetAmount('');
    setIsAddingAsset(false);
  };

  return (
    <View className="flex-1 bg-[#111315] pt-12">
      <View className="px-5 py-4 border-b border-zinc-800">
        <Text className="text-white text-2xl font-bold mb-4">{t('savings.title')}</Text>

        <View className="flex-row bg-[#1C1F22] rounded-xl p-1 border border-[#272A2E]">
          <TouchableOpacity
            onPress={() => setActiveTab('ASSETS')}
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'ASSETS' ? 'bg-[#262A2E]' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'ASSETS' ? 'text-[#3B82F6]' : 'text-zinc-500'}`}>{t('savings.assetsTab')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('GOALS')}
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'GOALS' ? 'bg-[#262A2E]' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'GOALS' ? 'text-[#34D399]' : 'text-zinc-500'}`}>{t('savings.goalsTab')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">

        {activeTab === 'ASSETS' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 items-start">
              <Text className="text-zinc-400 font-medium mb-2">{t('savings.totalNetWorth')}</Text>
              <Text className="text-[#3B82F6] text-5xl font-extrabold tracking-tighter">{symbol}{totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
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
                  value={assetAmount}
                  onChangeText={setAssetAmount}
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
              <View key={acc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center flex-1 pr-3">
                  <View className="bg-[#262A2E] p-3 rounded-2xl mr-4">
                    {React.createElement(ACCOUNT_ICONS[acc.type] as any, { color: '#3B82F6', size: 24 })}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg" numberOfLines={1}>{acc.name}</Text>
                    <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{acc.type}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-white font-bold text-lg mb-2">{symbol}{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => {
                        setEditingAsset(acc.id);
                        setEditAssetName(acc.name);
                        setEditAssetBalance(acc.balance.toString());
                      }}
                      className="bg-[#262A2E] p-2 rounded-xl"
                    >
                      <LineChart color="#60A5FA" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteAccount(acc.id)} className="bg-[#262A2E] p-2 rounded-xl">
                      <Trash2 color="#EF4444" size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <Modal visible={!!editingAsset} transparent animationType="fade">
              <View className="flex-1 bg-black/60 justify-center px-6">
                <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6">
                  <Text className="text-white text-xl font-bold mb-4">{t('savings.editAsset')}</Text>
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
                      <Text className="text-white font-bold">{t('savings.saveAsset')}</Text>
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
                <Text className="text-[#34D399] text-4xl font-extrabold tracking-tighter">{symbol}{totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                <Text className="text-zinc-500 text-xs mt-1">{t('savings.goal')}: {symbol}{totalTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
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
                <TouchableOpacity
                  onPress={() => setIsDatePickerVisible(true)}
                  className="bg-[#262A2E] p-4 rounded-xl mb-5 flex-row items-center justify-between"
                >
                  <Text className={goalDeadline ? 'text-white' : 'text-[#71717A]'}>
                    {goalDeadline || t('savings.deadline')}
                  </Text>
                  <CalendarDays color="#71717A" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddGoal} className="bg-[#34D399] rounded-xl py-4 items-center">
                  <Text className="text-[#111315] font-bold text-lg">{t('savings.saveGoal')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {sinkingFunds.length === 0 && <Text className="text-zinc-600 px-1">{t('savings.noGoals')}</Text>}
            {sinkingFunds.map(fund => {
              const progressPercent = Math.min(100, (fund.savedAmount / fund.targetAmount) * 100);
              const monthlyRequired = calculateMonthlyRequired(fund);

              return (
                <View key={fund.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-5">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center flex-1 pr-2">
                      <View className="bg-[#34D399]/10 p-2 rounded-lg mr-3">
                        <Target color="#34D399" size={20} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-lg" numberOfLines={1}>{fund.name}</Text>
                        <Text className="text-zinc-500 text-xs">{t('savings.inProgress')}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => toggleSinkingFundPayment(fund.id, activeMonth)}
                      >
                        {(fund.paymentHistory || []).includes(activeMonth) ? (
                          <CheckCircle color="#34D399" size={28} />
                        ) : (
                          <View className="bg-[#34D399] px-4 py-2 rounded-xl">
                            <Text className="text-[#111315] font-bold text-xs">+ {symbol}{monthlyRequired.toFixed(0)}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteSinkingFund(fund.id)} className="bg-[#262A2E] p-2 rounded-xl">
                        <Trash2 color="#EF4444" size={16} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="mb-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-white font-bold">{symbol}{fund.savedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                      <Text className="text-zinc-500 font-medium">{t('savings.of')} {symbol}{fund.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                    <View className="h-2 w-full bg-[#262A2E] rounded-full overflow-hidden">
                      <View className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${progressPercent}%` }} />
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center bg-[#111315] p-3 rounded-xl border border-[#272A2E] mb-2">
                    <Text className="text-zinc-400 text-xs">{t('savings.monthlyToSave')}</Text>
                    <Text className="text-white font-bold">{symbol}{monthlyRequired.toFixed(2)}</Text>
                  </View>

                  {/* Break-even */}
                  {(() => {
                    if (fund.savedAmount >= fund.targetAmount) {
                      return (
                        <View className="flex-row items-center bg-[#34D399]/10 px-3 py-2 rounded-xl border border-[#34D399]/30">
                          <CheckCircle color="#34D399" size={14} />
                          <Text className="text-[#34D399] text-xs font-bold ml-2">Goal reached!</Text>
                        </View>
                      );
                    }
                    const be = getSinkingFundBreakEven(fund);
                    const [estY, estM] = be.estimatedDate.split('-');
                    const months = [
                      t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
                      t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
                      t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec'),
                    ];
                    const estLabel = `${months[parseInt(estM) - 1]} ${estY}`;
                    return (
                      <View className={`flex-row items-center justify-between px-3 py-2 rounded-xl border ${be.isOnTime ? 'bg-[#34D399]/10 border-[#34D399]/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <Text className={`text-xs font-medium ${be.isOnTime ? 'text-[#34D399]' : 'text-red-400'}`}>
                          {t('analytics.estimatedDone')}: {estLabel}
                        </Text>
                        <Text className={`text-xs font-bold ${be.isOnTime ? 'text-[#34D399]' : 'text-red-400'}`}>
                          {be.isOnTime
                            ? `+${be.monthsDelta} ${t('analytics.ahead')}`
                            : `${Math.abs(be.monthsDelta)} ${t('analytics.behindBy')}`}
                        </Text>
                      </View>
                    );
                  })()}
                </View>
              );
            })}
          </View>
        )}

        <View className="h-10" />
      </ScrollView>

      <MonthPickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSelect={setGoalDeadline}
        currentValue={goalDeadline}
        title={t('savings.selectDeadline')}
      />
    </View>
  );
}
