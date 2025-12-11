import { pdfToImg } from "/node_modules/pdftoimg-js/dist/browser.mjs";

const supportedFormats = [
  {
    name: "Portable Document Format",
    format: "pdf",
    extension: "pdf",
    mime: "application/pdf",
    from: true,
    to: false,
    internal: "pdf"
  },
  {
    name: "Portable Network Graphics",
    format: "png",
    extension: "png",
    mime: "image/png",
    from: false,
    to: true,
    internal: "png"
  },
  {
    name: "Joint Photographic Experts Group JFIF",
    format: "jpeg",
    extension: "jpg",
    mime: "image/jpeg",
    from: false,
    to: true,
    internal: "jpeg"
  }
];

async function init () {

}

function base64ToBytes (base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function doConvert (inputFile, inputFormat, outputFormat) {

  if (Array.isArray(inputFile)) {
    const promises = inputFile.map(f => doConvert(f, inputFormat, outputFormat));
    return (await Promise.all(promises)).flat();
  }

  const blob = new Blob([inputFile.bytes], { type: inputFormat.mime });
  const url = URL.createObjectURL(blob);

  const images = await pdfToImg(url, {
    imgType: outputFormat.format,
    pages: "all"
  });

  const baseName = inputFile.name.split(".")[0];

  const files = [];
  for (let i = 0; i < images.length; i ++) {
    const base64 = images[i].slice(images[i].indexOf(";base64,") + 8);
    const bytes = base64ToBytes(base64);
    const name = `${baseName}_${i}.${outputFormat.extension}`;
    files.push({ bytes, name });
  }
  return files;

}

export default {
  name: "pdftoimg-js",
  init,
  supportedFormats,
  doConvert
};
