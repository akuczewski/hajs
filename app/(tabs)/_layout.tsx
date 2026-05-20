import { Tabs } from 'expo-router';
import React from 'react';
import { LayoutDashboard, ArrowRightLeft, PiggyBank, Settings, BarChart2 } from 'lucide-react-native';
import { useTranslation } from '../../store/i18n';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#52525B',
        tabBarStyle: {
          backgroundColor: '#09090B',
          borderTopColor: '#27272A',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cashflow"
        options={{
          title: t('tabs.cashflow'),
          tabBarIcon: ({ color }) => <ArrowRightLeft size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: t('tabs.savings'),
          tabBarIcon: ({ color }) => <PiggyBank size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: t('tabs.analytics'),
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
