import { useColorScheme } from 'react-native';
import { Colors, dark, light } from './colors';

export const useColors = (): Colors => (useColorScheme() === 'dark' ? dark : light);
export type { Colors };
export * from './spacing';
export * from './typography';
