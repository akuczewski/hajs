import { Tabs } from 'expo-router';
import React from 'react';
import { LayoutDashboard, Landmark, ArrowRightLeft, CalendarCheck, PiggyBank } from 'lucide-react-native';

export default function TabLayout() {
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
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => <Landmark size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cashflow"
        options={{
          title: 'Cashflow',
          tabBarIcon: ({ color }) => <ArrowRightLeft size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'Subscriptions',
          tabBarIcon: ({ color }) => <CalendarCheck size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Savings',
          tabBarIcon: ({ color }) => <PiggyBank size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
