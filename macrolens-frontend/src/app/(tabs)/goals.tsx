import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { NumberField } from '@/components/ui/NumberField';
import { Screen } from '@/components/ui/Screen';
import { Goal, MetricKey, Profile, Sex, Targets } from '@/data/types';
import { useProfile } from '@/hooks/useProfile';
import { METRICS, recommend } from '@/lib/nutrition';
import { serif, text, useColors } from '@/theme';

const ACTIVITY = [{ v: 1.2, l: 'Mostly sitting' }, { v: 1.375, l: 'Light, 1-3 days/wk' }, { v: 1.55, l: 'Moderate, 3-5 days/wk' }, { v: 1.725, l: 'Hard, 6-7 days/wk' }];
const GOALS: { v: Goal; l: string; d: string }[] = [
  { v: 'cut', l: 'Cut', d: 'About 20% under maintenance' },
  { v: 'maintain', l: 'Maintain', d: 'Hold your current weight' },
  { v: 'bulk', l: 'Bulk', d: 'About 10% over maintenance' },
];

const Label = ({ children }: { children: string }) => {
  const c = useColors();
  return <Text style={{ color: c.sub, fontSize: text.label, fontWeight: '700', letterSpacing: 0.5 }}>{children}</Text>;
};

export default function Goals() {
  const c = useColors();
  const router = useRouter();
  const { profile, targets, tracked, save } = useProfile();

  const [sex, setSex] = useState<Sex>(profile?.sex ?? 'male');
  const [age, setAge] = useState(profile?.age ?? 20);
  const [ft, setFt] = useState(Math.floor((profile?.heightIn ?? 69) / 12));
  const [inch, setInch] = useState((profile?.heightIn ?? 69) % 12);
  const [lb, setLb] = useState(profile?.weightLb ?? 160);
  const [activity, setActivity] = useState(profile?.activity ?? 1.375);
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? 'maintain');
  const [track, setTrack] = useState(tracked);
  const [t, setT] = useState<Targets | null>(targets);

  const draft: Profile = { sex, age, heightIn: ft * 12 + inch, weightLb: lb, activity, goal };
  const valid = age >= 14 && age <= 90 && draft.heightIn >= 48 && lb >= 80;
  const rec = valid ? recommend(draft) : null;

  // Recommended values refresh when stats or goal change; typed overrides stick until then.
  useEffect(() => { if (rec) setT(rec); }, [sex, age, ft, inch, lb, activity, goal]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Screen gap={22}>
      <View>
        <Text style={{ color: c.ink, fontFamily: serif, fontSize: text.title }}>{profile ? 'Your goals' : 'Set up MacroLens'}</Text>
        <Text style={{ color: c.sub, marginTop: 6, lineHeight: 20 }}>Your numbers set a daily target. Change anything later.</Text>
      </View>
      <View style={{ gap: 10 }}>
        <Label>SEX (USED BY THE CALORIE FORMULA)</Label>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label="Male" on={sex === 'male'} onPress={() => setSex('male')} />
          <Chip label="Female" on={sex === 'female'} onPress={() => setSex('female')} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        <NumberField label="AGE" value={String(age)} onChange={setAge} />
        <NumberField label="HEIGHT (FT)" value={String(ft)} onChange={setFt} />
        <NumberField label="IN" value={String(inch)} onChange={setInch} width={64} />
        <NumberField label="WEIGHT (LB)" value={String(lb)} onChange={setLb} />
      </View>
      <View style={{ gap: 10 }}>
        <Label>ACTIVITY</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {ACTIVITY.map((a) => <Chip key={a.v} label={a.l} on={a.v === activity} onPress={() => setActivity(a.v)} />)}
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <Label>GOAL</Label>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {GOALS.map((g) => <Chip key={g.v} label={g.l} on={g.v === goal} onPress={() => setGoal(g.v)} />)}
        </View>
        <Text style={{ color: c.sub, fontSize: 13 }}>{GOALS.find((g) => g.v === goal)?.d}</Text>
      </View>
      <Card style={{ gap: 12 }}>
        <Text style={{ color: c.ink, fontWeight: '700', fontSize: 16 }}>What to track and daily targets</Text>
        <Text style={{ color: c.sub, fontSize: 13 }}>{rec ? 'Prefilled with a recommendation for you. Edit any number.' : 'Fill in your stats above to see a recommendation.'}</Text>
        {METRICS.map((m) => (
          <View key={m.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Switch value={track[m.key]} onValueChange={(v) => setTrack({ ...track, [m.key as MetricKey]: v })} trackColor={{ true: c[m.key] }} />
            <Text style={{ color: c.ink, flex: 1, marginLeft: 12, fontSize: 15 }}>{m.label}</Text>
            <NumberField value={t ? String(t[m.key]) : ''} editable={track[m.key]} align="right" width={84} onChange={(v) => t && setT({ ...t, [m.key]: v })} />
            <Text style={{ color: c.sub, width: 36, marginLeft: 6 }}>{m.unit}</Text>
          </View>
        ))}
      </Card>
      <Button label="Save goals" disabled={!valid || !t} onPress={() => { if (t) { save({ profile: draft, targets: t, tracked: track }); router.replace('/'); } }} />
      <Text style={{ color: c.sub, fontSize: 12, lineHeight: 17 }}>Targets use the Mifflin-St Jeor equation and standard protein ranges. They are estimates, not medical advice.</Text>
    </Screen>
  );
}
