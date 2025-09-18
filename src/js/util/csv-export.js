export const exportCSV = ({ name, players, sets }) => {
  let zip = new JSZip();

  for (const player of players) {
    zip.file(`${player.label}.csv`, playerToCSV(player, sets));
  }

  zip.generateAsync({ type: "base64" }).then(function (content) {
    const link = document.createElement("a");
    link.href = "data:application/zip;base64," + content;
    link.download = name + ".zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

const playerToCSV = (player, sets) => {
  let text = "Set,Left To Right,Front to Back,m.,Counts in,Counts out,Step size\n";
  for (let i = 0; i < sets.length; i++) {
    let previous;
    let next, distance;
    if (i > 0) previous = sets[i - 1];
    if (i < sets.length - 1) {
      next = sets[i + 1];
      const STEP_SIZE_YARDS = 5 / 8;
      distance = Math.sqrt(
        Math.pow(player.dots[i].x - player.dots[i + 1].x, 2) +
        Math.pow(player.dots[i].y - player.dots[i + 1].y, 2)
      ) * STEP_SIZE_YARDS;
    };

    const formatStepSize = (size) => {
      if (Number.isInteger(size)) return size;
      return size.toFixed(2);
    }
    const set = sets[i];
    text += set.number;
    text += ",";
    text += player.getLeftToRight(i);
    text += ",";
    text += player.getFrontToBack(i);
    text += ",";
    text += set.measure;
    text += ",";
    if (previous) text += previous.counts;
    text += ",";
    if (next) text += set.counts;
    text += ",";
    if (next && distance == 0) text += "hold";
    else
      if (next) text += formatStepSize(5 * set.counts / distance) + " to 5";
    text += "\n";
  }

  return text;
};