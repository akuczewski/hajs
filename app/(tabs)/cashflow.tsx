import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Briefcase, Activity, CheckCircle, Plus, Trash2, CalendarDays, Pencil, ChevronUp, ChevronDown } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import {
  useBudgetStore, CURRENCY_SYMBOLS,
  getIncomeAmount, getExpenseAmount, getLiabilityAmount, getVariableIncomeProjection
} from '../../store/useBudgetStore';
import { useTranslation } from '../../store/i18n';
import { useMonthNavigation } from '../../hooks/useMonthNavigation';
import EditAmountModal from '../../components/EditAmountModal';
import EditItemModal from '../../components/EditItemModal';
import { Income, FixedExpense, Liability } from '../../store/types';

export default function CashflowScreen() {
  const {
    incomes, fixedExpenses, liabilities,
    incomeOrder, expenseOrder, liabilityOrder,
    addIncome, addFixedExpense, addLiability,
    toggleLiabilityPayment, toggleFixedExpensePayment,
    deleteIncome, deleteFixedExpense, deleteLiability,
    updateIncome, updateFixedExpense, updateLiability,
    reorderIncome, reorderExpense, reorderLiability,
    currency, setAmountOverride
  } = useBudgetStore();
  const { t } = useTranslation();
  const symbol = CURRENCY_SYMBOLS[currency] || 'zł';
  const [activeTab, setActiveTab] = useState<'INCOMES' | 'EXPENSES'>('INCOMES');

  const {
    activeMonth, isCurrentMonth, isPastMonth, isFutureMonth,
    handleToday, getMonthName, swipePanResponder,
  } = useMonthNavigation();

  // Add income form
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [incName, setIncName] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incIsFixed, setIncIsFixed] = useState(true);

  // Add expense form
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expName, setExpName] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expType, setExpType] = useState<'FIXED' | 'SUBSCRIPTION' | 'CREDIT'>('FIXED');
  const [expCategory, setExpCategory] = useState('');
  const [creditTotal, setCreditTotal] = useState('');
  const [creditPaid, setCreditPaid] = useState('');

  // Override modal
  const [isOverrideModalVisible, setIsOverrideModalVisible] = useState(false);
  const [overrideInfo, setOverrideInfo] = useState<{ id: string; type: 'INCOME' | 'FIXED_EXPENSE' | 'LIABILITY'; name: string; currentAmount: number; defaultAmount: number } | null>(null);

  // Edit item modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editType, setEditType] = useState<'INCOME' | 'FIXED_EXPENSE' | 'LIABILITY'>('INCOME');
  const [editItem, setEditItem] = useState<Income | FixedExpense | Liability | null>(null);

  // Ordered lists — items not present in order array (migration safety) appended at end
  const orderedIncomes = (() => {
    const ordered = incomeOrder.map(id => incomes.find(i => i.id === id)).filter(Boolean) as Income[];
    const unordered = incomes.filter(i => !incomeOrder.includes(i.id));
    return [...ordered, ...unordered];
  })();
  const orderedExpenses = (() => {
    const ordered = expenseOrder.map(id => fixedExpenses.find(e => e.id === id)).filter(Boolean) as FixedExpense[];
    const unordered = fixedExpenses.filter(e => !expenseOrder.includes(e.id));
    return [...ordered, ...unordered];
  })();
  const orderedLiabilities = (() => {
    const ordered = liabilityOrder.map(id => liabilities.find(l => l.id === id)).filter(Boolean) as Liability[];
    const unordered = liabilities.filter(l => !liabilityOrder.includes(l.id));
    return [...ordered, ...unordered];
  })();

  const fixedIncomes = orderedIncomes.filter(i => i.isFixed);
  const variableIncomes = orderedIncomes.filter(i => !i.isFixed);
  const totalIncome = incomes.reduce((acc, i) => acc + getIncomeAmount(i, activeMonth), 0);
  const totalExpenses =
    fixedExpenses.reduce((acc, e) => acc + getExpenseAmount(e, activeMonth), 0) +
    liabilities.reduce((acc, l) => acc + getLiabilityAmount(l, activeMonth), 0);

  const handleAddIncome = () => {
    if (!incName || !incAmount) return;
    addIncome({ id: Date.now().toString(), name: incName, amount: parseFloat(incAmount), isFixed: incIsFixed, createdAt: new Date().toISOString() });
    setIncName(''); setIncAmount(''); setIsAddingIncome(false);
  };

  const handleAddExpense = () => {
    if (!expName || !expAmount) return;
    if (expType === 'FIXED') {
      addFixedExpense({ id: Date.now().toString(), name: expName, amount: parseFloat(expAmount), category: expCategory || t('cashflow.categoryOther'), paymentHistory: [], createdAt: new Date().toISOString() });
    } else if (expType === 'SUBSCRIPTION') {
      addLiability({ id: Date.now().toString(), name: expName, type: 'SUBSCRIPTION', monthlyPayment: parseFloat(expAmount), paymentHistory: [], createdAt: new Date().toISOString() });
    } else {
      addLiability({ id: Date.now().toString(), name: expName, type: 'CREDIT', monthlyPayment: parseFloat(expAmount), totalInstallments: parseInt(creditTotal) || undefined, paidInstallments: parseInt(creditPaid) || 0, paymentHistory: [], createdAt: new Date().toISOString() });
    }
    setExpName(''); setExpAmount(''); setExpCategory(''); setCreditTotal(''); setCreditPaid(''); setIsAddingExpense(false);
  };

  const openOverride = (id: string, type: 'INCOME' | 'FIXED_EXPENSE' | 'LIABILITY', name: string, current: number, def: number) => {
    setOverrideInfo({ id, type, name, currentAmount: current, defaultAmount: def });
    setIsOverrideModalVisible(true);
  };

  const openEdit = (type: 'INCOME' | 'FIXED_EXPENSE' | 'LIABILITY', item: Income | FixedExpense | Liability) => {
    setEditType(type);
    setEditItem(item);
    setIsEditModalVisible(true);
  };

  const handleEditSave = (updates: Partial<Income | FixedExpense | Liability>) => {
    if (!editItem) return;
    if (editType === 'INCOME') updateIncome(editItem.id, updates as Partial<Income>);
    else if (editType === 'FIXED_EXPENSE') updateFixedExpense(editItem.id, updates as Partial<FixedExpense>);
    else updateLiability(editItem.id, updates as Partial<Liability>);
  };

  // ---- Reorder helpers ----
  const moveIncome = (id: string, dir: 1 | -1) => {
    const idx = incomeOrder.indexOf(id);
    if (idx === -1) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= incomeOrder.length) return;
    reorderIncome(idx, newIdx);
  };
  const moveExpense = (id: string, dir: 1 | -1) => {
    const idx = expenseOrder.indexOf(id);
    if (idx === -1) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= expenseOrder.length) return;
    reorderExpense(idx, newIdx);
  };
  const moveLiability = (id: string, dir: 1 | -1) => {
    const idx = liabilityOrder.indexOf(id);
    if (idx === -1) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= liabilityOrder.length) return;
    reorderLiability(idx, newIdx);
  };

  return (
    <View className="flex-1 bg-[#111315] pt-12">
      <View className="px-5 pt-6 border-b border-zinc-800">

        {/* Month Navigation */}
        <View className="mb-4 flex-row items-center justify-center">
          <View className="bg-[#1C1F22] px-5 py-3 rounded-2xl border border-[#272A2E] flex-row items-center" {...swipePanResponder.panHandlers}>
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
          <TouchableOpacity onPress={handleToday} className="mb-4 self-start bg-[#262A2E] px-3 py-1 rounded-lg">
            <Text className="text-zinc-400 text-xs font-medium">{t('dashboard.backToToday')}</Text>
          </TouchableOpacity>
        )}

        <View className="flex-row bg-[#1C1F22] rounded-xl p-1 border border-[#272A2E]">
          {(['INCOMES', 'EXPENSES'] as const).map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-xl items-center ${activeTab === tab ? 'bg-[#3B82F6]' : 'bg-[#1C1F22]'}`}>
              <Text className={`font-bold ${activeTab === tab ? 'text-white' : 'text-zinc-500'}`}>
                {t(tab === 'INCOMES' ? 'cashflow.incomesTab' : 'cashflow.expensesTab')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">

        {/* ---- INCOMES ---- */}
        {activeTab === 'INCOMES' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 items-start">
              <Text className="text-zinc-400 font-medium mb-2">{t('cashflow.totalMonthlyIncome')}</Text>
              <Text className="text-[#34D399] text-5xl font-extrabold tracking-tighter">{symbol}{totalIncome.toLocaleString()}</Text>
            </View>

            <TouchableOpacity onPress={() => setIsAddingIncome(!isAddingIncome)} className="bg-[#1C1F22] border border-dashed border-zinc-700 py-4 rounded-2xl items-center flex-row justify-center mb-6">
              <Plus color="#34D399" size={20} />
              <Text className="text-[#34D399] font-bold ml-2">{t('cashflow.addIncome')}</Text>
            </TouchableOpacity>

            {isAddingIncome && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-6">
                <Text className="text-white text-xl font-bold mb-4">{t('cashflow.newIncome')}</Text>
                <TextInput placeholder={t('cashflow.incomeName')} placeholderTextColor="#71717A" className="bg-[#262A2E] text-white p-4 rounded-xl mb-3" value={incName} onChangeText={setIncName} />
                <TextInput placeholder={`${t('cashflow.amount')} (${symbol})`} placeholderTextColor="#71717A" keyboardType="numeric" className="bg-[#262A2E] text-white p-4 rounded-xl mb-4" value={incAmount} onChangeText={setIncAmount} />
                <View className="flex-row items-center justify-between bg-[#262A2E] p-4 rounded-xl mb-5">
                  <Text className="text-white font-medium">{t('cashflow.isOneTime')}</Text>
                  <TouchableOpacity onPress={() => setIncIsFixed(!incIsFixed)} className={`w-12 h-6 rounded-full justify-center px-1 ${!incIsFixed ? 'bg-[#34D399]' : 'bg-[#3F3F46]'}`}>
                    <View className={`w-4 h-4 rounded-full bg-white ${!incIsFixed ? 'self-end' : 'self-start'}`} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleAddIncome} className="bg-[#34D399] rounded-xl py-4 items-center">
                  <Text className="text-[#022C22] font-bold text-lg">{t('cashflow.saveIncome')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Fixed Incomes */}
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">{t('cashflow.fixedIncome')}</Text>
            {fixedIncomes.length === 0 && <Text className="text-zinc-600 mb-6 px-1">{t('cashflow.noFixedIncomes')}</Text>}
            {fixedIncomes.map((inc, listIdx) => {
              const currentAmt = getIncomeAmount(inc, activeMonth);
              const globalIdx = incomeOrder.indexOf(inc.id);
              return (
                <View key={inc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4 mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <Briefcase color="#10B981" size={20} />
                      <Text className="text-white font-bold text-base ml-3 flex-1" numberOfLines={1}>{inc.name}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      {/* Reorder */}
                      <View className="flex-col mr-1">
                        <TouchableOpacity onPress={() => moveIncome(inc.id, -1)} className="p-1">
                          <ChevronUp color="#52525B" size={14} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => moveIncome(inc.id, 1)} className="p-1">
                          <ChevronDown color="#52525B" size={14} />
                        </TouchableOpacity>
                      </View>
                      {/* Amount override */}
                      <TouchableOpacity onPress={() => openOverride(inc.id, 'INCOME', inc.name, currentAmt, inc.amount)} className="flex-row items-center bg-[#262A2E] px-3 py-2 rounded-lg">
                        <Text className="text-white font-bold mr-1">{symbol}{currentAmt.toLocaleString()}</Text>
                        <Pencil color="#A1A1AA" size={12} />
                      </TouchableOpacity>
                      {/* Edit name */}
                      <TouchableOpacity onPress={() => openEdit('INCOME', inc)} className="bg-[#262A2E] p-2 rounded-lg">
                        <Pencil color="#60A5FA" size={16} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteIncome(inc.id)} className="bg-[#262A2E] p-2 rounded-lg">
                        <Trash2 color="#EF4444" size={16} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Variable Incomes */}
            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-4 mb-3 px-1">{t('cashflow.variableIncome')}</Text>
            {variableIncomes.length === 0 && <Text className="text-zinc-600 mb-6 px-1">{t('cashflow.noVariableIncomes')}</Text>}
            {variableIncomes.map(inc => {
              const currentAmt = getIncomeAmount(inc, activeMonth);
              const projection = getVariableIncomeProjection(inc, activeMonth);
              const hasAverage = projection !== inc.amount;
              return (
                <View key={inc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 relative overflow-hidden">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                      <Activity color="#10B981" size={20} />
                      <Text className="text-white font-bold text-lg ml-2">{inc.name}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <TouchableOpacity onPress={() => openOverride(inc.id, 'INCOME', inc.name, currentAmt, inc.amount)} className="flex-row items-center bg-[#262A2E] px-3 py-2 rounded-lg">
                        <Text className="text-white font-bold mr-1">{symbol}{currentAmt.toLocaleString()}</Text>
                        <Pencil color="#A1A1AA" size={12} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openEdit('INCOME', inc)} className="bg-[#262A2E] p-2 rounded-lg">
                        <Pencil color="#60A5FA" size={16} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteIncome(inc.id)} className="bg-[#262A2E] p-2 rounded-lg">
                        <Trash2 color="#EF4444" size={16} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-end">
                    <View className="w-1/2 h-12">
                      <Svg height="100%" width="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <Path d="M0 30 L 20 10 L 40 35 L 60 5 L 80 20 L 100 0" fill="none" stroke="#34D399" strokeWidth="2" />
                      </Svg>
                      <Text className="text-zinc-600 text-[10px] mt-1">{t('cashflow.last5Months')}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-zinc-400 text-xs font-medium">
                        {hasAverage ? t('cashflow.calculatedAverage') : t('cashflow.baseAmount')}
                      </Text>
                      <Text className="text-[#34D399] font-bold text-lg">
                        {symbol}{Math.round(projection).toLocaleString()}/mo
                      </Text>
                      {hasAverage && (
                        <Text className="text-zinc-600 text-[10px]">{t('cashflow.last3MonthsAvg')}</Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ---- EXPENSES ---- */}
        {activeTab === 'EXPENSES' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 items-start">
              <Text className="text-zinc-400 font-medium mb-2">{t('cashflow.totalMonthlyExpenses')}</Text>
              <Text className="text-yellow-500 text-5xl font-extrabold tracking-tighter">{symbol}{totalExpenses.toLocaleString()}</Text>
            </View>

            <TouchableOpacity onPress={() => setIsAddingExpense(!isAddingExpense)} style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }} className="border border-yellow-500 rounded-2xl py-4 flex-row justify-center items-center mb-6">
              <Plus color="#EAB308" size={20} />
              <Text className="text-yellow-500 font-bold ml-2">{t('cashflow.addExpense')}</Text>
            </TouchableOpacity>

            {isAddingExpense && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-6">
                <Text className="text-white text-xl font-bold mb-4">{t('cashflow.newExpense')}</Text>
                <View className="flex-row bg-[#262A2E] rounded-lg p-1 mb-4">
                  {(['FIXED', 'SUBSCRIPTION', 'CREDIT'] as const).map(et => (
                    <TouchableOpacity key={et} onPress={() => setExpType(et)} className={`flex-1 py-2 items-center rounded-md ${expType === et ? 'bg-[#3F3F46]' : ''}`}>
                      <Text className="text-white text-xs font-bold">{t(`cashflow.${et.toLowerCase() as 'fixed' | 'subscription' | 'credit'}`)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput placeholder={t('cashflow.expenseName')} placeholderTextColor="#71717A" className="bg-[#262A2E] text-white p-4 rounded-xl mb-3" value={expName} onChangeText={setExpName} />
                <TextInput placeholder={`${t('cashflow.monthlyAmount')} (${symbol})`} placeholderTextColor="#71717A" keyboardType="numeric" className="bg-[#262A2E] text-white p-4 rounded-xl mb-3" value={expAmount} onChangeText={setExpAmount} />
                {expType === 'FIXED' && (
                  <TextInput placeholder={t('cashflow.category')} placeholderTextColor="#71717A" className="bg-[#262A2E] text-white p-4 rounded-xl mb-4" value={expCategory} onChangeText={setExpCategory} />
                )}
                {expType === 'CREDIT' && (
                  <View className="mb-4">
                    <Text className="text-zinc-400 text-xs mb-2">{t('cashflow.installmentsInfo')}</Text>
                    <View className="flex-row justify-between">
                      <TextInput placeholder={t('cashflow.totalMonths')} placeholderTextColor="#71717A" keyboardType="numeric" className="bg-[#262A2E] text-white p-4 rounded-xl flex-1 mr-2" value={creditTotal} onChangeText={setCreditTotal} />
                      <TextInput placeholder={t('cashflow.monthsPaid')} placeholderTextColor="#71717A" keyboardType="numeric" className="bg-[#262A2E] text-white p-4 rounded-xl flex-1 ml-2" value={creditPaid} onChangeText={setCreditPaid} />
                    </View>
                  </View>
                )}
                <TouchableOpacity onPress={handleAddExpense} className="bg-yellow-500 rounded-xl py-4 items-center mt-2">
                  <Text className="text-yellow-950 font-bold text-lg">{t('cashflow.saveExpense')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Subscriptions & Credits */}
            <View className="flex-row justify-between items-end mb-4 px-1">
              <Text className="text-white font-bold text-lg">{t('cashflow.subsAndCredits')}</Text>
              <Text className="text-zinc-500 text-xs font-medium">{t('cashflow.paidThisMonth')}</Text>
            </View>
            {orderedLiabilities.length === 0 && <Text className="text-zinc-500 mb-6">{t('cashflow.noSubs')}</Text>}
            {orderedLiabilities.map((sub) => {
              const isPaid = sub.paymentHistory.includes(activeMonth);
              const currentAmt = getLiabilityAmount(sub, activeMonth);
              return (
                <View key={sub.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4 mb-3">
                  <View className="flex-row items-center">
                    {/* Reorder */}
                    <View className="flex-col mr-2">
                      <TouchableOpacity onPress={() => moveLiability(sub.id, -1)} className="p-1">
                        <ChevronUp color="#52525B" size={14} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => moveLiability(sub.id, 1)} className="p-1">
                        <ChevronDown color="#52525B" size={14} />
                      </TouchableOpacity>
                    </View>
                    <View className="bg-[#262A2E] p-2 rounded-xl mr-3">
                      <Briefcase color="#8B5CF6" size={20} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold">{sub.name}</Text>
                      {sub.type === 'CREDIT' && sub.totalInstallments ? (
                        <Text className="text-zinc-500 text-xs">{t('cashflow.paid')}: {(sub.paidInstallments || 0) + sub.paymentHistory.length} / {sub.totalInstallments}</Text>
                      ) : (
                        <Text className="text-zinc-500 text-xs">{t('cashflow.monthlyFee')}</Text>
                      )}
                    </View>
                    <View className="flex-row items-center gap-1">
                      <TouchableOpacity onPress={() => openOverride(sub.id, 'LIABILITY', sub.name, currentAmt, sub.monthlyPayment)} className="flex-row items-center bg-[#262A2E] px-2 py-2 rounded-lg">
                        <Text className="text-white font-bold text-sm mr-1">{symbol}{currentAmt}</Text>
                        <Pencil color="#A1A1AA" size={12} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openEdit('LIABILITY', sub)} className="bg-[#262A2E] p-2 rounded-lg">
                        <Pencil color="#60A5FA" size={15} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => toggleLiabilityPayment(sub.id, activeMonth)} className={`w-11 h-6 rounded-full justify-center px-1 ${isPaid ? 'bg-[#10B981]' : 'bg-[#3F3F46]'}`}>
                        <View className={`w-4 h-4 rounded-full bg-white ${isPaid ? 'self-end' : 'self-start'}`} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteLiability(sub.id)} className="bg-[#262A2E] p-2 rounded-lg">
                        <Trash2 color="#EF4444" size={15} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Fixed Expenses */}
            <View className="flex-row justify-between items-center mt-6 mb-3 px-1">
              <Text className="text-white font-bold text-lg">{t('cashflow.fixedExpenses')}</Text>
            </View>
            {orderedExpenses.length === 0 && <Text className="text-zinc-600 mb-6 px-1">{t('cashflow.noFixedExpenses')}</Text>}
            {orderedExpenses.map((exp) => {
              const isPaid = exp.paymentHistory?.includes(activeMonth);
              const currentAmt = getExpenseAmount(exp, activeMonth);
              return (
                <View key={exp.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4 mb-3">
                  <View className="flex-row items-center">
                    {/* Reorder */}
                    <View className="flex-col mr-2">
                      <TouchableOpacity onPress={() => moveExpense(exp.id, -1)} className="p-1">
                        <ChevronUp color="#52525B" size={14} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => moveExpense(exp.id, 1)} className="p-1">
                        <ChevronDown color="#52525B" size={14} />
                      </TouchableOpacity>
                    </View>
                    <CheckCircle color="#F87171" size={22} />
                    <View className="ml-3 flex-1">
                      <Text className="text-white font-bold">{exp.name}</Text>
                      <Text className="text-zinc-500 text-xs uppercase">{exp.category}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <TouchableOpacity onPress={() => openOverride(exp.id, 'FIXED_EXPENSE', exp.name, currentAmt, exp.amount)} className="flex-row items-center bg-[#262A2E] px-2 py-2 rounded-lg">
                        <Text className="text-white font-bold text-sm mr-1">-{symbol}{currentAmt.toLocaleString()}</Text>
                        <Pencil color="#A1A1AA" size={12} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openEdit('FIXED_EXPENSE', exp)} className="bg-[#262A2E] p-2 rounded-lg">
                        <Pencil color="#60A5FA" size={15} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => toggleFixedExpensePayment(exp.id, activeMonth)} className={`w-11 h-6 rounded-full justify-center px-1 ${isPaid ? 'bg-[#10B981]' : 'bg-[#3F3F46]'}`}>
                        <View className={`w-4 h-4 rounded-full bg-white ${isPaid ? 'self-end' : 'self-start'}`} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteFixedExpense(exp.id)} className="bg-[#262A2E] p-2 rounded-lg">
                        <Trash2 color="#EF4444" size={15} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View className="h-10" />
      </ScrollView>

      {/* Override modal */}
      {overrideInfo && (
        <EditAmountModal
          visible={isOverrideModalVisible}
          onClose={() => setIsOverrideModalVisible(false)}
          currentAmount={overrideInfo.currentAmount}
          defaultAmount={overrideInfo.defaultAmount}
          itemName={overrideInfo.name}
          onSave={(newAmount) => setAmountOverride(overrideInfo.type, overrideInfo.id, activeMonth, newAmount)}
        />
      )}

      {/* Edit item modal */}
      <EditItemModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        type={editType}
        item={editItem}
        onSave={handleEditSave}
        symbol={symbol}
      />
    </View>
  );
}
