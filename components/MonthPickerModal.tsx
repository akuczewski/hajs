import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useTranslation } from '../store/i18n';

interface MonthPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (month: string) => void;
  currentValue?: string; // 'YYYY-MM'
  title?: string;
}

export default function MonthPickerModal({ visible, onClose, onSelect, currentValue, title }: MonthPickerModalProps) {
  const { t } = useTranslation();
  
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (visible && currentValue) {
      setYear(parseInt(currentValue.split('-')[0]));
    }
  }, [visible, currentValue]);

  const months = [
    t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
    t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
    t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')
  ];

  const handleSelect = (index: number) => {
    const monthStr = (index + 1).toString().padStart(2, '0');
    onSelect(`${year}-${monthStr}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-[#1C1F22] rounded-t-3xl p-6 h-[60%] border-t border-[#272A2E]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-xl font-bold">{title || t('savings.selectDeadline')}</Text>
            <TouchableOpacity onPress={onClose} className="bg-[#262A2E] p-2 rounded-full">
              <X color="#A1A1AA" size={20} />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center mb-6 px-4">
            <TouchableOpacity onPress={() => setYear(year - 1)} className="p-2">
              <ChevronLeft color="#34D399" size={28} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">{year}</Text>
            <TouchableOpacity onPress={() => setYear(year + 1)} className="p-2">
              <ChevronRight color="#34D399" size={28} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="flex-row flex-wrap justify-between">
              {months.map((monthName, index) => {
                const isSelected = currentValue === `${year}-${(index + 1).toString().padStart(2, '0')}`;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect(index)}
                    className={`w-[31%] py-4 mb-3 rounded-2xl items-center border ${
                      isSelected 
                        ? 'bg-[#34D399] border-[#34D399]' 
                        : 'bg-[#262A2E] border-[#3F3F46]'
                    }`}
                  >
                    <Text className={`font-bold ${isSelected ? 'text-[#111315]' : 'text-zinc-300'}`}>
                      {monthName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
