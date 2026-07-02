export type OutputConvertibleFormat = 'jpg' | 'png' | 'webp';
export type ConvertibleFormat =
  | OutputConvertibleFormat
  | 'svg'
  | 'heic'
  | 'avif'
  | 'tiff'
  | 'gif';

interface ConvertImageOptions {
  quality?: number;
  backgroundColor?: string;
}

interface ConvertedImagePayload {
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
}

const MIME_TYPE_MAP: Record<OutputConvertibleFormat, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

const EXTENSION_MAP: Record<OutputConvertibleFormat, string> = {
  jpg: 'jpg',
  png: 'png',
  webp: 'webp',
};

const DEFAULT_BACKGROUND = '#ffffff';
const DEFAULT_QUALITY = 0.92;

function normaliseFormat(format: OutputConvertibleFormat): OutputConvertibleFormat {
  if (format === 'jpg') {
    return 'jpg';
  }
  return format;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement | ImageBitmap> {
  return new Promise((resolve, reject) => {
    const attempts: Array<() => Promise<HTMLImageElement | ImageBitmap>> = [];

    const createBitmapAttempt = () => {
      if (typeof createImageBitmap !== 'function') {
        return Promise.reject(new Error('createImageBitmap not supported'));
      }
      return createImageBitmap(file);
    };

    const htmlImageAttempt = () =>
      new Promise<HTMLImageElement>((innerResolve, innerReject) => {
        const img = new Image();
        let objectUrl: string | null = null;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const cleanup = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          if (objectUrl) {
            try {
              URL.revokeObjectURL(objectUrl);
            } catch {
              // Ignore cleanup errors
            }
            objectUrl = null;
          }
        };

        img.onload = () => {
          cleanup();
          innerResolve(img);
        };

        img.onerror = () => {
          cleanup();
          innerReject(new Error(`Failed to load image: ${file.name}`));
        };

        try {
          objectUrl = URL.createObjectURL(file);
          timeoutId = setTimeout(() => {
            cleanup();
            innerReject(new Error(`Image load timeout (10s): ${file.name}`));
          }, 10000);

          img.decoding = 'async';
          img.src = objectUrl;
        } catch (error) {
          cleanup();
          innerReject(
            error instanceof Error ? error : new Error('Failed to read image file')
          );
        }
      });

    attempts.push(createBitmapAttempt, htmlImageAttempt);

    let lastError: unknown = null;

    const runNext = () => {
      const attempt = attempts.shift();
      if (!attempt) {
        const detail =
          lastError instanceof Error ? ` ${lastError.message}` : '';
        reject(
          new Error(
            `Unsupported or corrupted image format: ${file.type || file.name}.${detail}`
          )
        );
        return;
      }

      attempt()
        .then(resolve)
        .catch((error) => {
          lastError = error;
          runNext();
        });
    };

    runNext();
  });
}

function drawOnCanvas(
  image: HTMLImageElement | ImageBitmap,
  format: OutputConvertibleFormat,
  backgroundColor?: string
) {
  const canvas = document.createElement('canvas');
  const width =
    'naturalWidth' in image && image.naturalWidth
      ? image.naturalWidth
      : image.width;
  const height =
    'naturalHeight' in image && image.naturalHeight
      ? image.naturalHeight
      : image.height;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context for canvas');
  }

  if (format === 'jpg') {
    ctx.fillStyle = backgroundColor ?? DEFAULT_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(image, 0, 0);

  if ('close' in image && typeof image.close === 'function') {
    try {
      image.close();
    } catch {
      // Ignore cleanup errors
    }
  }

  return canvas;
}

export async function convertImage(
  file: File,
  targetFormat: OutputConvertibleFormat,
  options: ConvertImageOptions = {}
): Promise<ConvertedImagePayload> {
  const format = normaliseFormat(targetFormat);
  const image = await loadImageFromFile(file);
  const canvas = drawOnCanvas(image, format, options.backgroundColor);

  const mimeType = MIME_TYPE_MAP[format];
  const quality = typeof options.quality === 'number' ? options.quality : DEFAULT_QUALITY;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      mimeType,
      format === 'png' ? undefined : quality
    );
  });

  return {
    blob,
    mimeType,
    width: canvas.width,
    height: canvas.height,
  };
}

export function deriveConvertedFilename(
  originalName: string,
  targetFormat: OutputConvertibleFormat
): string {
  const extension = EXTENSION_MAP[normaliseFormat(targetFormat)];
  const lastDotIndex = originalName.lastIndexOf('.');
  const safeBase = lastDotIndex > 0 ? originalName.slice(0, lastDotIndex) : originalName;
  return `${safeBase}.${extension}`;
}

export function getFileExtension(file: File): string | null {
  const name = file.name || '';
  const lastDotIndex = name.lastIndexOf('.');
  if (lastDotIndex < 0 || lastDotIndex === name.length - 1) {
    return null;
  }
  return name.slice(lastDotIndex + 1).toLowerCase();
}

export function inferFormatFromFile(file: File): ConvertibleFormat | null {
  const type = file.type.toLowerCase();
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  if (type.includes('svg')) return 'svg';
  if (type.includes('heic') || type.includes('heif')) return 'heic';
  if (type.includes('avif')) return 'avif';
  if (type.includes('tiff') || type.includes('tif')) return 'tiff';
  if (type.includes('gif')) return 'gif';

  const extension = getFileExtension(file);
  if (!extension) return null;
  
  if (extension === 'png') return 'png';
  if (extension === 'webp') return 'webp';
  if (extension === 'jpg' || extension === 'jpeg') return 'jpg';
  if (extension === 'svg') return 'svg';
  if (extension === 'heic' || extension === 'heif') return 'heic';
  if (extension === 'avif') return 'avif';
  if (extension === 'tiff' || extension === 'tif') return 'tiff';
  if (extension === 'gif') return 'gif';

  return null;
}
