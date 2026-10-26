import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { useColors } from '@/theme';

const W = 112;
const H = 176;

// A drinking glass that fills with liquid as calories are logged. pct: 0 to 1 (clamped).
export function LiquidGlass({ pct, color }: { pct: number; color: string }) {
  const c = useColors();
  const reduce = useReducedMotion();
  const level = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    const target = Math.max(0, Math.min(pct, 1));
    level.value = reduce ? target : withSpring(target, { damping: 16, stiffness: 80 });
  }, [pct, reduce, level]);

  useEffect(() => {
    if (reduce) return;
    drift.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [reduce, drift]);

  const liquid = useAnimatedStyle(() => ({ height: level.value * (H - 4) }));
  const wave = useAnimatedStyle(() => ({ transform: [{ translateX: -40 + drift.value * 40 }] }));

  return (
    <View style={{ width: W, height: H, borderWidth: 2, borderColor: c.ink, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, overflow: 'hidden', backgroundColor: c.card, justifyContent: 'flex-end' }}>
      <Animated.View style={[{ width: '100%', backgroundColor: color, opacity: 0.9 }, liquid]}>
        <Animated.View style={[{ position: 'absolute', top: -10, left: -20, width: W + 80, height: 20, borderRadius: 10, backgroundColor: color }, wave]} />
      </Animated.View>
      {[0.25, 0.5, 0.75].map((t) => (
        <View key={t} style={{ position: 'absolute', right: 0, bottom: t * (H - 4), width: 14, height: 2, backgroundColor: c.ink, opacity: 0.35 }} />
      ))}
    </View>
  );
}
