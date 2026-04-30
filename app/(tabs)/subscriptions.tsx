import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { Settings, Play, Music, Dumbbell, Smartphone } from 'lucide-react-native';

const subscriptions = [
  { id: '1', name: 'Netflix Premium', due: 'Oct 24', amount: '$19.99', icon: <Play color="#EF4444" size={24} />, isPaid: true },
  { id: '2', name: 'Spotify Duo', due: 'Oct 28', amount: '$12.99', icon: <Music color="#10B981" size={24} />, isPaid: false },
  { id: '3', name: 'Equinox Gym', due: 'Oct 31', amount: '$113.00', icon: <Dumbbell color="#F3F4F6" size={24} />, isPaid: false },
];

export default function SubscriptionsScreen() {
  const [subs, setSubs] = useState(subscriptions);

  const toggleSub = (id: string) => {
    setSubs(subs.map(sub => sub.id === id ? { ...sub, isPaid: !sub.isPaid } : sub));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <View className="px-5 py-4 flex-row justify-between items-center border-b border-zinc-800">
        <Text className="text-white text-xl font-bold">Subscriptions & Debits</Text>
        <TouchableOpacity>
          <Settings color="#3B82F6" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {/* Total Box */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-8 items-center">
          <Text className="text-zinc-400 font-medium mb-2">Total Monthly Subscriptions</Text>
          <Text className="text-white text-5xl font-extrabold tracking-tighter mb-2">$145.97</Text>
          <Text className="text-zinc-500 text-sm">Based on 6 active items</Text>
        </View>

        {/* List Header */}
        <View className="flex-row justify-between items-end mb-4 px-1">
          <Text className="text-white font-bold text-lg">Active Subscriptions</Text>
          <Text className="text-zinc-500 text-xs font-medium">Paid this Month</Text>
        </View>

        {/* List Items */}
        {subs.map(sub => (
          <View key={sub.id} className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-4 mb-3 flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <View className="bg-[#262A2E] p-2 rounded-xl mr-4">
                {sub.icon}
              </View>
              <View>
                <Text className="text-white font-bold text-lg">{sub.name}</Text>
                <Text className="text-zinc-500 text-xs">Due {sub.due}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-lg mr-4">{sub.amount}</Text>
              <Switch
                value={sub.isPaid}
                onValueChange={() => toggleSub(sub.id)}
                trackColor={{ false: '#3F3F46', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        ))}

        {/* Google Mockup */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-5 mt-6 mb-10">
          <View className="flex-row items-center mb-3">
            <Smartphone color="#3B82F6" size={24} />
            <Text className="text-white font-bold text-lg ml-3">Google Account Integration</Text>
          </View>
          <Text className="text-white font-bold mb-1">Detected Subscriptions</Text>
          <Text className="text-zinc-400 text-sm mb-5 leading-5">
            Connect your Google account to automatically track new subscriptions and bills. 3 potential items found.
          </Text>
          <TouchableOpacity className="bg-[#3B82F6] rounded-xl py-4 items-center">
            <Text className="text-white font-bold text-lg">Connect Google Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
