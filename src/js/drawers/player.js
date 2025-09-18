export const drawPlayer = (player, set, { ctx, config }, selected = false) => {
  if (!player.dots[set.number]) return;

  const x = player.dots[set.number].x;
  const y = player.dots[set.number].y;

  drawPlayerAt(player, x, y, { ctx, config }, selected);
};

export const drawPlayerBetweenSets = (
  player,
  startSet,
  endSet,
  progress,
  { ctx, config }
) => {
  if (!player.dots[startSet.number]) return;
  if (!player.dots[endSet.number]) return;

  const lerp = (a, b, t) => a + (b - a) * t;

  const x1 = player.dots[startSet.number].x;
  const y1 = player.dots[startSet.number].y;

  const x2 = player.dots[endSet.number].x;
  const y2 = player.dots[endSet.number].y;

  const x = lerp(x1, x2, progress);
  const y = lerp(y1, y2, progress);

  drawPlayerAt(player, x, y, { ctx, config }, false);
};

const drawPlayerAt = (player, x, y, { ctx, config }, selected) => {
  const color = `rgb(from ${player.color} r g b / 0.5)`

  ctx.fillStyle = "black";
  ctx.strokeStyle = !selected ? color : "red";
  ctx.lineWidth = 0.15;
  ctx.font = `${config.playerSize}px monospace`;
  ctx.textAlign = "center";

  ctx.strokeRect(
    x - 0.5 * config.playerSize,
    -y - 0.5 * config.playerSize,
    config.playerSize,
    config.playerSize
  );
  ctx.fillText(player.label, x, -y + 0.35 * config.playerSize);
};
