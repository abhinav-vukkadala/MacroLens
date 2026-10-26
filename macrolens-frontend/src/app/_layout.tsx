import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DataProvider } from '@/providers/DataProvider';
import { useColors } from '@/theme';

export default function RootLayout() {
  const c = useColors();
  return (
    <DataProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }} />
    </DataProvider>
  );
}
