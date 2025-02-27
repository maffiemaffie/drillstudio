export const cropCanvas = (ctx, config) => {
  ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height - config.margin);
  ctx.scale(config.stepSize, config.stepSize);
};