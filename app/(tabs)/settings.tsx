import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useBudgetStore, EXCHANGE_RATES, CURRENCY_SYMBOLS } from '../../store/useBudgetStore';
import { Currency } from '../../store/types';
import { Settings as SettingsIcon, Globe, Trash2, RefreshCw } from 'lucide-react-native';

export default function SettingsScreen() {
  const { currency, changeCurrency } = useBudgetStore();

  const handleCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === currency) return;
    
    Alert.alert(
      "Zmień walutę",
      `Czy na pewno chcesz zmienić walutę z ${currency} na ${newCurrency}? Wszystkie Twoje środki zostaną przeliczone po kursie.`,
      [
        { text: "Anuluj", style: "cancel" },
        { 
          text: "Przelicz", 
          onPress: () => changeCurrency(newCurrency),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="pt-6 px-5">
        
        {/* Header */}
        <View className="mb-8 flex-row items-center">
          <SettingsIcon color="#3B82F6" size={32} />
          <Text className="text-white text-3xl font-bold ml-3">Ustawienia</Text>
        </View>

        {/* Currency Settings */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-6">
          <View className="flex-row items-center mb-4">
            <Globe color="#3B82F6" size={24} />
            <Text className="text-white text-xl font-bold ml-3">Waluta i Region</Text>
          </View>
          <Text className="text-zinc-400 text-sm mb-5">
            Wybierz główną walutę, w której chcesz prowadzić budżet. Zmiana waluty spowoduje automatyczne przeliczenie całego majątku.
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {(Object.keys(EXCHANGE_RATES) as Currency[]).map(curr => (
              <TouchableOpacity
                key={curr}
                onPress={() => handleCurrencyChange(curr)}
                style={currency === curr ? { backgroundColor: 'rgba(59, 130, 246, 0.2)' } : undefined}
                className={`py-3 px-5 rounded-xl border flex-row items-center ${currency === curr ? 'border-[#3B82F6]' : 'bg-[#262A2E] border-[#3F3F46]'}`}
              >
                <Text className={`font-bold mr-2 ${currency === curr ? 'text-[#3B82F6]' : 'text-zinc-400'}`}>
                  {curr}
                </Text>
                <Text className={`font-bold ${currency === curr ? 'text-[#3B82F6]' : 'text-zinc-400'}`}>
                  ({CURRENCY_SYMBOLS[curr]})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={{ borderColor: 'rgba(127, 29, 29, 0.5)' }} className="bg-[#1C1F22] border rounded-3xl p-5 mb-8">
          <View className="flex-row items-center mb-4">
            <Trash2 color="#EF4444" size={24} />
            <Text className="text-white text-xl font-bold ml-3">Niebezpieczna Strefa</Text>
          </View>
          <Text className="text-zinc-400 text-sm mb-5">
            Usunięcie danych spowoduje nieodwracalną utratę historii transakcji i wszystkich kont.
          </Text>

          <TouchableOpacity 
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.5)' }}
            className="border py-4 rounded-xl items-center flex-row justify-center"
          >
            <RefreshCw color="#EF4444" size={20} />
            <Text className="text-red-500 font-bold ml-2">Wyczyść wszystkie dane (Reset)</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
