import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import { RC_API_KEY_IOS, RC_API_KEY_ANDROID, ENTITLEMENT_PREMIUM, OFFERING_DEFAULT } from '../constants/revenueCat';
import { useBudgetStore } from './useBudgetStore';

// Call once at app startup in _layout.tsx
export const initRevenueCat = async () => {
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  await Purchases.configure({ apiKey });

  await syncPremiumStatus();
};

// Fetch entitlements from RevenueCat and sync to Zustand
export const syncPremiumStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_PREMIUM];
    useBudgetStore.getState().setIsPremium(isPremium);
  } catch {
    // Offline or API error — keep current value
  }
};

// Returns packages from the default offering, or empty array on error
export const getOfferings = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  } catch {
    return [];
  }
};

// Purchase a package — returns true on success
export const purchasePackage = async (pkg: PurchasesPackage): Promise<boolean> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_PREMIUM];
    useBudgetStore.getState().setIsPremium(isPremium);
    return isPremium;
  } catch (e: any) {
    if (!e.userCancelled) throw e;
    return false;
  }
};

// Restore previous purchases (required by App Store guidelines)
export const restorePurchases = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_PREMIUM];
    useBudgetStore.getState().setIsPremium(isPremium);
    return isPremium;
  } catch {
    return false;
  }
};
