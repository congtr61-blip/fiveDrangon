export type SymbolId = 'yellow' | 'blue' | 'black' | 'red' | 'white' | 'scatter' | 'vermillion' | 'tortoise' | 'koi' | 'redpacket' | 'coin' | '10' | 'J' | 'Q' | 'A' | 'K';

export type SymbolConfig = { id: SymbolId; label: string; glyph: string; tone: string; payouts: Partial<Record<3 | 4 | 5, number>> };
export const DRAGON_SYMBOLS: SymbolId[] = ['yellow', 'blue', 'black', 'red', 'white'];
export const SCATTER_PITY_START = 180;
export const SCATTER_PITY_GUARANTEE_SPIN = 260;

const BASE_REEL_STRIP: SymbolId[] = [
  ...Array<SymbolId>(10).fill('10'),
  ...Array<SymbolId>(10).fill('J'),
  ...Array<SymbolId>(10).fill('Q'),
  'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
  'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K',
  'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin',
  'redpacket', 'redpacket', 'redpacket', 'redpacket', 'redpacket',
  'koi', 'koi', 'koi', 'koi',
  'tortoise', 'tortoise', 'tortoise',
  'vermillion', 'vermillion',
  'yellow', 'blue', 'black', 'red', 'white', 'scatter'
];

export const REEL_STRIP: SymbolId[] = [
  ...BASE_REEL_STRIP,
  ...BASE_REEL_STRIP.filter((symbol) => !DRAGON_SYMBOLS.includes(symbol)),
  ...Array<SymbolId>(9).fill('10'),
  ...Array<SymbolId>(9).fill('J'),
  ...Array<SymbolId>(9).fill('Q'),
  ...Array<SymbolId>(12).fill('A'),
  ...Array<SymbolId>(12).fill('K'),
  ...Array<SymbolId>(6).fill('coin'),
  ...Array<SymbolId>(4).fill('redpacket'),
  ...Array<SymbolId>(4).fill('koi'),
  ...Array<SymbolId>(3).fill('tortoise'),
  ...Array<SymbolId>(2).fill('vermillion')
];

export function reelStripForDragon(dragonId: SymbolId | null): SymbolId[] {
  if (!dragonId || !DRAGON_SYMBOLS.includes(dragonId)) return REEL_STRIP;
  return REEL_STRIP.map((symbol) => DRAGON_SYMBOLS.includes(symbol) ? dragonId : symbol);
}

export const DRAGONS = [
  { id: 'yellow', label: '黄龙', glyph: '🐉', tone: 'yellow', spins: 5, multipliers: [10, 15, 30] },
  { id: 'blue', label: '蓝龙', glyph: '🐉', tone: 'blue', spins: 8, multipliers: [8, 10, 15] },
  { id: 'black', label: '黑龙', glyph: '🐉', tone: 'black', spins: 10, multipliers: [5, 8, 10] },
  { id: 'red', label: '红龙', glyph: '🐉', tone: 'red', spins: 15, multipliers: [3, 5, 8] },
  { id: 'white', label: '白龙', glyph: '🐉', tone: 'white', spins: 20, multipliers: [2, 3, 5] }
] as const;

export const GAME_CONFIG = {
  rows: 3,
  columns: 5,
  initialBalance: 0,
  betSteps: [1, 2, 5, 10, 20],
  symbols: [
    { id: 'yellow', label: '黄龙', glyph: '🐉', tone: 'yellow', payouts: {} },
    { id: 'blue', label: '蓝龙', glyph: '🐉', tone: 'blue', payouts: {} },
    { id: 'black', label: '黑龙', glyph: '🐉', tone: 'black', payouts: {} },
    { id: 'red', label: '红龙', glyph: '🐉', tone: 'red', payouts: {} },
    { id: 'white', label: '白龙', glyph: '🐉', tone: 'white', payouts: {} },
    { id: 'scatter', label: '龙珠 Scatter', glyph: '◈', tone: 'purple', payouts: {} },
    { id: 'vermillion', label: '朱雀', glyph: '🦅', tone: 'vermillion', payouts: { 3: 0.33, 4: 0.33, 5: 0.66 } },
    { id: 'tortoise', label: '玄武', glyph: '🐢', tone: 'tortoise', payouts: { 3: 0.33, 4: 0.66, 5: 0.66 } },
    { id: 'koi', label: '鲤鱼', glyph: '🐟', tone: 'koi', payouts: { 3: 0.33, 4: 0.66, 5: 0.99 } },
    { id: 'redpacket', label: '红包', glyph: '🧧', tone: 'redpacket', payouts: { 3: 0.33, 4: 0.66, 5: 0.99 } },
    { id: 'coin', label: '金币', glyph: '◎', tone: 'coin', payouts: { 3: 0.33, 4: 0.66, 5: 1.32 } },
    { id: '10', label: '10', glyph: '10', tone: 'paper', payouts: { 3: 0.33, 4: 0.66, 5: 0.99 } },
    { id: 'J', label: 'J', glyph: 'J', tone: 'paper', payouts: { 3: 0.33, 4: 0.66, 5: 0.99 } },
    { id: 'Q', label: 'Q', glyph: 'Q', tone: 'paper', payouts: { 3: 0.33, 4: 0.66, 5: 0.99 } },
    { id: 'A', label: 'A', glyph: 'A', tone: 'paper', payouts: { 3: 0.66, 4: 0.99, 5: 1.65 } },
    { id: 'K', label: 'K', glyph: 'K', tone: 'paper', payouts: { 3: 0.66, 4: 0.99, 5: 1.65 } }
  ] as SymbolConfig[]
};
