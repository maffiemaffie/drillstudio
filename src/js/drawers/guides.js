export const drawLastArrow = (from, to, { ctx }, selected = false) => {
  const length = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
  const gradient = ctx.createRadialGradient(from.x, -from.y, 0, to.x, -to.y, length);
  gradient.addColorStop(0, !selected ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 0, 0, 0)');
  gradient.addColorStop(1, !selected ? 'rgba(0, 0, 0, 0.25)' : 'red');
  drawArrow(from, to, { ctx }, gradient)
}

export const drawNextArrow = (from, to, { ctx }, selected = false) => {
  const length = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
  const gradient = ctx.createRadialGradient(from.x, -from.y, 0, to.x, -to.y, length);
  gradient.addColorStop(0, !selected ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 255, 0)');
  gradient.addColorStop(1, !selected ? 'black' : 'blue');
  drawArrow(from, to, { ctx }, gradient)
}

const drawArrow = (from, to, { ctx }, gradient) => {
  ctx.beginPath();
  ctx.moveTo(from.x, -from.y);
  ctx.lineTo(to.x, -to.y);
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = gradient;
  ctx.closePath();
  ctx.stroke();
}

export const drawGhost = (player, set, { ctx, config }, selected = false) => {
  if (player.dots[set.number - 1])
    drawLastGhost(player, set, { ctx, config }, selected);

  if (player.dots[set.number + 1])
    drawNextGhost(player, set, { ctx, config }, selected);
};

const drawLastGhost = (player, set, { ctx, config }, selected) => {
  const x = player.dots[set.number - 1].x;
  const y = player.dots[set.number - 1].y;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.strokeStyle = !selected ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
  ctx.lineWidth = 0.15;
  ctx.font = `${config.playerSize}px monospace`;
  ctx.textAlign = 'center';

  ctx.strokeRect(
    x - 0.5 * config.playerSize, -y - 0.5 * config.playerSize,
    config.playerSize, config.playerSize
  );
  ctx.fillText(player.label, x, -y + 0.35 * config.playerSize);
}

const drawNextGhost = (player, set, { ctx, config }, selected) => {
  const x = player.dots[set.number + 1].x;
  const y = player.dots[set.number + 1].y;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.strokeStyle = !selected ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)';
  ctx.lineWidth = 0.15;
  ctx.font = `${config.playerSize}px monospace`;
  ctx.textAlign = 'center';

  ctx.strokeRect(
    x - 0.5 * config.playerSize, -y - 0.5 * config.playerSize,
    config.playerSize, config.playerSize
  );
  ctx.fillText(player.label, x, -y + 0.35 * config.playerSize);
}