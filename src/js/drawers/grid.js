export const drawGrid = (grid, { ctx, width, height, config }) => {
  ctx.fillStyle = "black";
  ctx.font = `${0.5 * config.margin}px sans-serif`;
  ctx.strokeStyle = "lightgrey";
  ctx.lineWidth = 0.25;
  
  ctx.beginPath();
  for (let y = 0; y < (grid.rows - 1) * 8; y++) {
    ctx.moveTo(config.margin, config.margin + y * 0.125 * config.gridSize);
    ctx.lineTo(
      -config.margin + width,
      config.margin + y * 0.125 * config.gridSize
    );
  }
  for (let x = 0; x < (grid.columns - 1) * 8; x++) {
    ctx.moveTo(config.margin + x * 0.125 * config.gridSize, config.margin);
    ctx.lineTo(
      config.margin + x * 0.125 * config.gridSize,
      -config.margin + height
    );
  }
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "grey";
  ctx.lineWidth *= 2;

  ctx.beginPath();
  for (let y = 0; y < (grid.rows - 1) * 2; y++) {
    ctx.moveTo(config.margin, config.margin + y * 0.5 * config.gridSize);
    ctx.lineTo(
      -config.margin + width,
      config.margin + y * 0.5 * config.gridSize
    );
  }
  for (let x = 0; x < (grid.columns - 1) * 2; x++) {
    ctx.moveTo(config.margin + x * 0.5 * config.gridSize, config.margin);
    ctx.lineTo(
      config.margin + x * 0.5 * config.gridSize,
      -config.margin + height
    );
  }
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth *= 4;
  ctx.beginPath();
  for (let y = 0; y < grid.rows; y++) {
    const lineLabel = String.fromCharCode(
      "A".charCodeAt(0) + grid.rows - y - 1
    );
    ctx.textAlign = "right";
    ctx.fillText(
      lineLabel,
      0.5 * config.margin,
      y * config.gridSize + config.margin
    );
    ctx.textAlign = "left";
    ctx.fillText(
      lineLabel,
      -0.5 * config.margin + width,
      y * config.gridSize + config.margin
    );
    ctx.moveTo(config.margin, config.margin + y * config.gridSize);
    ctx.lineTo(
      -config.margin + width,
      config.margin + y * config.gridSize
    );
  }

  ctx.textAlign = "center";
  for (let x = 0; x < grid.columns; x++) {
    const lineLabel = 50 - 5 * Math.abs((grid.columns - 1) * 0.5 - x);
    ctx.fillText(
      lineLabel,
      config.margin + x * config.gridSize,
      0.5 * config.margin
    );
    ctx.fillText(
      lineLabel,
      config.margin + x * config.gridSize,
      height - 0.25 * config.margin
    );
    ctx.moveTo(config.margin + x * config.gridSize, config.margin);
    ctx.lineTo(
      config.margin + x * config.gridSize,
      -config.margin + height
    );
  }
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth *= 1.5;
  ctx.beginPath();
  ctx.moveTo(config.margin + 0.5 * (grid.columns - 1) * config.gridSize, config.margin);
  ctx.lineTo(
    config.margin + 0.5 * (grid.columns - 1) * config.gridSize,
    height - config.margin
  );
  ctx.closePath();
  ctx.stroke();
};