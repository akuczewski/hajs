import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Briefcase, Activity, CheckCircle, Plus } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

export default function CashflowScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#111315]">
      <View className="px-5 py-4 flex-row justify-between items-center border-b border-zinc-800">
        <Text className="text-white text-xl font-bold">Income Sources</Text>
        <TouchableOpacity>
          <Text className="text-[#10B981] font-semibold text-base">Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {/* Total Box */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-3xl p-6 mb-8 items-start">
          <Text className="text-zinc-400 font-medium mb-2">Total Monthly Income</Text>
          <Text className="text-[#34D399] text-5xl font-extrabold tracking-tighter">$8,250.00</Text>
        </View>

        {/* Fixed Income */}
        <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">Fixed Income (Salary)</Text>
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-8 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Briefcase color="#10B981" size={24} />
            <Text className="text-white font-bold text-lg ml-3">Full-time Job</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-white font-bold text-lg mr-3">$5,500.00</Text>
            <CheckCircle color="#10B981" size={20} />
          </View>
        </View>

        {/* Variable Income */}
        <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">Variable Income (Freelance, Bonus)</Text>
        
        {/* Item 1 */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Activity color="#10B981" size={20} />
              <Text className="text-white font-bold text-lg ml-2">Freelance Projects</Text>
            </View>
            <Text className="text-white font-bold text-lg">$1,250.00</Text>
          </View>
          
          <View className="flex-row justify-between items-end">
            <View className="w-1/2 h-12">
              <Svg height="100%" width="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                <Path d="M0 30 L 20 10 L 40 35 L 60 5 L 80 20 L 100 0" fill="none" stroke="#34D399" strokeWidth="2" />
              </Svg>
              <Text className="text-zinc-600 text-[10px] mt-1">Last 5 Months</Text>
              <Text className="text-zinc-700 text-[10px]">Feb Mar Apr May Jun</Text>
            </View>
            
            <View className="items-end">
              <Text className="text-zinc-400 text-xs font-medium">Calculated Average</Text>
              <Text className="text-[#34D399] font-bold text-lg">$1,500/mo</Text>
            </View>
          </View>
        </View>

        {/* Item 2 */}
        <View className="bg-[#1C1F22] border border-[#272A2E] rounded-2xl p-5 mb-10 relative overflow-hidden">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="bg-[#10B981] rounded-full p-1"><Text className="text-[#022C22] font-bold text-xs">$</Text></View>
              <Text className="text-white font-bold text-lg ml-2">Quarterly Bonus</Text>
            </View>
            <Text className="text-white font-bold text-lg">$1,500.00</Text>
          </View>
          
          <View className="flex-row justify-between items-end">
            <View className="w-1/2 h-12">
              <Svg height="100%" width="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                <Path d="M0 40 L 10 40 L 20 5 L 30 40 L 40 40 L 50 10 L 60 40 L 70 40 L 80 5 L 100 40" fill="none" stroke="#34D399" strokeWidth="2" />
              </Svg>
              <Text className="text-zinc-600 text-[10px] mt-1">Last 5 Months</Text>
            </View>
            
            <View className="items-end mr-12">
              <Text className="text-zinc-400 text-xs font-medium">Calculated Average</Text>
              <Text className="text-[#34D399] font-bold text-lg">$1,250/mo</Text>
            </View>
          </View>

          {/* Add Button overlapping the card */}
          <TouchableOpacity className="absolute bottom-4 right-4 bg-[#34D399] p-3 rounded-full shadow-lg border border-[#059669]">
            <Plus color="#022C22" size={24} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
