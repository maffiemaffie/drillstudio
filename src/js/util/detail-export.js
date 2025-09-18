import * as viewer from "../viewer.js";
import * as model from "../model.js";
import { config } from "../drawers/config.js";

export const detailExport = async ({ name, players }) => {
  let zip = new JSZip();

  const oldConfig = config;

  config.showGuidesAll = false;
  config.showGuidesSelected = true;

  for (const player of players) {
    zip.file(`${player.label}.pdf`, await playerToDetail(player));
  }

  zip.generateAsync({ type: "base64" }).then(function (content) {
    const link = document.createElement("a");
    link.href = "data:application/zip;base64," + content;
    link.download = name + ".zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // restore config
  config.showGuidesAll = oldConfig.showGuidesAll;
  config.showGuidesSelected = oldConfig.showGuidesSelected;
}

export const playerToDetail = async (player) => {
  const { PDFDocument, StandardFonts, PageSizes } = PDFLib;

  const sets = model.getAll().sets;

  const pdf = await PDFDocument.create();
  const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const formatStepSize = (size) => {
    if (Number.isInteger(size)) return size;
    return size.toFixed(2);
  }

  for (let setNumber = 0; setNumber < sets.length; setNumber++) {
    const measureStart = sets[setNumber].measure;
    const measureEnd = sets[setNumber + 1]?.measure ?? "";
    const countsIn = sets[setNumber - 1]?.counts ?? 0;
    const countsOut = sets[setNumber]?.counts ?? 0;

    let stepSize = "";
    if (setNumber < sets.length - 1) {
      const STEP_SIZE_YARDS = 5 / 8;
      const distance = Math.sqrt(
        Math.pow(player.dots[setNumber].x - player.dots[setNumber + 1].x, 2) +
        Math.pow(player.dots[setNumber].y - player.dots[setNumber + 1].y, 2)
      ) * STEP_SIZE_YARDS;
      if (distance == 0) stepSize = "hold";
      else
        stepSize = formatStepSize(5 * sets[setNumber].counts / distance) + " to 5 step";
    }

    const leftToRight = player.getLeftToRight(setNumber);
    const frontToBack = player.getFrontToBack(setNumber);

    const page = pdf.addPage(PageSizes.A7.slice().reverse());
    await setToDetail(pdf, page, helvetica, bold, player, setNumber, measureStart, measureEnd, countsIn, countsOut, stepSize, leftToRight, frontToBack);
  }

  return await pdf.save();
}

const setToDetail = async (pdf, page, helvetica, bold, player, setNumber, measureStart, measureEnd, countsIn, countsOut, stepSize, leftToRight, frontToBack) => {
  const { width, height } = page.getSize();
  const fontSize = 10;
  page.drawText(`Set ${setNumber}`, {
    x: 10,
    y: height - fontSize - 10,
    size: fontSize,
    font: bold,
  });

  page.drawText(`mm. ${measureStart}-${measureEnd}`, {
    x: 45,
    y: height - fontSize - 10,
    size: fontSize,
    font: helvetica,
  });

  page.drawText(`${countsIn} counts in`, {
    x: 10,
    y: height - fontSize * 2 - 10,
    size: fontSize,
    font: helvetica,
  });

  page.drawText(`${countsOut} counts out`, {
    x: width - 75,
    y: height - fontSize * 2 - 10,
    size: fontSize,
    font: helvetica,
  });

  page.drawText(`x: ${leftToRight}`, {
    x: 10,
    y: fontSize + 10,
    size: fontSize,
    font: helvetica,
  });

  page.drawText(`y: ${frontToBack}`, {
    x: 10,
    y: 10,
    size: fontSize,
    font: helvetica,
  });

  page.drawText(`${stepSize}`, {
    x: width - 75,
    y: 10,
    size: fontSize,
    font: helvetica,
  });

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 400;
  const data = model.getAll();
  viewer.updateCanvas(canvas, { ...data, selected: player, currentSet: data.sets[setNumber] });
  const image = await pdf.embedPng(canvas.toDataURL("image/png"));
  // const imageScaled = image.scale(0.25);

  page.drawImage(image, {
    x: 20,
    y: 30,
    width: page.getWidth() - 40,
    height: page.getHeight() - 70,
  });
}