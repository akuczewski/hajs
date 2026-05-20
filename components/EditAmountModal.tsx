import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from '../store/i18n';
import { useBudgetStore, CURRENCY_SYMBOLS } from '../store/useBudgetStore';

interface EditAmountModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (amount: number | null) => void;
  currentAmount: number;
  defaultAmount: number;
  itemName: string;
}

export default function EditAmountModal({ visible, onClose, onSave, currentAmount, defaultAmount, itemName }: EditAmountModalProps) {
  const { t } = useTranslation();
  const currency = useBudgetStore(state => state.currency);
  const symbol = CURRENCY_SYMBOLS[currency] || 'zł';
  
  const [amount, setAmount] = useState(currentAmount.toString());

  useEffect(() => {
    if (visible) {
      setAmount(currentAmount.toString());
    }
  }, [visible, currentAmount]);

  const handleSave = () => {
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!isNaN(parsed)) {
      onSave(parsed);
    }
    onClose();
  };

  const handleReset = () => {
    onSave(null); // Passing null could mean "remove override"
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-[#1C1F22] rounded-t-3xl p-6 border-t border-[#272A2E]">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white text-xl font-bold">{t('cashflow.editAmount')}</Text>
                <Text className="text-zinc-500 text-sm mt-1">{itemName}</Text>
              </View>
              <TouchableOpacity onPress={onClose} className="bg-[#262A2E] p-2 rounded-full">
                <X color="#A1A1AA" size={20} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-[#262A2E] p-4 rounded-xl mb-6 border border-[#3F3F46]">
              <Text className="text-zinc-400 font-bold mr-2">{symbol}</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="text-white text-2xl font-bold flex-1"
                autoFocus
              />
            </View>

            <TouchableOpacity onPress={handleSave} className="bg-[#34D399] rounded-xl py-4 items-center mb-4">
              <Text className="text-[#111315] font-bold text-lg">{t('cashflow.saveAmount')}</Text>
            </TouchableOpacity>
            
            {currentAmount !== defaultAmount && (
              <TouchableOpacity onPress={handleReset} className="py-4 items-center border border-[#3F3F46] rounded-xl mb-4">
                <Text className="text-white font-bold">{t('cashflow.resetToDefault')} ({symbol}{defaultAmount})</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
