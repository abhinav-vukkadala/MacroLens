export type Sex = 'male' | 'female';
export type Goal = 'cut' | 'maintain' | 'bulk';
export type MetricKey = 'calories' | 'protein' | 'carbs' | 'fat';
export type Targets = Record<MetricKey, number>;
export type Tracked = Record<MetricKey, boolean>;

export interface Profile { sex: Sex; age: number; heightIn: number; weightLb: number; activity: number; goal: Goal }
export interface Settings { profile: Profile; targets: Targets; tracked: Tracked }
export interface Meal { id: string; ts: number; name: string; uri?: string; calories: number; protein: number; carbs: number; fat: number }
export type MealDraft = Omit<Meal, 'id' | 'ts' | 'uri'>;
