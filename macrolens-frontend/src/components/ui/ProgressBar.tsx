import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useColors } from '@/theme';

export function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const c = useColors();
  const reduce = useReducedMotion();
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(Math.max(0, Math.min(pct, 1)), { duration: reduce ? 0 : 300, easing: Easing.bezier(0.23, 1, 0.32, 1) });
  }, [pct, reduce, w]);
  const style = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={{ height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 6, backgroundColor: c.line }}>
      <Animated.View style={[{ height: 8, borderRadius: 4, backgroundColor: color }, style]} />
    </View>
  );
}
