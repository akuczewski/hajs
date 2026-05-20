import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useBudgetStore, CURRENCY_SYMBOLS, calculateMonthlyRequired, getIncomeAmount, getExpenseAmount, getLiabilityAmount, getMonthRange } from '../../store/useBudgetStore';
import { useTranslation } from '../../store/i18n';
import { useMonthNavigation } from '../../hooks/useMonthNavigation';
import { Wallet, Bitcoin, Landmark, CheckCircle, Circle, ArrowRight, ShieldCheck, Banknote, Coins, LineChart, CalendarDays, Home, Car, Settings } from 'lucide-react-native';
import NWLineChart from '../../components/charts/LineChart';
import { AccountType } from '../../store/types';

const accountIconMap: Record<AccountType, JSX.Element> = {
  'BANK': <Landmark color="#3B82F6" size={20} />,
  'DEPOSIT': <ShieldCheck color="#8B5CF6" size={20} />,
  'CASH': <Banknote color="#10B981" size={20} />,
  'CRYPTO': <Bitcoin color="#F59E0B" size={20} />,
  'PRECIOUS_METAL': <Coins color="#EAB308" size={20} />,
  'BONDS': <Wallet color="#9CA3AF" size={20} />,
  'STOCKS': <LineChart color="#EC4899" size={20} />,
  'REAL_ESTATE': <Home color="#34D399" size={20} />,
  'CAR': <Car color="#60A5FA" size={20} />,
};

