interface ZipFileInput {
  name: string;
  data: Uint8Array;
}

const textEncoder = new TextEncoder();

const crcTable = (() => {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let current = index;

    for (let bit = 0; bit < 8; bit += 1) {
      current =
        (current & 1) === 1
          ? 0xedb88320 ^ (current >>> 1)
          : current >>> 1;
    }

    table[index] = current >>> 0;
  }

  return table;
})();

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;

  for (const value of data) {
    crc = crcTable[(crc ^ value) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function pushUint16(target: number[], value: number) {
  target.push(value & 0xff, (value >>> 8) & 0xff);
}

function pushUint32(target: number[], value: number) {
  target.push(
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff
  );
}

export function createZipBlob(files: ZipFileInput[]): Blob {
  const localChunks: number[] = [];
  const centralChunks: number[] = [];
  let offset = 0;

  for (const file of files) {
    const fileName = textEncoder.encode(file.name);
    const checksum = crc32(file.data);
    const localHeaderOffset = offset;

    pushUint32(localChunks, 0x04034b50);
    pushUint16(localChunks, 20);
    pushUint16(localChunks, 0);
    pushUint16(localChunks, 0);
    pushUint16(localChunks, 0);
    pushUint16(localChunks, 0);
    pushUint32(localChunks, checksum);
    pushUint32(localChunks, file.data.length);
    pushUint32(localChunks, file.data.length);
    pushUint16(localChunks, fileName.length);
    pushUint16(localChunks, 0);
    localChunks.push(...fileName);
    localChunks.push(...file.data);

    offset = localChunks.length;

    pushUint32(centralChunks, 0x02014b50);
    pushUint16(centralChunks, 20);
    pushUint16(centralChunks, 20);
    pushUint16(centralChunks, 0);
    pushUint16(centralChunks, 0);
    pushUint16(centralChunks, 0);
    pushUint16(centralChunks, 0);
    pushUint32(centralChunks, checksum);
    pushUint32(centralChunks, file.data.length);
    pushUint32(centralChunks, file.data.length);
    pushUint16(centralChunks, fileName.length);
    pushUint16(centralChunks, 0);
    pushUint16(centralChunks, 0);
    pushUint16(centralChunks, 0);
    pushUint16(centralChunks, 0);
    pushUint32(centralChunks, 0);
    pushUint32(centralChunks, localHeaderOffset);
    centralChunks.push(...fileName);
  }

  const centralDirectoryOffset = localChunks.length;
  const centralDirectorySize = centralChunks.length;
  const endChunks: number[] = [];

  pushUint32(endChunks, 0x06054b50);
  pushUint16(endChunks, 0);
  pushUint16(endChunks, 0);
  pushUint16(endChunks, files.length);
  pushUint16(endChunks, files.length);
  pushUint32(endChunks, centralDirectorySize);
  pushUint32(endChunks, centralDirectoryOffset);
  pushUint16(endChunks, 0);

  return new Blob(
    [
      new Uint8Array(localChunks),
      new Uint8Array(centralChunks),
      new Uint8Array(endChunks),
    ],
    { type: "application/zip" }
  );
}
