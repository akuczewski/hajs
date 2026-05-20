import React, { useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  useBudgetStore, CURRENCY_SYMBOLS,
  getTrendData, getForecastData, getMonthRange,
  getIncomeAmount, getExpenseAmount, getLiabilityAmount, calculateMonthlyRequired,
  getVariableIncomeProjection,
} from '../../store/useBudgetStore';
import { useTranslation } from '../../store/i18n';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import { TrendingUp, TrendingDown, BarChart2, Zap } from 'lucide-react-native';

export default function AnalyticsScreen() {
  const { incomes, fixedExpenses, liabilities, sinkingFunds, accounts, currency, netWorthHistory, recordNetWorthSnapshot } = useBudgetStore();

  useFocusEffect(useCallback(() => { recordNetWorthSnapshot(); }, []));
  const { t } = useTranslation();
  const symbol = CURRENCY_SYMBOLS[currency] || 'zł';

  const currentMonth = new Date().toISOString().slice(0, 7);

  // 12-month cumulative forecast starting from current month.
  // getForecastData is deadline-aware for sinking funds and uses variable income projection —
  // this makes the displayed "monthly surplus" consistent with the cumulative total.
  const cumulativeForecastMonths = [currentMonth, ...getMonthRange(currentMonth, 11, 'forward')];
  const cumulativeForecastData = getForecastData(incomes, fixedExpenses, liabilities, sinkingFunds, cumulativeForecastMonths);
  const currentSurplus = cumulativeForecastData[0]?.surplus ?? 0;
  const totalCumulative = cumulativeForecastData[cumulativeForecastData.length - 1]?.cumulative ?? 0;
  const cumulativeChartData = cumulativeForecastData.map(d => ({ month: d.month, value: d.cumulative }));

  // Last 6 months — month has "real" data if any income/expense has an override for it
  const hasDataForMonth = (month: string) =>
    month === currentMonth ||
    incomes.some(i => i.overrides?.[month] !== undefined) ||
    fixedExpenses.some(e => e.overrides?.[month] !== undefined) ||
    liabilities.some(l => l.overrides?.[month] !== undefined);

  const trendMonths = getMonthRange(currentMonth, 6);
  const trendData = getTrendData(incomes, fixedExpenses, liabilities, sinkingFunds, trendMonths)
    .map(d => ({
      ...d,
      isCurrentMonth: d.month === currentMonth,
      isEstimated: d.month < currentMonth && !hasDataForMonth(d.month),
    }));

  // 3-month forecast bars — same logic as getForecastData but income/expenses split
  const forecastBarMonths = getMonthRange(currentMonth, 3, 'forward');
  const forecastBarData = forecastBarMonths.map(month => ({
    month,
    income: incomes.reduce((acc, i) =>
      acc + (i.isFixed ? getIncomeAmount(i, month) : getVariableIncomeProjection(i, currentMonth)), 0),
    expenses:
      fixedExpenses.reduce((acc, e) => acc + getExpenseAmount(e, month), 0) +
      liabilities.reduce((acc, l) => acc + getLiabilityAmount(l, month), 0) +
      sinkingFunds.reduce((acc, s) => month <= s.deadline ? acc + calculateMonthlyRequired(s) : acc, 0),
    isForecast: true as const,
  }));

  const barChartData = [...trendData, ...forecastBarData];

  // Net Worth history data
  const nwMonths = getMonthRange(currentMonth, 12);
  const nwData = nwMonths
    .map(m => ({ month: m, value: netWorthHistory[m] ?? null }))
    .filter(d => d.value !== null) as { month: string; value: number }[];

  // Current month NW from live accounts
  const liveNW = accounts.reduce((acc, a) => acc + a.balance, 0);
  const nwDataWithLive = nwData.length > 0 && nwData[nwData.length - 1].month === currentMonth
    ? nwData
    : [...nwData, { month: currentMonth, value: liveNW }];

  const avgIncome = trendData.reduce((a, d) => a + d.income, 0) / Math.max(1, trendData.length);
  const avgExpenses = trendData.reduce((a, d) => a + d.expenses, 0) / Math.max(1, trendData.length);

  const fmt = (v: number) => `${symbol}${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getMonthLabel = (m: string) => {
    const [, month] = m.split('-');
    const months = [
      t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
      t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
      t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec'),
    ];
    return months[parseInt(month) - 1].slice(0, 3);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} className="pt-6 px-5">

        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-3xl font-extrabold">{t('analytics.title')}</Text>
        </View>

        {/* Summary cards */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4">
            <Text className="text-zinc-500 text-xs font-medium mb-1">{t('analytics.surplus')}</Text>
            <Text className={`text-xl font-extrabold ${currentSurplus >= 0 ? 'text-[#34D399]' : 'text-red-400'}`}>
              {currentSurplus >= 0 ? '+' : '-'}{fmt(currentSurplus)}
            </Text>
          </View>
          <View className="flex-1 bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4">
            <Text className="text-zinc-500 text-xs font-medium mb-1">{t('analytics.cumulative')}</Text>
            <Text className={`text-xl font-extrabold ${totalCumulative >= 0 ? 'text-[#3B82F6]' : 'text-red-400'}`}>
              {totalCumulative >= 0 ? '+' : '-'}{fmt(totalCumulative)}
            </Text>
          </View>
        </View>

        {/* Net Worth History */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-5">
          <View className="flex-row items-center mb-1">
            <TrendingUp color="#34D399" size={18} />
            <Text className="text-white font-bold text-base ml-2">{t('analytics.netWorthTrend')}</Text>
          </View>
          <Text className="text-zinc-500 text-xs mb-4">{t('analytics.last12months')}</Text>

          {nwDataWithLive.length < 2 ? (
            <TouchableOpacity onPress={recordNetWorthSnapshot} className="py-8 items-center">
              <Text className="text-zinc-600 text-sm text-center">{t('analytics.noHistory')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={recordNetWorthSnapshot} activeOpacity={0.85}>
              <Text className="text-[#34D399] text-2xl font-extrabold mb-3">
                {symbol}{liveNW.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <LineChart
                data={nwDataWithLive}
                color="#34D399"
                height={130}
                showGradient
                symbol={symbol}
                formatLabel={getMonthLabel}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Income vs Expenses */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-5">
          <View className="flex-row items-center mb-1">
            <BarChart2 color="#3B82F6" size={18} />
            <Text className="text-white font-bold text-base ml-2">{t('analytics.incomeTrend')}</Text>
          </View>
          <Text className="text-zinc-500 text-xs mb-4">{t('analytics.last6monthsForecast')}</Text>

          {/* Legend */}
          <View className="flex-row gap-4 mb-3 flex-wrap">
            <View className="flex-row items-center">
              <View className="w-8 h-3 rounded-sm mr-2 overflow-hidden flex-row">
                <View className="flex-1 bg-[#34D399]" />
                <View className="flex-1 bg-[#EAB308] opacity-55" />
              </View>
              <Text className="text-zinc-400 text-xs">{t('analytics.income')} / {t('analytics.expenses')}</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-sm bg-[#6B7280] mr-1 opacity-50" />
              <Text className="text-zinc-500 text-xs">{t('analytics.forecastLabel')}</Text>
            </View>
          </View>

          <BarChart data={barChartData} height={148} formatLabel={getMonthLabel} />

          {/* Averages */}
          <View className="flex-row gap-3 mt-4">
            <View className="flex-1 bg-[#111315] rounded-xl p-3 border border-[#272A2E]">
              <Text className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">{t('analytics.income')} avg</Text>
              <Text className="text-[#34D399] font-bold">{fmt(avgIncome)}</Text>
            </View>
            <View className="flex-1 bg-[#111315] rounded-xl p-3 border border-[#272A2E]">
              <Text className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">{t('analytics.expenses')} avg</Text>
              <Text className="text-[#EAB308] font-bold">{fmt(avgExpenses)}</Text>
            </View>
          </View>
        </View>

        {/* Cashflow Forecast */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-5">
          <View className="flex-row items-center mb-1">
            <Zap color="#8B5CF6" size={18} />
            <Text className="text-white font-bold text-base ml-2">{t('analytics.forecast')}</Text>
          </View>
          <Text className="text-zinc-500 text-xs mb-4">{t('analytics.forecastDesc')}</Text>

          <LineChart
            data={cumulativeChartData}
            color={totalCumulative >= 0 ? '#8B5CF6' : '#EF4444'}
            height={130}
            showGradient
            formatLabel={getMonthLabel}
          />

          {/* Surplus summary */}
          <View className="mt-4 bg-[#111315] rounded-xl p-4 border border-[#272A2E]">
            <View className="flex-row justify-between items-center">
              <Text className="text-zinc-400 text-sm">{t('analytics.surplus')}/mo</Text>
              <Text className={`font-extrabold text-lg ${currentSurplus >= 0 ? 'text-[#34D399]' : 'text-red-400'}`}>
                {currentSurplus >= 0 ? '+' : ''}{symbol}{(currentSurplus).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-zinc-400 text-sm">12m {t('analytics.cumulative')}</Text>
              <Text className={`font-extrabold text-lg ${totalCumulative >= 0 ? 'text-[#3B82F6]' : 'text-red-400'}`}>
                {totalCumulative >= 0 ? '+' : ''}{symbol}{(totalCumulative).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
