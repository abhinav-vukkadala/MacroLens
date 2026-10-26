import * as ImagePicker from 'expo-image-picker';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { MacroSummary } from '@/components/MacroSummary';
import { ReceiptCard } from '@/components/ReceiptCard';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { MealDraft } from '@/data/types';
import { useMeals } from '@/hooks/useMeals';
import { useProfile } from '@/hooks/useProfile';
import { useTodayTotals } from '@/hooks/useTodayTotals';
import { analyzeFood } from '@/lib/api';
import { useColors } from '@/theme';

export default function Today() {
  const c = useColors();
  const { ready, profile, targets, tracked } = useProfile();
  const { addMeal } = useMeals();
  const { total } = useTodayTotals();
  const [uri, setUri] = useState<string>();
  const [draft, setDraft] = useState<MealDraft>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  if (!ready) return null;
  if (!profile || !targets) return <Redirect href="/goals" />;

  const pick = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, base64: true });
    const asset = r.canceled ? undefined : r.assets[0];
    if (!asset?.base64) return;
    setUri(asset.uri); setDraft(undefined); setError(undefined); setLoading(true);
    try {
      setDraft(await analyzeFood(asset.base64));
    } catch {
      setError('Could not read that photo. Check the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const log = (d: MealDraft) => {
    addMeal({ id: String(Date.now()), ts: Date.now(), uri, ...d });
    setDraft(undefined); setUri(undefined);
  };

  return (
    <Screen>
      <Text style={{ color: c.sub, fontSize: 14, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase' }}>
        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </Text>
      <MacroSummary targets={targets} tracked={tracked} total={total} />
      <Button label="Add a meal from a photo" onPress={pick} />
      {loading && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><ActivityIndicator color={c.accent} /><Text style={{ color: c.sub }}>Reading your photo...</Text></View>}
      {error && <Text style={{ color: c.accent }}>{error}</Text>}
      {draft && <ReceiptCard draft={draft} uri={uri} onLog={log} onDiscard={() => setDraft(undefined)} />}
    </Screen>
  );
}
