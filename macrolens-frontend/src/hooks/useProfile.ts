import { Settings } from '@/data/types';
import { useData } from '@/providers/DataProvider';

export function useProfile() {
  const { repo, ready, settings, setSettings } = useData();
  return {
    ready,
    profile: settings?.profile ?? null,
    targets: settings?.targets ?? null,
    tracked: settings?.tracked ?? { calories: true, protein: true, carbs: true, fat: true },
    save: (s: Settings) => { setSettings(s); repo.saveSettings(s); },
  };
}
