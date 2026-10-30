import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';
import { mono, useColors } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;
const icon = (name: IconName) => ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} size={size} color={color} />;

export default function TabsLayout() {
  const c = useColors();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: c.accent, tabBarInactiveTintColor: c.sub, tabBarLabelStyle: { fontFamily: mono, fontSize: 10, letterSpacing: 0.8 }, tabBarStyle: { backgroundColor: c.card, borderTopColor: c.line }, sceneStyle: { backgroundColor: c.bg } }}>
      <Tabs.Screen name="index" options={{ title: 'TODAY', tabBarIcon: icon('restaurant-outline') }} />
      <Tabs.Screen name="history" options={{ title: 'HISTORY', tabBarIcon: icon('time-outline') }} />
      <Tabs.Screen name="progress" options={{ title: 'PROGRESS', tabBarIcon: icon('stats-chart-outline') }} />
      <Tabs.Screen name="goals" options={{ title: 'GOALS', tabBarIcon: icon('options-outline') }} />
    </Tabs>
  );
}
