import { WeightEntry } from '@/data/types';
import { useData } from '@/providers/DataProvider';

export function useWeights() {
  const { repo, weights, setWeights } = useData();
  return {
    weights, // newest first
    addWeight: (lb: number) => {
      const w: WeightEntry = { id: String(Date.now()), ts: Date.now(), lb };
      setWeights((p) => [w, ...p]);
      repo.addWeight(w);
    },
    deleteWeight: (id: string) => { setWeights((p) => p.filter((x) => x.id !== id)); repo.deleteWeight(id); },
  };
}
