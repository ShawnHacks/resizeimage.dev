export interface StitchItem {
  id: string;
  file: File;
  previewUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
}

export interface CanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
}

/**
 * Load image from preview URL
 */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/**
 * Render stitched image to a canvas and return as blob
 */
export async function renderStitchedImage(
  settings: CanvasSettings,
  items: StitchItem[],
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.92
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = settings.width;
  canvas.height = settings.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // 1. Draw background
  if (settings.backgroundColor === 'transparent') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 2. Set export quality settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 3. Apply canvas-wide clipping to match visual overflow-hidden
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.clip();

  // 4. Sort items by zIndex
  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex);

  // 5. Draw each item
  for (const item of sortedItems) {
    const img = await loadImage(item.previewUrl);

    ctx.save();

    // Set global alpha for opacity
    ctx.globalAlpha = item.opacity;

    // Translate to center of image position
    ctx.translate(item.x + item.width / 2, item.y + item.height / 2);

    // Rotate
    ctx.rotate((item.rotation * Math.PI) / 180);

    // Calculate object-contain behavior
    const imgRatio = img.width / img.height;
    const boxRatio = item.width / item.height;
    let drawWidth = item.width;
    let drawHeight = item.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > boxRatio) {
      // Image is wider than box relative to height
      drawHeight = item.width / imgRatio;
      offsetY = (item.height - drawHeight) / 2;
    } else {
      // Image is taller than box relative to width
      drawWidth = item.height * imgRatio;
      offsetX = (item.width - drawWidth) / 2;
    }

    // Draw image centered at the translated position, respecting object-contain offsets
    ctx.drawImage(
      img,
      -item.width / 2 + offsetX,
      -item.height / 2 + offsetY,
      drawWidth,
      drawHeight
    );

    ctx.restore();
  }

  // 4. Export to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to export canvas to blob'));
        }
      },
      `image/${format}`,
      quality
    );
  });
}
