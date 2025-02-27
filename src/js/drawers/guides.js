export const drawArrow = (from, to, {ctx}, selected = false) => {
  const length = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
  const gradient = ctx.createRadialGradient(from.x, -from.y, 0, to.x, -to.y, length);
  gradient.addColorStop(0, !selected ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 0, 0, 0)');
  gradient.addColorStop(1, !selected ? 'black' :'red');
  ctx.beginPath();
  ctx.moveTo(from.x, -from.y);
  ctx.lineTo(to.x, -to.y);
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = gradient;
  ctx.closePath();
  ctx.stroke();
}

export const drawGhost = (player, set, { ctx, config }, selected = false) => {
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
};