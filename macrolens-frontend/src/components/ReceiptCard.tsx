import React, { useRef, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { ServingsStepper } from '@/components/ServingsStepper';
import { Button } from '@/components/ui/Button';
import { MealDraft } from '@/data/types';
import { METRICS, scale } from '@/lib/nutrition';
import { mono, useColors } from '@/theme';

const PAPER = '#FBF8F0';
const INK = '#2A2620';
const TEETH = 12;

const Dashes = () => <View style={{ borderBottomWidth: 1, borderStyle: 'dashed', borderColor: INK, opacity: 0.4, marginVertical: 12 }} />;

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginVertical: 3 }}>
      <Text style={{ fontFamily: mono, color: INK, fontSize: 14 }}>{label}</Text>
      <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dotted', borderColor: INK, opacity: 0.45, marginHorizontal: 6, marginBottom: 4 }} />
      <Text style={{ fontFamily: mono, color: INK, fontSize: 14, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

// The scan result prints out of a slot like a receipt.
export function ReceiptCard({ draft, uri, onLog, onDiscard }: { draft: MealDraft; uri?: string; onLog: (d: MealDraft) => void; onDiscard: () => void }) {
  const c = useColors();
  const reduce = useReducedMotion();
  const [servings, setServings] = useState(1);
  const printed = useRef(false);
  const y = useSharedValue(-2000);
  const shown = scale(draft, servings);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return (
    <View style={{ gap: 16 }}>
      <View>
        <View style={{ height: 12, borderRadius: 6, backgroundColor: c.ink, zIndex: 2 }} />
        <View style={{ overflow: 'hidden', marginHorizontal: 8, marginTop: -4 }}>
          <Animated.View
            style={style}
            onLayout={(e) => {
              if (printed.current) return;
              printed.current = true;
              const h = e.nativeEvent.layout.height;
              y.value = -h;
              y.value = withTiming(0, { duration: reduce ? 0 : 750, easing: Easing.bezier(0.23, 1, 0.32, 1) });
            }}>
            <View style={{ backgroundColor: PAPER, padding: 20, paddingTop: 24 }}>
              <Text style={{ fontFamily: mono, color: INK, textAlign: 'center', fontSize: 18, fontWeight: '700', letterSpacing: 3 }}>MACROLENS</Text>
              <Text style={{ fontFamily: mono, color: INK, textAlign: 'center', fontSize: 12, opacity: 0.6, marginTop: 2 }}>
                {new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).toUpperCase()}
              </Text>
              <Dashes />
              {uri ? <Image source={{ uri }} style={{ width: '100%', height: 130, borderRadius: 4, marginBottom: 12 }} /> : null}
              <Text style={{ fontFamily: mono, color: INK, fontSize: 16, fontWeight: '700' }}>{draft.name.toUpperCase()}</Text>
              <Text style={{ fontFamily: mono, color: INK, fontSize: 12, opacity: 0.6, marginBottom: 8 }}>{`${servings} x SERVING (ESTIMATE)`}</Text>
              {METRICS.filter((m) => m.key !== 'calories').map((m) => <Line key={m.key} label={m.label.toUpperCase()} value={`${shown[m.key]}g`} />)}
              <Dashes />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ fontFamily: mono, color: INK, fontSize: 14, fontWeight: '700' }}>TOTAL</Text>
                <Text style={{ fontFamily: mono, color: INK, fontSize: 30, fontWeight: '700' }}>{shown.calories} KCAL</Text>
              </View>
              <Dashes />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: mono, color: INK, fontSize: 13 }}>PORTION</Text>
                <ServingsStepper value={servings} onChange={setServings} />
              </View>
            </View>
            <View style={{ height: TEETH, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' }}>
              {Array.from({ length: 22 }).map((_, i) => (
                <View key={i} style={{ width: TEETH, height: TEETH, backgroundColor: PAPER, transform: [{ rotate: '45deg' }, { translateY: -TEETH / 1.4 }] }} />
              ))}
            </View>
          </Animated.View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button label="Toss it" variant="outline" onPress={onDiscard} style={{ flex: 1 }} />
        <Button label="Log it" onPress={() => onLog(shown)} style={{ flex: 1 }} />
      </View>
    </View>
  );
}
