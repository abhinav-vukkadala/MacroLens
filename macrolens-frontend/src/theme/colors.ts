export const light = { bg: '#E7DDC8', card: '#F6F0E2', ink: '#1E1A14', sub: '#5A5043', line: '#D3C6AB', accent: '#B8461F', onAccent: '#FFF8EE', calories: '#B8461F', protein: '#4F6B3A', carbs: '#B7832F', fat: '#6B5A8C' };
export const dark: typeof light = { bg: '#17140F', card: '#221E17', ink: '#F3ECDD', sub: '#A39887', line: '#363026', accent: '#E0663A', onAccent: '#1B130C', calories: '#E0663A', protein: '#8FB16F', carbs: '#D9A64E', fat: '#A794C8' };
export type Colors = typeof light;

// Receipt paper stays cream in both modes so it reads as real paper.
export const paper = { bg: '#FFFDF6', ink: '#1E1A14', sub: '#4F473B' };
