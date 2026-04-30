import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function SavingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center">
      <Text className="text-white text-2xl font-bold">Savings (Sinking Funds)</Text>
      <Text className="text-zinc-500 mt-2">Wizualizacja skarbonek do wdrożenia.</Text>
    </SafeAreaView>
  );
}
