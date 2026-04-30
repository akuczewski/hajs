import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useBudgetStore, EXCHANGE_RATES, CURRENCY_SYMBOLS } from '../../store/useBudgetStore';
import { Currency, Language } from '../../store/types';
import { Settings as SettingsIcon, Globe, Trash2, RefreshCw, Languages } from 'lucide-react-native';
import { useTranslation } from '../../store/i18n';

export default function SettingsScreen() {
  const { currency, changeCurrency, language, setLanguage } = useBudgetStore();
  const { t } = useTranslation();

  const handleCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === currency) return;
    
    Alert.alert(
      t('settings.changeCurrency'),
      t('settings.changeCurrencyConfirm', { old: currency, new: newCurrency }),
      [
        { text: t('settings.cancel'), style: "cancel" },
        { 
          text: t('settings.convert'), 
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
          <Text className="text-white text-3xl font-bold ml-3">{t('settings.settings')}</Text>
        </View>

        {/* Language Settings */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-6">
          <View className="flex-row items-center mb-4">
            <Languages color="#3B82F6" size={24} />
            <Text className="text-white text-xl font-bold ml-3">{t('settings.language')}</Text>
          </View>
          <Text className="text-zinc-400 text-sm mb-5">
            {t('settings.languageDesc')}
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              className={`py-3 px-5 rounded-xl border flex-row items-center ${language === 'en' ? 'bg-[#3B82F6]/20 border-[#3B82F6]' : 'bg-[#262A2E] border-[#3F3F46]'}`}
              style={language === 'en' ? { backgroundColor: 'rgba(59, 130, 246, 0.2)' } : undefined}
            >
              <Text className={`font-bold ${language === 'en' ? 'text-[#3B82F6]' : 'text-zinc-400'}`}>🇬🇧 English</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setLanguage('pl')}
              className={`py-3 px-5 rounded-xl border flex-row items-center ${language === 'pl' ? 'bg-[#3B82F6]/20 border-[#3B82F6]' : 'bg-[#262A2E] border-[#3F3F46]'}`}
              style={language === 'pl' ? { backgroundColor: 'rgba(59, 130, 246, 0.2)' } : undefined}
            >
              <Text className={`font-bold ${language === 'pl' ? 'text-[#3B82F6]' : 'text-zinc-400'}`}>🇵🇱 Polski</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Currency Settings */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mb-6">
          <View className="flex-row items-center mb-4">
            <Globe color="#3B82F6" size={24} />
            <Text className="text-white text-xl font-bold ml-3">{t('settings.currencyRegion')}</Text>
          </View>
          <Text className="text-zinc-400 text-sm mb-5">
            {t('settings.currencyDesc')}
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
            <Text className="text-white text-xl font-bold ml-3">{t('settings.dangerZone')}</Text>
          </View>
          <Text className="text-zinc-400 text-sm mb-5">
            {t('settings.dangerDesc')}
          </Text>

          <TouchableOpacity 
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.5)' }}
            className="border py-4 rounded-xl items-center flex-row justify-center"
          >
            <RefreshCw color="#EF4444" size={20} />
            <Text className="text-red-500 font-bold ml-2">{t('settings.resetApp')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
