import { Platform } from 'react-native';

export const serif = Platform.select({ ios: 'ui-serif', android: 'serif', default: 'Georgia, serif' });
export const text = { title: 32, big: 56, body: 16, small: 13, label: 12 } as const;

export const mono = Platform.select({ ios: 'Courier New', android: 'monospace', default: 'Courier New, monospace' });
