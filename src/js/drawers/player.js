export const drawPlayer = (player, set, { ctx, config }, selected = false) => {
  const x = player.dots[set.number].x;
  const y = player.dots[set.number].y;

  ctx.fillStyle = 'black';
  ctx.strokeStyle = !selected ? 'grey' : 'red';
  ctx.lineWidth = 0.15;
  ctx.font = `${config.playerSize}px monospace`;
  ctx.textAlign = 'center';
  
  ctx.strokeRect(
    x - 0.5 * config.playerSize, -y - 0.5 * config.playerSize, 
    config.playerSize, config.playerSize
  );
  ctx.fillText(player.label, x, -y + 0.35 * config.playerSize);
};