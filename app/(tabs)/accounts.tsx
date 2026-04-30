import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function AccountsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center">
      <Text className="text-white text-2xl font-bold">Accounts</Text>
      <Text className="text-zinc-500 mt-2">Dedykowany widok zarządzania kontami.</Text>
    </SafeAreaView>
  );
}
