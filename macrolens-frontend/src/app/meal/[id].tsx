import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Paper } from '@/components/ui/Paper';
import { NumberField } from '@/components/ui/NumberField';
import { Screen } from '@/components/ui/Screen';
import { useMeals } from '@/hooks/useMeals';
import { METRICS } from '@/lib/nutrition';
import { mono, radius, serif, text, useColors } from '@/theme';
import { paper } from '@/theme/colors';

export default function EditMeal() {
  const c = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { meals, updateMeal, deleteMeal } = useMeals();
  const meal = meals.find((m) => m.id === id);
  const [m, setM] = useState(meal);

  if (!meal || !m) return <Screen><Text style={{ color: c.sub }}>That meal no longer exists.</Text><Button label="Back" onPress={() => router.back()} /></Screen>;

  const remove = () => {
    const go = () => { deleteMeal(meal.id); router.back(); };
    if (Platform.OS === 'web') { if (window.confirm(`Delete ${meal.name}?`)) go(); return; }
    Alert.alert('Delete meal?', meal.name, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: go }]);
  };

  return (
    <Screen>
      <Text style={{ color: c.ink, fontFamily: serif, fontSize: text.title }}>Edit meal</Text>
      {meal.uri ? <Image source={{ uri: meal.uri }} style={{ width: '100%', height: 180, borderRadius: radius.md }} /> : null}
      <Paper style={{ gap: 14 }}>
        <TextInput value={m.name} onChangeText={(name) => setM({ ...m, name })} style={{ color: paper.ink, fontSize: 18, fontWeight: '700', fontFamily: mono, borderBottomWidth: 1, borderColor: paper.sub, paddingVertical: 8 }} />
        {METRICS.map((x) => (
          <View key={x.key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: paper.ink, fontSize: 15 }}>{x.label} ({x.unit})</Text>
            <NumberField value={String(m[x.key])} onChange={(v) => setM({ ...m, [x.key]: v })} align="right" width={90} />
          </View>
        ))}
      </Paper>
      <Button label="Save changes" onPress={() => { updateMeal({ ...m, name: m.name.trim() || meal.name }); router.back(); }} />
      <Button label="Delete meal" variant="outline" onPress={remove} />
    </Screen>
  );
}
