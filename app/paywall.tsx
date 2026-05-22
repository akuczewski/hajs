import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Bell, LayoutGrid, Flame, TrendingDown, FileDown, X, Crown, Check } from 'lucide-react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { getOfferings, purchasePackage, restorePurchases } from '../store/useSubscriptionStore';
import { useBudgetStore } from '../store/useBudgetStore';
import { useTranslation } from '../store/i18n';
import { PRODUCT_MONTHLY, PRODUCT_ANNUAL, PRODUCT_LIFETIME } from '../constants/revenueCat';

const FEATURES = [
  { icon: Shield, key: 'feature1' as const },
  { icon: Bell, key: 'feature2' as const },
  { icon: LayoutGrid, key: 'feature3' as const },
  { icon: Flame, key: 'feature4' as const },
  { icon: TrendingDown, key: 'feature5' as const },
  { icon: FileDown, key: 'feature6' as const },
] as const;

export default function PaywallScreen() {
  const router = useRouter();
  const { isPremium } = useBudgetStore();
  const { t } = useTranslation();

  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selected, setSelected] = useState<string>(PRODUCT_ANNUAL);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    getOfferings().then(pkgs => {
      setPackages(pkgs);
      setLoading(false);
    });
  }, []);

  // Redirect away if already premium
  useEffect(() => {
    if (isPremium) router.back();
  }, [isPremium]);

  const handlePurchase = async () => {
    const pkg = packages.find(p => p.product.identifier === selected);
    if (!pkg) return;
    setPurchasing(true);
    try {
      await purchasePackage(pkg);
    } catch {
      Alert.alert(t('paywall.errorTitle'));
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    const restored = await restorePurchases();
    setPurchasing(false);
    if (!restored) Alert.alert('', 'No active subscription found.');
  };

  const monthlyPkg = packages.find(p => p.product.identifier === PRODUCT_MONTHLY);
  const annualPkg = packages.find(p => p.product.identifier === PRODUCT_ANNUAL);
  const lifetimePkg = packages.find(p => p.product.identifier === PRODUCT_LIFETIME);

  return (
    <View style={{ flex: 1, backgroundColor: '#111315' }}>
      {/* Close */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: 'absolute', top: 56, right: 20, zIndex: 10, backgroundColor: '#1C1F22', padding: 10, borderRadius: 20 }}
      >
        <X color="#A1A1AA" size={20} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', paddingTop: 72, paddingBottom: 32, paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: 'rgba(234,179,8,0.15)', padding: 20, borderRadius: 32, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(234,179,8,0.3)' }}>
            <Crown color="#EAB308" size={48} />
          </View>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 10 }}>
            {t('paywall.title')}
          </Text>
          <Text style={{ color: '#A1A1AA', fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
            {t('paywall.subtitle')}
          </Text>
        </View>

        {/* Feature list */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32, gap: 12 }}>
          {FEATURES.map(({ icon: Icon, key }) => (
            <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ backgroundColor: 'rgba(52,211,153,0.1)', padding: 8, borderRadius: 12 }}>
                <Icon color="#34D399" size={20} />
              </View>
              <Text style={{ color: '#E4E4E7', fontSize: 15, fontWeight: '500' }}>{t(`paywall.${key}`)}</Text>
              <Check color="#34D399" size={16} style={{ marginLeft: 'auto' }} />
            </View>
          ))}
        </View>

        {/* Packages */}
        {loading ? (
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <ActivityIndicator color="#34D399" />
            <Text style={{ color: '#71717A', marginTop: 12 }}>{t('paywall.loading')}</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 24, gap: 12, marginBottom: 24 }}>
            {/* Annual — highlighted as default */}
            <TouchableOpacity
              onPress={() => setSelected(PRODUCT_ANNUAL)}
              style={{
                backgroundColor: '#1C1F22',
                borderRadius: 18,
                padding: 18,
                borderWidth: 2,
                borderColor: selected === PRODUCT_ANNUAL ? '#34D399' : '#272A2E',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{t('paywall.annualLabel')}</Text>
                <Text style={{ color: '#34D399', fontWeight: '800', fontSize: 22, marginTop: 4 }}>
                  {annualPkg?.product.priceString ?? t('paywall.annualPrice')}
                </Text>
              </View>
              <View style={{ backgroundColor: 'rgba(52,211,153,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ color: '#34D399', fontWeight: '700', fontSize: 12 }}>{t('paywall.annualSaving')}</Text>
              </View>
            </TouchableOpacity>

            {/* Lifetime */}
            <TouchableOpacity
              onPress={() => setSelected(PRODUCT_LIFETIME)}
              style={{
                backgroundColor: '#1C1F22',
                borderRadius: 18,
                padding: 18,
                borderWidth: 2,
                borderColor: selected === PRODUCT_LIFETIME ? '#EAB308' : '#272A2E',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{t('paywall.lifetimeLabel')}</Text>
                <Text style={{ color: '#EAB308', fontWeight: '800', fontSize: 22, marginTop: 4 }}>
                  {lifetimePkg?.product.priceString ?? t('paywall.lifetimePrice')}
                </Text>
              </View>
              <View style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ color: '#EAB308', fontWeight: '700', fontSize: 12 }}>{t('paywall.lifetimeBadge')}</Text>
              </View>
            </TouchableOpacity>

            {/* Monthly — shown last, positioned as least attractive */}
            <TouchableOpacity
              onPress={() => setSelected(PRODUCT_MONTHLY)}
              style={{
                backgroundColor: '#1C1F22',
                borderRadius: 18,
                padding: 18,
                borderWidth: 2,
                borderColor: selected === PRODUCT_MONTHLY ? '#6B7280' : '#272A2E',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#A1A1AA', fontWeight: '700', fontSize: 16 }}>{t('paywall.monthlyLabel')}</Text>
                <Text style={{ color: '#9CA3AF', fontWeight: '800', fontSize: 22, marginTop: 4 }}>
                  {monthlyPkg?.product.priceString ?? t('paywall.monthlyPrice')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* CTA */}
        <View style={{ paddingHorizontal: 24, gap: 12 }}>
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={purchasing || loading}
            style={{
              backgroundColor: purchasing ? '#374151' : '#34D399',
              paddingVertical: 18,
              borderRadius: 18,
              alignItems: 'center',
            }}
          >
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#022C22', fontWeight: '800', fontSize: 17 }}>
                {t('settings.upgradeToPremium')}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRestore} style={{ paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: '#52525B', fontSize: 13, fontWeight: '600' }}>{t('paywall.restore')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
