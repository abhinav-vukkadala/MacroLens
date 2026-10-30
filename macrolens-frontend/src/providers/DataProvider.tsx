import React, { createContext, useContext, useEffect, useState } from 'react';
import { localRepository } from '@/data/localRepository';
import { Repository } from '@/data/repository';
import { Meal, Settings, WeightEntry } from '@/data/types';

interface Ctx { repo: Repository; ready: boolean; settings: Settings | null; meals: Meal[]; weights: WeightEntry[]; setWeights: React.Dispatch<React.SetStateAction<WeightEntry[]>>; setSettings: (s: Settings) => void; setMeals: React.Dispatch<React.SetStateAction<Meal[]>> }
const DataContext = createContext<Ctx>(null as unknown as Ctx);
export const useData = () => useContext(DataContext);

export function DataProvider({ children, repo = localRepository }: { children: React.ReactNode; repo?: Repository }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);

  useEffect(() => {
    Promise.all([repo.getSettings(), repo.getMeals(), repo.getWeights()]).then(([s, m, w]) => { setSettings(s); setMeals(m); setWeights(w); setReady(true); });
  }, [repo]);

  return <DataContext.Provider value={{ repo, ready, settings, meals, weights, setWeights, setSettings, setMeals }}>{children}</DataContext.Provider>;
}