export default function DashboardScreen() {
  const router = useRouter();
  const { incomes, fixedExpenses, accounts, liabilities, sinkingFunds, toggleLiabilityPayment, toggleFixedExpensePayment, toggleSinkingFundPayment, currency, netWorthHistory, recordNetWorthSnapshot } = useBudgetStore();
  const { t } = useTranslation();
  const symbol = CURRENCY_SYMBOLS[currency] || 'zł';

  useFocusEffect(useCallback(() => { recordNetWorthSnapshot(); }, []));

  const {
    activeMonth,
    isCurrentMonth,
    isPastMonth,
    isFutureMonth,
    isMaxFutureReached,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    getMonthName,
    swipePanResponder,
  } = useMonthNavigation();

  const totalIncome = incomes.reduce((acc, curr) => acc + getIncomeAmount(curr, activeMonth), 0);
  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const checklistItems = [
    ...fixedExpenses.map(exp => ({
      id: exp.id,
      kind: 'FIXED' as const,
      name: exp.name,
      amount: getExpenseAmount(exp, activeMonth),
      isPaid: exp.paymentHistory?.includes(activeMonth) || false
    })),
    ...liabilities.map(lib => ({
      id: lib.id,
      kind: 'LIABILITY' as const,
      name: lib.name,
      amount: getLiabilityAmount(lib, activeMonth),
      isPaid: lib.paymentHistory?.includes(activeMonth) || false
    })),
    ...sinkingFunds.map(s => ({
      id: s.id,
      kind: 'GOAL' as const,
      name: s.name,
      amount: calculateMonthlyRequired(s),
      isPaid: (s.paymentHistory || []).includes(activeMonth)
    }))
  ].sort((a, b) => b.amount - a.amount);

  const paidItemsCount = checklistItems.filter(item => item.isPaid).length;
  const totalItemsCount = checklistItems.length;
  const progressPercent = totalItemsCount > 0 ? (paidItemsCount / totalItemsCount) * 100 : 0;
  const totalMonthlyObligations = checklistItems.reduce((acc, curr) => acc + curr.amount, 0);
  const safeToSpend = totalIncome > totalMonthlyObligations ? totalIncome - totalMonthlyObligations : 0;

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="pt-6">

        {/* Header - Net Worth + Settings gear */}
        <View className="px-5 mb-2">
          <View className="flex-row justify-between items-start">
            <Text className="text-zinc-400 font-medium text-sm mb-1 uppercase tracking-widest">{t('dashboard.netWorth')}</Text>
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              className="bg-[#1C1F22] p-2 rounded-xl border border-[#272A2E]"
            >
              <Settings color="#71717A" size={20} />
            </TouchableOpacity>
          </View>
          <Text className="text-[#34D399] text-5xl font-extrabold tracking-tighter">
            {symbol}{totalNetWorth.toLocaleString()}
          </Text>
        </View>

        {/* Month Navigation */}
        <View className="px-5 mt-2 mb-4 flex-row items-center justify-center">
          <View
            className="bg-[#1C1F22] px-5 py-3 rounded-2xl border border-[#272A2E] flex-row items-center"
            {...swipePanResponder.panHandlers}
          >
            <CalendarDays color="#34D399" size={16} style={{ marginRight: 8 }} />
            <Text className="text-white font-bold text-base" style={{ marginRight: 8 }}>{getMonthName(activeMonth)}</Text>
            {isCurrentMonth && (
              <View className="bg-[#34D399]/20 px-2 py-1 rounded-md flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#34D399] mr-1" />
                <Text className="text-[#34D399] text-xs font-bold">{t('dashboard.currentMonth')}</Text>
              </View>
            )}
            {isPastMonth && (
              <View className="bg-[#8B5CF6]/20 px-2 py-1 rounded-md flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#8B5CF6] mr-1" />
                <Text className="text-[#8B5CF6] text-xs font-bold">{t('dashboard.pastMonth')}</Text>
              </View>
            )}
            {isFutureMonth && (
              <View className="bg-[#3B82F6]/20 px-2 py-1 rounded-md flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#3B82F6] mr-1" />
                <Text className="text-[#3B82F6] text-xs font-bold">{t('dashboard.futureMonth')}</Text>
              </View>
            )}
          </View>
        </View>

        {!isCurrentMonth && (
          <View className="px-5 mb-2 items-center">
            <TouchableOpacity onPress={handleToday} className="bg-[#34D399]/10 px-4 py-2 rounded-full border border-[#34D399]/20">
              <Text className="text-[#34D399] text-xs font-bold uppercase tracking-widest">{t('dashboard.backToToday')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Net Worth Timeline */}
        {(() => {
          const currentMonth = new Date().toISOString().slice(0, 7);
          const nwMonths = getMonthRange(currentMonth, 7);
          const nwData = nwMonths.map(m => ({ month: m, value: netWorthHistory[m] ?? null })).filter(d => d.value !== null) as { month: string; value: number }[];
          const withLive = nwData.length > 0 && nwData[nwData.length - 1].month === currentMonth
            ? nwData
            : [...nwData, { month: currentMonth, value: totalNetWorth }];
          if (withLive.length < 2) return (
            <TouchableOpacity onPress={recordNetWorthSnapshot} className="h-28 w-full px-5 -mt-2 justify-end pb-2">
              <Text className="text-zinc-700 text-xs text-center">Update balances regularly to build your Net Worth chart</Text>
            </TouchableOpacity>
          );
          return (
            <TouchableOpacity onPress={recordNetWorthSnapshot} activeOpacity={0.85} className="px-5 -mt-2 mb-2">
              <NWLineChart data={withLive} color="#34D399" height={110} showGradient />
            </TouchableOpacity>
          );
        })()}

        {/* Pay Yourself First */}
        <View className="px-5 mb-8">
          <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6">
            <Text className="text-white text-xl font-bold mb-2">{t('dashboard.payYourselfFirst')}</Text>
            <Text className="text-zinc-400 text-sm mb-4">{t('dashboard.payYourselfDesc')}</Text>
            <View className="bg-[#111315] p-4 rounded-2xl flex-row justify-between items-center border border-[#272A2E]">
              <Text className="text-zinc-500 font-bold">{t('dashboard.freeFunds')}</Text>
              <Text className="text-[#F59E0B] font-extrabold text-2xl">{symbol}{safeToSpend.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Monthly Checklist */}
        <View className="mb-8 px-5">
          <View className="mb-4">
            <Text className="text-white text-xl font-bold">{t('dashboard.toPayThisMonth')}</Text>
            <Text className="text-zinc-500 text-xs mt-1">{t('dashboard.markAsPaid')}</Text>
          </View>

          <View className="h-2 w-full bg-[#1C1F22] rounded-full overflow-hidden mb-5">
            <View className="h-full bg-[#34D399] rounded-full" style={{ width: `${progressPercent}%` }} />
          </View>

          {checklistItems.length === 0 ? (
            <Text className="text-zinc-500 text-center py-4">{t('dashboard.noBills')}</Text>
          ) : (
            checklistItems.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.kind === 'FIXED') toggleFixedExpensePayment(item.id, activeMonth);
                  else if (item.kind === 'LIABILITY') toggleLiabilityPayment(item.id, activeMonth);
                  else if (item.kind === 'GOAL') toggleSinkingFundPayment(item.id, activeMonth);
                }}
                className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${item.isPaid ? 'bg-[#1C1F22] border-[#272A2E]' : 'bg-[#262A2E] border-[#3F3F46]'}`}
              >
                <View className="flex-row items-center">
                  {item.isPaid ? (
                    <CheckCircle color="#34D399" size={24} />
                  ) : (
                    <Circle color="#71717A" size={24} />
                  )}
                  <Text className={`font-bold text-base ml-3 ${item.isPaid ? 'text-zinc-500 line-through' : 'text-white'}`}>
                    {item.name}
                  </Text>
                </View>
                <Text className={`font-bold ${item.isPaid ? 'text-zinc-500 line-through' : 'text-yellow-500'}`}>
                  {symbol}{item.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Assets Slider */}
        <View className="mb-8 pl-5">
          <View className="flex-row justify-between items-center pr-5 mb-4">
            <Text className="text-white text-lg font-bold">{t('dashboard.yourAssets')}</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-zinc-500 text-xs font-bold mr-1">{t('dashboard.more')}</Text>
              <ArrowRight color="#71717A" size={14} />
            </TouchableOpacity>
          </View>

          {accounts.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={accounts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="bg-[#1C1F22] rounded-2xl p-4 mr-4 w-40 border border-[#272A2E]">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="bg-[#262A2E] p-2 rounded-lg">
                      {accountIconMap[item.type] || <Landmark color="#3B82F6" size={20} />}
                    </View>
                  </View>
                  <Text className="text-zinc-400 text-xs font-medium mb-1" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-white text-xl font-bold">{symbol}{item.balance.toLocaleString()}</Text>
                </View>
              )}
            />
          ) : (
            <Text className="text-zinc-500 italic pr-5">{t('dashboard.noAssetsYet')}</Text>
          )}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
