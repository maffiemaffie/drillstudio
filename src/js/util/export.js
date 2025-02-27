export const exportCSV = ({players, sets}) => {
  let zip = new JSZip();

  for (const player of players) {
    zip.file(`${player.label}.csv`, playerToCSV(player, sets));
  }

  zip.generateAsync({ type: "base64" }).then(function (content) {
    location.href = "data:application/zip;base64," + content;
  });
};

const playerToCSV = (player, sets) => {
  let text =
    "Set,Left To Right,Front to Back,m.,Counts in,Counts out\n";
  for (let i = 0; i < sets.length; i++) {
    let previous;
    if (i > 0) previous = sets[i - 1];
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
    text += set.counts;
    text += "\n";
  }

  return text;
};
