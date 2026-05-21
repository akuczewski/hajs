import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { PiggyBank, TrendingUp, CalendarDays, Target, ArrowRight } from 'lucide-react-native';
import { useBudgetStore } from '../store/useBudgetStore';
import { useTranslation } from '../store/i18n';

const { width } = Dimensions.get('window');

const SLIDES = [
  { key: 'slide1', icon: PiggyBank, color: '#34D399', bgColor: 'rgba(52,211,153,0.1)' },
  { key: 'slide2', icon: TrendingUp, color: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)' },
  { key: 'slide3', icon: CalendarDays, color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.1)' },
  { key: 'slide4', icon: Target, color: '#EAB308', bgColor: 'rgba(234,179,8,0.1)' },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useBudgetStore();
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === SLIDES.length - 1;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (isLast) {
      finish();
    } else {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    }
  };

  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#111315' }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, idx) => {
          const Icon = slide.icon;
          const titleKey = `onboarding.slide${idx + 1}Title` as any;
          const descKey = `onboarding.slide${idx + 1}Desc` as any;
          return (
            <View key={slide.key} style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <View style={{ width: 120, height: 120, borderRadius: 40, backgroundColor: slide.bgColor, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                <Icon color={slide.color} size={56} />
              </View>
              <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 }}>
                {t(titleKey)}
              </Text>
              <Text style={{ color: '#A1A1AA', fontSize: 17, textAlign: 'center', lineHeight: 26 }}>
                {t(descKey)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32, gap: 8 }}>
        {SLIDES.map((_, idx) => (
          <View
            key={idx}
            style={{
              width: idx === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: idx === currentIndex ? '#34D399' : '#3F3F46',
            }}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 48, gap: 12 }}>
        <TouchableOpacity
          onPress={handleNext}
          style={{ backgroundColor: '#34D399', paddingVertical: 18, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Text style={{ color: '#022C22', fontWeight: '800', fontSize: 17 }}>
            {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
          </Text>
          <ArrowRight color="#022C22" size={20} />
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity onPress={finish} style={{ paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: '#52525B', fontWeight: '600', fontSize: 14 }}>{t('onboarding.getStarted')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
