import { GAME_CONFIG, reelStripForDragon, DRAGON_SYMBOLS, SCATTER_PITY_START, SCATTER_PITY_GUARANTEE_SPIN, type SymbolConfig, type SymbolId } from './config';

export type Grid = SymbolId[][];
export type SpinResult = { grid: Grid; wins: { symbol: SymbolConfig; count: number; amount: number; cells: string[] }[]; scatterCount: number; totalWin: number };
const randomIndex = (max: number) => Math.floor(Math.random() * max);
export function scatterPityChance(misses: number) {
  const guaranteedAfterMisses = SCATTER_PITY_GUARANTEE_SPIN - 1;
  const rampLength = guaranteedAfterMisses - SCATTER_PITY_START + 1;
  return Math.max(0, Math.min(1, (misses - SCATTER_PITY_START + 1) / rampLength));
}

export function createGrid(dragonId: SymbolId | null = null): Grid {
  const reelStrip = reelStripForDragon(dragonId);
  return Array.from({ length: GAME_CONFIG.rows }, () => Array.from({ length: GAME_CONFIG.columns }, () => reelStrip[randomIndex(reelStrip.length)]));
}

function pathsFor(grid: Grid, symbol: SymbolId) {
  const paths: { count: number; cells: string[] }[] = [];
  const matches = (row: number, column: number) => grid[row][column] === symbol || DRAGON_SYMBOLS.includes(grid[row][column]);
  const extend = (row: number, column: number, cells: string[], includesSymbol: boolean) => {
    const pathIncludesSymbol = includesSymbol || grid[row][column] === symbol;
    if (column === GAME_CONFIG.columns - 1) {
      if (cells.length >= 3 && pathIncludesSymbol) paths.push({ count: cells.length, cells });
      return;
    }

    const nextColumn = column + 1;
    const nextRows = [...Array(GAME_CONFIG.rows).keys()].filter((nextRow) => matches(nextRow, nextColumn));
    if (!nextRows.length) {
      if (cells.length >= 3 && pathIncludesSymbol) paths.push({ count: cells.length, cells });
      return;
    }
    nextRows.forEach((nextRow) => extend(nextRow, nextColumn, [...cells, `${nextRow}-${nextColumn}`], pathIncludesSymbol));
  };

  for (let row = 0; row < GAME_CONFIG.rows; row += 1) {
    if (matches(row, 0)) extend(row, 0, [`${row}-0`], false);
  }
  return paths;
}

export function evaluateGrid(grid: Grid, bet: number, multiplier = 1): SpinResult {
  const wins: SpinResult['wins'] = [];
  let totalWin = 0;
  GAME_CONFIG.symbols.filter((symbol) => ![...DRAGON_SYMBOLS, 'scatter'].includes(symbol.id)).forEach((symbol) => {
    pathsFor(grid, symbol.id).forEach((result) => {
      const amount = (symbol.payouts[result.count as 3 | 4 | 5] ?? 0) * bet * multiplier;
      wins.push({ symbol, count: result.count, amount, cells: result.cells });
      totalWin += amount;
    });
  });
  const scatterCount = grid.flat().filter((symbol) => symbol === 'scatter').length;
  return { grid, wins, scatterCount, totalWin };
}

export function spin(bet: number, multiplier = 1, dragonId: SymbolId | null = null, guaranteeScatter = false): SpinResult {
  const grid = createGrid(dragonId);
  if (guaranteeScatter && grid.flat().filter((symbol) => symbol === 'scatter').length < 3) {
    const positions = Array.from({ length: GAME_CONFIG.rows * GAME_CONFIG.columns }, (_, index) => index);
    for (let count = 0; count < 3; count += 1) {
      const position = positions.splice(randomIndex(positions.length), 1)[0];
      grid[Math.floor(position / GAME_CONFIG.columns)][position % GAME_CONFIG.columns] = 'scatter';
    }
  }
  return evaluateGrid(grid, bet, multiplier);
}
