import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

type SaveOptions = {
  folder: string;
  width: number;
  quality: number;
};

const ALLOWED = /^image\/(jpeg|jpg|png|webp|avif|gif)$/i;

export async function saveImageFile(
  file: FormDataEntryValue | null | undefined,
  { folder, width, quality }: SaveOptions,
) {
  if (!file || typeof file === "string") return "";
  if (!file.size) return "";

  if (file.type && !ALLOWED.test(file.type)) {
    throw new Error("La imagen tiene que ser JPG, PNG, WEBP, AVIF o GIF.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "");
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
  const directory = path.join(process.cwd(), "public", "uploads", safeFolder);

  await fs.mkdir(directory, { recursive: true });
  await sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(path.join(directory, filename));

  return `/uploads/${safeFolder}/${filename}`;
}
