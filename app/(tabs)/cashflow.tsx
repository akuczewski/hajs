import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Briefcase, Activity, CheckCircle, Plus, Trash2 } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useBudgetStore, CURRENCY_SYMBOLS } from '../../store/useBudgetStore';
import { useTranslation } from '../../store/i18n';

export default function CashflowScreen() {
  const { incomes, fixedExpenses, liabilities, addIncome, addFixedExpense, addLiability, toggleLiabilityPayment, toggleFixedExpensePayment, deleteIncome, deleteFixedExpense, deleteLiability, currency } = useBudgetStore();
  const { t } = useTranslation();
  const symbol = CURRENCY_SYMBOLS[currency] || 'zł';
  const [activeTab, setActiveTab] = useState<'INCOMES' | 'EXPENSES'>('INCOMES');
  
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Forms state
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [incName, setIncName] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incIsFixed, setIncIsFixed] = useState(true);

  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expName, setExpName] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expType, setExpType] = useState<'FIXED' | 'SUBSCRIPTION' | 'CREDIT'>('FIXED');
  const [expCategory, setExpCategory] = useState('');
  const [creditTotalInstallments, setCreditTotalInstallments] = useState('');
  const [creditPaidInstallments, setCreditPaidInstallments] = useState('');

  // Computations
  const fixedIncomes = incomes.filter(i => i.isFixed);
  const variableIncomes = incomes.filter(i => !i.isFixed);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0) + 
                        liabilities.reduce((acc, curr) => acc + curr.monthlyPayment, 0);

  const handleAddIncome = () => {
    if (!incName || !incAmount) return;
    addIncome({
      id: Date.now().toString(),
      name: incName,
      amount: parseFloat(incAmount),
      isFixed: incIsFixed,
      history: [],
      createdAt: new Date().toISOString()
    });
    setIncName('');
    setIncAmount('');
    setIsAddingIncome(false);
  };

  const handleAddExpense = () => {
    if (!expName || !expAmount) return;
    if (expType === 'FIXED') {
      addFixedExpense({
        id: Date.now().toString(),
        name: expName,
        amount: parseFloat(expAmount),
        category: expCategory || 'Inne',
        paymentHistory: [],
        createdAt: new Date().toISOString()
      });
    } else if (expType === 'SUBSCRIPTION') {
      addLiability({
        id: Date.now().toString(),
        name: expName,
        type: 'SUBSCRIPTION',
        monthlyPayment: parseFloat(expAmount),
        paymentHistory: [],
        createdAt: new Date().toISOString()
      });
    } else if (expType === 'CREDIT') {
      addLiability({
        id: Date.now().toString(),
        name: expName,
        type: 'CREDIT',
        monthlyPayment: parseFloat(expAmount),
        totalInstallments: parseInt(creditTotalInstallments) || undefined,
        paidInstallments: parseInt(creditPaidInstallments) || 0,
        paymentHistory: [],
        createdAt: new Date().toISOString()
      });
    }
    setExpName('');
    setExpAmount('');
    setExpCategory('');
    setCreditTotalInstallments('');
    setCreditPaidInstallments('');
    setIsAddingExpense(false);
  };

  return (
    <View className="flex-1 bg-[#111315] pt-12">
      <View className="px-5 py-4 border-b border-zinc-800">
        <Text className="text-white text-2xl font-bold mb-4">Cashflow</Text>
        
        <View className="flex-row bg-[#1C1F22] rounded-xl p-1 border border-[#272A2E]">
          <TouchableOpacity 
            onPress={() => setActiveTab('INCOMES')}
            className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'INCOMES' ? 'bg-[#3B82F6]' : 'bg-[#1C1F22]'}`}
          >
            <Text className={`font-bold ${activeTab === 'INCOMES' ? 'text-white' : 'text-zinc-500'}`}>{t('cashflow.incomesTab')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('EXPENSES')}
            className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'EXPENSES' ? 'bg-[#3B82F6]' : 'bg-[#1C1F22]'}`}
          >
            <Text className={`font-bold ${activeTab === 'EXPENSES' ? 'text-white' : 'text-zinc-500'}`}>{t('cashflow.expensesTab')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        
        {activeTab === 'INCOMES' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 items-start">
              <Text className="text-zinc-400 font-medium mb-2">{t('cashflow.totalMonthlyIncome')}</Text>
              <Text className="text-[#34D399] text-5xl font-extrabold tracking-tighter">{symbol}{totalIncome.toLocaleString()}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => setIsAddingIncome(!isAddingIncome)}
              className="bg-[#1C1F22] border border-dashed border-zinc-700 py-4 rounded-2xl items-center flex-row justify-center mb-6"
            >
              <Plus color="#34D399" size={20} />
              <Text className="text-[#34D399] font-bold ml-2">{t('cashflow.addIncome')}</Text>
            </TouchableOpacity>

            {isAddingIncome && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-6">
                <Text className="text-white text-xl font-bold mb-4">{t('cashflow.newIncome')}</Text>
                <TextInput
                  placeholder={t('cashflow.incomeName')}
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={incName}
                  onChangeText={setIncName}
                />
                <TextInput
                  placeholder={`${t('cashflow.amount')} (${symbol})`}
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-4"
                  value={incAmount}
                  onChangeText={setIncAmount}
                />
                <View className="flex-row items-center justify-between bg-[#262A2E] p-4 rounded-xl mb-5">
                  <View>
                    <Text className="text-white font-medium">{t('cashflow.isOneTime')}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setIncIsFixed(!incIsFixed)}
                    className={`w-12 h-6 rounded-full justify-center px-1 ${!incIsFixed ? 'bg-[#34D399]' : 'bg-[#3F3F46]'}`}
                  >
                    <View className={`w-4 h-4 rounded-full bg-white ${!incIsFixed ? 'self-end' : 'self-start'}`} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleAddIncome} className="bg-[#34D399] rounded-xl py-4 items-center">
                  <Text className="text-[#022C22] font-bold text-lg">{t('cashflow.saveIncome')}</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">{t('cashflow.fixedIncome')}</Text>
            {fixedIncomes.length === 0 && <Text className="text-zinc-600 mb-6 px-1">{t('cashflow.noFixedIncomes')}</Text>}
            {fixedIncomes.map(inc => (
              <View key={inc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Briefcase color="#10B981" size={24} />
                  <Text className="text-white font-bold text-lg ml-3">{inc.name}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-lg mr-3">{symbol}{inc.amount.toLocaleString()}</Text>
                  <TouchableOpacity onPress={() => deleteIncome(inc.id)} className="ml-2 bg-[#262A2E] p-2 rounded-lg">
                    <Trash2 color="#EF4444" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-4 mb-3 px-1">{t('cashflow.variableIncome')}</Text>
            {variableIncomes.length === 0 && <Text className="text-zinc-600 mb-6 px-1">{t('cashflow.noVariableIncomes')}</Text>}
            {variableIncomes.map(inc => (
              <View key={inc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 relative overflow-hidden">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <Activity color="#10B981" size={20} />
                    <Text className="text-white font-bold text-lg ml-2">{inc.name}</Text>
                  </View>
                  <Text className="text-white font-bold text-lg">{symbol}{inc.amount.toLocaleString()}</Text>
                </View>
                
                <View className="flex-row justify-between items-end">
                  <View className="w-1/2 h-12">
                    <Svg height="100%" width="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <Path d="M0 30 L 20 10 L 40 35 L 60 5 L 80 20 L 100 0" fill="none" stroke="#34D399" strokeWidth="2" />
                    </Svg>
                    <Text className="text-zinc-600 text-[10px] mt-1">{t('cashflow.last5Months')}</Text>
                  </View>
                  <View className="items-end mr-12">
                    <Text className="text-zinc-400 text-xs font-medium">{t('cashflow.calculatedAverage')}</Text>
                    <Text className="text-[#34D399] font-bold text-lg">{symbol}{inc.amount}/mo</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => deleteIncome(inc.id)} className="absolute top-4 right-4 bg-[#262A2E] p-2 rounded-lg">
                  <Trash2 color="#EF4444" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'EXPENSES' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 items-start">
              <Text className="text-zinc-400 font-medium mb-2">{t('cashflow.totalMonthlyExpenses')}</Text>
              <Text className="text-yellow-500 text-5xl font-extrabold tracking-tighter">{symbol}{totalExpenses.toLocaleString()}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => setIsAddingExpense(!isAddingExpense)}
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
              className="border border-yellow-500 rounded-2xl py-4 flex-row justify-center items-center mb-6"
            >
              <Plus color="#EAB308" size={20} />
              <Text className="text-yellow-500 font-bold ml-2">{t('cashflow.addExpense')}</Text>
            </TouchableOpacity>

            {isAddingExpense && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-6">
                <Text className="text-white text-xl font-bold mb-4">{t('cashflow.newExpense')}</Text>
                
                <View className="flex-row bg-[#262A2E] rounded-lg p-1 mb-4">
                  <TouchableOpacity 
                    onPress={() => setExpType('FIXED')}
                    className={`flex-1 py-2 items-center rounded-md ${expType === 'FIXED' ? 'bg-[#3F3F46]' : ''}`}
                  >
                    <Text className="text-white text-xs font-bold">{t('cashflow.fixed')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setExpType('SUBSCRIPTION')}
                    className={`flex-1 py-2 items-center rounded-md ${expType === 'SUBSCRIPTION' ? 'bg-[#3F3F46]' : ''}`}
                  >
                    <Text className="text-white text-xs font-bold">{t('cashflow.subscription')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setExpType('CREDIT')}
                    className={`flex-1 py-2 items-center rounded-md ${expType === 'CREDIT' ? 'bg-[#3F3F46]' : ''}`}
                  >
                    <Text className="text-white text-xs font-bold">{t('cashflow.credit')}</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder={t('cashflow.expenseName')}
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={expName}
                  onChangeText={setExpName}
                />
                <TextInput
                  placeholder={`${t('cashflow.monthlyAmount')} (${symbol})`}
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={expAmount}
                  onChangeText={setExpAmount}
                />
                
                {expType === 'FIXED' && (
                  <TextInput
                    placeholder={t('cashflow.category')}
                    placeholderTextColor="#71717A"
                    className="bg-[#262A2E] text-white p-4 rounded-xl mb-4"
                    value={expCategory}
                    onChangeText={setExpCategory}
                  />
                )}

                {expType === 'CREDIT' && (
                  <View className="mb-4">
                    <Text className="text-zinc-400 text-xs mb-2">{t('cashflow.installmentsInfo')}</Text>
                    <View className="flex-row justify-between">
                      <TextInput
                        placeholder={t('cashflow.totalMonths')}
                        placeholderTextColor="#71717A"
                        keyboardType="numeric"
                        className="bg-[#262A2E] text-white p-4 rounded-xl flex-1 mr-2"
                        value={creditTotalInstallments}
                        onChangeText={setCreditTotalInstallments}
                      />
                      <TextInput
                        placeholder={t('cashflow.monthsPaid')}
                        placeholderTextColor="#71717A"
                        keyboardType="numeric"
                        className="bg-[#262A2E] text-white p-4 rounded-xl flex-1 ml-2"
                        value={creditPaidInstallments}
                        onChangeText={setCreditPaidInstallments}
                      />
                    </View>
                  </View>
                )}

                <TouchableOpacity onPress={handleAddExpense} className="bg-yellow-500 rounded-xl py-4 items-center mt-2">
                  <Text className="text-yellow-950 font-bold text-lg">{t('cashflow.saveExpense')}</Text>
                </TouchableOpacity>
              </View>
            )}

            <View className="flex-row justify-between items-end mb-4 px-1">
              <Text className="text-white font-bold text-lg">{t('cashflow.subsAndCredits')}</Text>
              <Text className="text-zinc-500 text-xs font-medium">{t('cashflow.paidThisMonth')}</Text>
            </View>
            {liabilities.length === 0 && <Text className="text-zinc-500 mb-6">{t('cashflow.noSubs')}</Text>}
            {liabilities.map(sub => {
              const isPaidThisMonth = sub.paymentHistory.includes(currentMonth);
              return (
                <View key={sub.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4 mb-3 flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-[#262A2E] p-2 rounded-xl mr-4">
                      <Briefcase color="#8B5CF6" size={24} />
                    </View>
                    <View>
                      <Text className="text-white font-bold text-lg">{sub.name}</Text>
                      {sub.type === 'CREDIT' && sub.totalInstallments ? (
                        <Text className="text-zinc-500 text-xs">
                          {t('cashflow.paid')}: {(sub.paidInstallments || 0) + sub.paymentHistory.length} / {sub.totalInstallments}
                        </Text>
                      ) : (
                        <Text className="text-zinc-500 text-xs">{t('cashflow.monthlyFee')}</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-white font-bold text-lg mr-4">{symbol}{sub.monthlyPayment}</Text>
                    <TouchableOpacity 
                      onPress={() => toggleLiabilityPayment(sub.id, currentMonth)}
                      className={`w-12 h-6 rounded-full justify-center px-1 mr-3 ${isPaidThisMonth ? 'bg-[#10B981]' : 'bg-[#3F3F46]'}`}
                    >
                      <View className={`w-4 h-4 rounded-full bg-white ${isPaidThisMonth ? 'self-end' : 'self-start'}`} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteLiability(sub.id)} className="bg-[#262A2E] p-2 rounded-lg">
                      <Trash2 color="#EF4444" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View className="flex-row justify-between items-center mt-6 mb-3 px-1">
              <Text className="text-white font-bold text-lg">{t('cashflow.fixedExpenses')}</Text>
            </View>
            {fixedExpenses.length === 0 && <Text className="text-zinc-600 mb-6 px-1">{t('cashflow.noFixedExpenses')}</Text>}
            {fixedExpenses.map(exp => {
              const isPaidThisMonth = exp.paymentHistory?.includes(currentMonth);
              return (
                <View key={exp.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <CheckCircle color="#F87171" size={24} />
                    <View className="ml-3">
                      <Text className="text-white font-bold text-lg">{exp.name}</Text>
                      <Text className="text-zinc-500 text-xs uppercase">{exp.category}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-white font-bold text-lg mr-4">-{symbol}{exp.amount.toLocaleString()}</Text>
                    <TouchableOpacity 
                      onPress={() => toggleFixedExpensePayment(exp.id, currentMonth)}
                      className={`w-12 h-6 rounded-full justify-center px-1 mr-3 ${isPaidThisMonth ? 'bg-[#10B981]' : 'bg-[#3F3F46]'}`}
                    >
                      <View className={`w-4 h-4 rounded-full bg-white ${isPaidThisMonth ? 'self-end' : 'self-start'}`} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteFixedExpense(exp.id)} className="bg-[#262A2E] p-2 rounded-lg">
                      <Trash2 color="#EF4444" size={18} />
                    </TouchableOpacity>
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
