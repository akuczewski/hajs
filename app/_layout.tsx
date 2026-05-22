import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBudgetStore } from '../store/useBudgetStore';
import { initRevenueCat } from '../store/useSubscriptionStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

function OnboardingGuard() {
  const { hasCompletedOnboarding, completeOnboarding, incomes, fixedExpenses, accounts, liabilities, sinkingFunds } = useBudgetStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Existing users upgrading from pre-onboarding version: auto-complete if they have data
    const hasExistingData = incomes.length > 0 || fixedExpenses.length > 0 || accounts.length > 0 || liabilities.length > 0 || sinkingFunds.length > 0;
    if (!hasCompletedOnboarding && hasExistingData) {
      completeOnboarding();
      return;
    }

    const segs = segments as string[];
    const inOnboarding = segs[0] === 'onboarding';
    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding' as any);
    }
  }, [hasCompletedOnboarding, segments]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initRevenueCat().catch(() => {
      // RevenueCat init failure is non-fatal — app works without premium
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OnboardingGuard />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="paywall" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
