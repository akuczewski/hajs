import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Briefcase, Activity, CheckCircle, Plus, Trash2 } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useBudgetStore } from '../../store/useBudgetStore';

export default function CashflowScreen() {
  const { incomes, fixedExpenses, liabilities, addIncome, addFixedExpense, addLiability, toggleLiabilityPayment, deleteIncome, deleteFixedExpense, deleteLiability } = useBudgetStore();
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
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'INCOMES' ? 'bg-[#262A2E]' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'INCOMES' ? 'text-[#34D399]' : 'text-zinc-500'}`}>INCOMES</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('EXPENSES')}
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'EXPENSES' ? 'bg-[#262A2E]' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'EXPENSES' ? 'text-yellow-500' : 'text-zinc-500'}`}>EXPENSES</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        
        {activeTab === 'INCOMES' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 items-start">
              <Text className="text-zinc-400 font-medium mb-2">Total Monthly Income</Text>
              <Text className="text-[#34D399] text-5xl font-extrabold tracking-tighter">${totalIncome.toLocaleString()}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => setIsAddingIncome(!isAddingIncome)}
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
              className="border border-[#10B981] rounded-2xl py-4 flex-row justify-center items-center mb-6"
            >
              <Plus color="#10B981" size={20} />
              <Text className="text-[#10B981] font-bold ml-2">Add Income Source</Text>
            </TouchableOpacity>

            {isAddingIncome && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
                <Text className="text-white font-bold mb-4">New Income</Text>
                <TextInput
                  placeholder="Source Name (e.g. Salary, Upwork)"
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={incName}
                  onChangeText={setIncName}
                />
                <TextInput
                  placeholder="Amount ($)"
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-4"
                  value={incAmount}
                  onChangeText={setIncAmount}
                />
                <View className="flex-row items-center justify-between bg-[#262A2E] p-4 rounded-xl mb-5">
                  <View>
                    <Text className="text-white font-medium">Is this a Fixed Income?</Text>
                    <Text className="text-zinc-500 text-xs mt-1">Variable incomes use 5-month avg.</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setIncIsFixed(!incIsFixed)}
                    className={`w-12 h-6 rounded-full justify-center px-1 ${incIsFixed ? 'bg-[#10B981]' : 'bg-[#3F3F46]'}`}
                  >
                    <View className={`w-4 h-4 rounded-full bg-white ${incIsFixed ? 'self-end' : 'self-start'}`} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleAddIncome} className="bg-[#10B981] rounded-xl py-4 items-center">
                  <Text className="text-[#022C22] font-bold text-lg">Save Income</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">Fixed Income (Salary)</Text>
            {fixedIncomes.length === 0 && <Text className="text-zinc-600 mb-6 px-1">No fixed incomes added.</Text>}
            {fixedIncomes.map(inc => (
              <View key={inc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Briefcase color="#10B981" size={24} />
                  <Text className="text-white font-bold text-lg ml-3">{inc.name}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-lg mr-3">${inc.amount.toLocaleString()}</Text>
                  <TouchableOpacity onPress={() => deleteIncome(inc.id)} className="ml-2 bg-[#262A2E] p-2 rounded-lg">
                    <Trash2 color="#EF4444" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-4 mb-3 px-1">Variable Income</Text>
            {variableIncomes.length === 0 && <Text className="text-zinc-600 mb-6 px-1">No variable incomes added.</Text>}
            {variableIncomes.map(inc => (
              <View key={inc.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 relative overflow-hidden">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <Activity color="#10B981" size={20} />
                    <Text className="text-white font-bold text-lg ml-2">{inc.name}</Text>
                  </View>
                  <Text className="text-white font-bold text-lg">${inc.amount.toLocaleString()}</Text>
                </View>
                
                <View className="flex-row justify-between items-end">
                  <View className="w-1/2 h-12">
                    <Svg height="100%" width="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <Path d="M0 30 L 20 10 L 40 35 L 60 5 L 80 20 L 100 0" fill="none" stroke="#34D399" strokeWidth="2" />
                    </Svg>
                    <Text className="text-zinc-600 text-[10px] mt-1">Last 5 Months</Text>
                  </View>
                  <View className="items-end mr-12">
                    <Text className="text-zinc-400 text-xs font-medium">Calculated Average</Text>
                    <Text className="text-[#34D399] font-bold text-lg">${inc.amount}/mo</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => deleteIncome(inc.id)} className="absolute top-4 right-4 bg-[#262A2E] p-2 rounded-lg">
                  <Trash2 color="#EF4444" size={18} />
                </TouchableOpacity>

                <TouchableOpacity className="absolute bottom-4 right-4 bg-[#34D399] p-3 rounded-full border border-[#059669]">
                  <Plus color="#022C22" size={24} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'EXPENSES' && (
          <View>
            <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-6 items-start">
              <Text className="text-zinc-400 font-medium mb-2">Total Monthly Expenses & Subs</Text>
              <Text className="text-yellow-500 text-5xl font-extrabold tracking-tighter">${totalExpenses.toLocaleString()}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => setIsAddingExpense(!isAddingExpense)}
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
              className="border border-yellow-500 rounded-2xl py-4 flex-row justify-center items-center mb-6"
            >
              <Plus color="#EAB308" size={20} />
              <Text className="text-yellow-500 font-bold ml-2">Add Expense or Sub</Text>
            </TouchableOpacity>

            {isAddingExpense && (
              <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-8">
                <Text className="text-white font-bold mb-4">New Expense</Text>
                
                <View className="flex-row bg-[#262A2E] rounded-lg p-1 mb-4">
                  <TouchableOpacity 
                    onPress={() => setExpType('FIXED')}
                    className={`flex-1 py-2 items-center rounded-md ${expType === 'FIXED' ? 'bg-[#3F3F46]' : ''}`}
                  >
                    <Text className="text-white text-xs font-bold">Fixed Expense</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setExpType('SUBSCRIPTION')}
                    className={`flex-1 py-2 items-center rounded-md ${expType === 'SUBSCRIPTION' ? 'bg-[#3F3F46]' : ''}`}
                  >
                    <Text className="text-white text-xs font-bold">Subscription</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setExpType('CREDIT')}
                    className={`flex-1 py-2 items-center rounded-md ${expType === 'CREDIT' ? 'bg-[#3F3F46]' : ''}`}
                  >
                    <Text className="text-white text-xs font-bold">Credit/Loan</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="Name (e.g. Electricity, Netflix)"
                  placeholderTextColor="#71717A"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={expName}
                  onChangeText={setExpName}
                />
                <TextInput
                  placeholder="Monthly Amount ($)"
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  className="bg-[#262A2E] text-white p-4 rounded-xl mb-3"
                  value={expAmount}
                  onChangeText={setExpAmount}
                />
                
                {expType === 'FIXED' && (
                  <TextInput
                    placeholder="Category (e.g. Taxes, Bills, Car)"
                    placeholderTextColor="#71717A"
                    className="bg-[#262A2E] text-white p-4 rounded-xl mb-4"
                    value={expCategory}
                    onChangeText={setExpCategory}
                  />
                )}

                {expType === 'CREDIT' && (
                  <View className="mb-4">
                    <Text className="text-zinc-400 text-xs mb-2">Number of months/installments (not cash):</Text>
                    <View className="flex-row justify-between">
                      <TextInput
                        placeholder="Total months (e.g. 24)"
                        placeholderTextColor="#71717A"
                        keyboardType="numeric"
                        className="bg-[#262A2E] text-white p-4 rounded-xl flex-1 mr-2"
                        value={creditTotalInstallments}
                        onChangeText={setCreditTotalInstallments}
                      />
                      <TextInput
                        placeholder="Months paid (e.g. 5)"
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
                  <Text className="text-yellow-950 font-bold text-lg">Save Expense</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Subscriptions / Liabilities */}
            <View className="flex-row justify-between items-end mb-4 px-1">
              <Text className="text-white font-bold text-lg">Subscriptions & Credits</Text>
              <Text className="text-zinc-500 text-xs font-medium">Paid this Month</Text>
            </View>
            {liabilities.length === 0 && <Text className="text-zinc-500 mb-6">No subscriptions or credits added.</Text>}
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
                          Paid: {(sub.paidInstallments || 0) + sub.paymentHistory.length} / {sub.totalInstallments} ( {Math.round((((sub.paidInstallments || 0) + sub.paymentHistory.length) / sub.totalInstallments) * 100)}% )
                        </Text>
                      ) : (
                        <Text className="text-zinc-500 text-xs">Monthly fee</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-white font-bold text-lg mr-4">${sub.monthlyPayment}</Text>
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

            {/* Fixed Expenses */}
            <View className="flex-row justify-between items-center mt-6 mb-3 px-1">
              <Text className="text-white font-bold text-lg">Fixed Expenses</Text>
            </View>
            {fixedExpenses.length === 0 && <Text className="text-zinc-600 mb-6 px-1">No fixed expenses added.</Text>}
            {fixedExpenses.map(exp => (
              <View key={exp.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <CheckCircle color="#F87171" size={24} />
                  <View className="ml-3">
                    <Text className="text-white font-bold text-lg">{exp.name}</Text>
                    <Text className="text-zinc-500 text-xs uppercase">{exp.category}</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-lg mr-3">-${exp.amount.toLocaleString()}</Text>
                  <TouchableOpacity onPress={() => deleteFixedExpense(exp.id)} className="bg-[#262A2E] p-2 rounded-lg">
                    <Trash2 color="#EF4444" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          </View>
        )}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
