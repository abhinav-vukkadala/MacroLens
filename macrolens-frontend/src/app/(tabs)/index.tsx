import * as ImagePicker from 'expo-image-picker';
import { Href, Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { DayReceipt } from '@/components/DayReceipt';
import { LogAgain } from '@/components/LogAgain';
import { MacroSummary } from '@/components/MacroSummary';
import { ReceiptCard } from '@/components/ReceiptCard';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Meal, MealDraft } from '@/data/types';
import { useMeals } from '@/hooks/useMeals';
import { useProfile } from '@/hooks/useProfile';
import { useTodayTotals } from '@/hooks/useTodayTotals';
import { analyzeFood } from '@/lib/api';
import { useColors } from '@/theme';

export default function Today() {
  const c = useColors();
  const { ready, profile, targets, tracked } = useProfile();
  const { meals, addMeal } = useMeals();
  const { total, today } = useTodayTotals();
  const router = useRouter();
  const [uri, setUri] = useState<string>();
  const [draft, setDraft] = useState<MealDraft>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  if (!ready) return null;
  if (!profile || !targets) return <Redirect href="/goals" />;

  const scan = async (source: 'camera' | 'library') => {
    setError(undefined);
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.5, base64: true, exif: false };
    let r: ImagePicker.ImagePickerResult;
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) { setError('Camera access is off. You can enable it in Settings, or choose a photo instead.'); return; }
      try { r = await ImagePicker.launchCameraAsync(opts); } catch { setError('No camera available here. Choose a photo instead.'); return; }
    } else {
      r = await ImagePicker.launchImageLibraryAsync(opts);
    }
    const asset = r.canceled ? undefined : r.assets[0];
    if (!asset?.base64) return;
    setUri(asset.uri); setDraft(undefined); setLoading(true);
    try {
      setDraft(await analyzeFood(asset.base64));
    } catch (e) {
      setError(e instanceof Error && e.message === 'rate' ? 'Too many scans in a row. Wait a minute and try again.' : 'Could not read that photo. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const again = (m: Meal) => addMeal({ ...m, id: String(Date.now()), ts: Date.now() });

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
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button label="Take photo" onPress={() => scan('camera')} style={{ flex: 1 }} />
        <Button label="Choose photo" variant="outline" onPress={() => scan('library')} style={{ flex: 1 }} />
      </View>
      {!draft && <LogAgain meals={meals} onPick={again} />}
      {loading && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><ActivityIndicator color={c.accent} /><Text style={{ color: c.sub }}>Reading your photo...</Text></View>}
      {error && <Text style={{ color: c.accent }}>{error}</Text>}
      {!draft && <DayReceipt title="Today's tab" meals={today} tracked={tracked} onPressMeal={(m) => router.push(`/meal/${m.id}` as Href)} />}
      {draft && <ReceiptCard draft={draft} uri={uri} onLog={log} onDiscard={() => setDraft(undefined)} />}
    </Screen>
  );
}
