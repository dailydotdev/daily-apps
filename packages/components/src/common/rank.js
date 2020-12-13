export const STEPS_PER_RANK = [3, 4, 5, 6, 7];
export const RANK_NAMES = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

const colorOrDefault = (rank, color) => (rank > 0 ? color : 'var(--theme-secondary)');

export const rankToColor = rank => colorOrDefault(rank, `var(--theme-rank-${rank}-color)`);
export const rankToGradientStopBottom = rank => colorOrDefault(rank, `var(--theme-rank-${rank}-color-bottom)`);
export const rankToGradientStopTop = rank => colorOrDefault(rank, `var(--theme-rank-${rank}-color-top)`);

export const ranksMetadata = STEPS_PER_RANK.map((steps, index) => ({
  rank: index + 1,
  name: RANK_NAMES[index],
  steps,
  color: rankToColor(index + 1),
  stopColorBottom: rankToGradientStopBottom(index + 1),
  stopColorTop: rankToGradientStopTop(index + 1),
}));
