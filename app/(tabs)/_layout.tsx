import { Tabs } from 'expo-router';
import React from 'react';
import { Home, TrendingUp, CreditCard } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#71717A',
        tabBarStyle: {
          backgroundColor: '#09090B',
          borderTopColor: '#27272A',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Start',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="incomes"
        options={{
          title: 'Przychody',
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Wydatki',
          tabBarIcon: ({ color }) => <CreditCard size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
