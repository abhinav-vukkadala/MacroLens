import React from 'react';
import { Text } from 'react-native';
import { mono } from '@/theme';
import { paper } from '@/theme/colors';

// Dotted or dashed filler that always renders as a pattern (borderStyle does not on iOS).
export const Leader = ({ char = '.', size = 14 }: { char?: string; size?: number }) => (
  <Text numberOfLines={1} style={{ flex: 1, fontFamily: mono, fontSize: size, color: paper.ink, opacity: 0.5, marginHorizontal: 6, overflow: 'hidden' }}>{char.repeat(120)}</Text>
);

export const Rule = () => (
  <Text numberOfLines={1} style={{ fontFamily: mono, fontSize: 13, color: paper.ink, opacity: 0.5, marginVertical: 10, overflow: 'hidden' }}>{'- '.repeat(80)}</Text>
);
