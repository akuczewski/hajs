import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Income, FixedExpense, Liability } from '../store/types';
import { useTranslation } from '../store/i18n';

type EditableItem = Income | FixedExpense | Liability;

interface EditItemModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'INCOME' | 'FIXED_EXPENSE' | 'LIABILITY';
  item: EditableItem | null;
  onSave: (updates: Partial<EditableItem>) => void;
  symbol: string;
}

export default function EditItemModal({ visible, onClose, type, item, onSave, symbol }: EditItemModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isFixed, setIsFixed] = useState(true);
  const [liabilityType, setLiabilityType] = useState<'CREDIT' | 'SUBSCRIPTION'>('SUBSCRIPTION');
  const [totalInstallments, setTotalInstallments] = useState('');

  useEffect(() => {
    if (!item) return;
    setName(item.name);
    if (type === 'INCOME') {
      const inc = item as Income;
      setAmount(inc.amount.toString());
      setIsFixed(inc.isFixed);
    } else if (type === 'FIXED_EXPENSE') {
      const exp = item as FixedExpense;
      setAmount(exp.amount.toString());
      setCategory(exp.category || '');
    } else if (type === 'LIABILITY') {
      const lib = item as Liability;
      setAmount(lib.monthlyPayment.toString());
      setLiabilityType(lib.type);
      setTotalInstallments(lib.totalInstallments?.toString() || '');
    }
  }, [item, type, visible]);

  const handleSave = () => {
    if (!name || !amount) return;
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return;

    if (type === 'INCOME') {
      onSave({ name, amount: parsed, isFixed });
    } else if (type === 'FIXED_EXPENSE') {
      onSave({ name, amount: parsed, category: category || t('cashflow.categoryOther') });
    } else if (type === 'LIABILITY') {
      onSave({
        name,
        monthlyPayment: parsed,
        type: liabilityType,
        totalInstallments: totalInstallments ? parseInt(totalInstallments) : undefined,
      });
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={{ backgroundColor: '#1C1F22', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderColor: '#272A2E', padding: 24 }}>
          <View style={{ width: 36, height: 4, backgroundColor: '#3F3F46', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 20 }}>
            {type === 'INCOME' ? t('cashflow.newIncome') : type === 'FIXED_EXPENSE' ? t('cashflow.newExpense') : t('cashflow.newLiability')}
          </Text>

          {/* Name */}
          <TextInput
            placeholder={t('cashflow.incomeName')}
            placeholderTextColor="#71717A"
            style={{ backgroundColor: '#262A2E', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 12, fontSize: 15 }}
            value={name}
            onChangeText={setName}
          />

          {/* Amount */}
          <TextInput
            placeholder={`${t('cashflow.amount')} (${symbol})`}
            placeholderTextColor="#71717A"
            keyboardType="numeric"
            style={{ backgroundColor: '#262A2E', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 12, fontSize: 15 }}
            value={amount}
            onChangeText={setAmount}
          />

          {/* Income: fixed toggle */}
          {type === 'INCOME' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#262A2E', padding: 14, borderRadius: 12, marginBottom: 12 }}>
              <Text style={{ color: '#fff', fontWeight: '500' }}>{t('cashflow.isOneTime')}</Text>
              <TouchableOpacity
                onPress={() => setIsFixed(!isFixed)}
                style={{ width: 48, height: 24, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 4, backgroundColor: !isFixed ? '#34D399' : '#3F3F46' }}
              >
                <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', alignSelf: !isFixed ? 'flex-end' : 'flex-start' }} />
              </TouchableOpacity>
            </View>
          )}

          {/* Fixed expense: category */}
          {type === 'FIXED_EXPENSE' && (
            <TextInput
              placeholder={t('cashflow.category')}
              placeholderTextColor="#71717A"
              style={{ backgroundColor: '#262A2E', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 12, fontSize: 15 }}
              value={category}
              onChangeText={setCategory}
            />
          )}

          {/* Liability: type + installments */}
          {type === 'LIABILITY' && (
            <>
              <View style={{ flexDirection: 'row', backgroundColor: '#262A2E', borderRadius: 10, padding: 4, marginBottom: 12 }}>
                {(['SUBSCRIPTION', 'CREDIT'] as const).map(lt => (
                  <TouchableOpacity
                    key={lt}
                    onPress={() => setLiabilityType(lt)}
                    style={{ flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: liabilityType === lt ? '#3F3F46' : 'transparent' }}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                      {lt === 'SUBSCRIPTION' ? t('cashflow.subscription') : t('cashflow.credit')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {liabilityType === 'CREDIT' && (
                <TextInput
                  placeholder={t('cashflow.totalMonths')}
                  placeholderTextColor="#71717A"
                  keyboardType="numeric"
                  style={{ backgroundColor: '#262A2E', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 12, fontSize: 15 }}
                  value={totalInstallments}
                  onChangeText={setTotalInstallments}
                />
              )}
            </>
          )}

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, backgroundColor: '#262A2E', paddingVertical: 16, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#A1A1AA', fontWeight: '700' }}>{t('settings.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={{ flex: 1, backgroundColor: '#34D399', paddingVertical: 16, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#022C22', fontWeight: '700' }}>{t('cashflow.saveIncome')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
