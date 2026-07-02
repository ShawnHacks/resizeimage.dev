
export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export interface CompressionOptions {
  quality?: number; // 0-100
  format: OutputFormat;
}

// Emscripten module generic type
interface EmscriptenModule {
  encode(data: Uint8Array, width: number, height: number, options: any): Uint8Array;
}

// WasmBindgen module generic type (for PNG)
interface WasmBindgenModule {
  default: (url: string) => Promise<any>;
  encode: (data: Uint8Array, width: number, height: number, bitDepth: number) => Uint8Array;
}

async function fileToImageData(file: Blob): Promise<ImageData> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

export async function compressImage(
  file: File | Blob,
  options: CompressionOptions
): Promise<Blob> {
  const imageData = await fileToImageData(file);
  const { width, height, data } = imageData; // data is Uint8ClampedArray
  // Most wasm encoders expect Uint8Array, Uint8ClampedArray is compatible in most buffer operations but strict typing might complain.
  // We can view it as Uint8Array
  const uint8Data = new Uint8Array(data.buffer);

  let buffer: Uint8Array | ArrayBuffer;

  switch (options.format) {
    case 'jpeg': {
      // Emscripten: returns a Promise that resolves to Module
      // @ts-expect-error - runtime import
      const moduleFactory = (await import(/* webpackIgnore: true */ '/wasm/mozjpeg_enc.js')).default;
      const wasmModule = await moduleFactory({
        locateFile: (path: string) => `/wasm/${path}` // Explicitly point to /wasm/ for safety
      });
      buffer = wasmModule.encode(uint8Data, width, height, {
        quality: options.quality ?? 75,
        baseline: false,
        arithmetic: false,
        progressive: true,
        optimize_coding: true,
        smoothing: 0,
        color_space: 3, // JCS_YCbCr
        quant_table: 3, // 3 = MSSIM
        trellis_multipass: false,
        trellis_opt_zero: false,
        trellis_opt_table: false,
        trellis_loops: 1,
        auto_subsample: true,
        chroma_subsample: 2,
        separate_chroma_quality: false,
        chroma_quality: 75,
      });
      break;
    }
    case 'png': {
      // WasmBindgen
      // @ts-expect-error - runtime import
      const pngModule = await import(/* webpackIgnore: true */ '/wasm/squoosh_png.js');
      await pngModule.default('/wasm/squoosh_png_bg.wasm');
      // buffer = pngModule.encode(uint8Data, width, height, 0); 
      // Squoosh PNG expects generic 8-bit depth for standard images
      buffer = pngModule.encode(uint8Data, width, height, 8);
      break;
    }
    case 'webp': {
      // Emscripten
      // @ts-expect-error - runtime import
      const moduleFactory = (await import(/* webpackIgnore: true */ '/wasm/webp_enc.js')).default;
      const wasmModule = await moduleFactory({
        locateFile: (path: string) => `/wasm/${path}`
      });
      buffer = wasmModule.encode(uint8Data, width, height, {
        quality: options.quality ?? 75,
        target_size: 0,
        target_PSNR: 0,
        method: 4,
        sns_strength: 50,
        filter_strength: 60,
        filter_sharpness: 0,
        filter_type: 1,
        partitions: 0,
        segments: 4,
        pass: 1,
        show_compressed: 0,
        preprocessing: 0,
        autofilter: 0,
        partition_limit: 0,
        alpha_compression: 1,
        alpha_filtering: 1,
        alpha_quality: 100,
        lossless: 0,
        exact: 0,
        image_hint: 0,
        emulate_jpeg_size: 0,
        thread_level: 0,
        low_memory: 0,
        near_lossless: 100,
        use_delta_palette: 0,
        use_sharp_yuv: 0,
      });
      break;
    }
    case 'avif': {
      // Emscripten
      // @ts-expect-error - runtime import
      const moduleFactory = (await import(/* webpackIgnore: true */ '/wasm/avif_enc.js')).default;
      const wasmModule = await moduleFactory({
        locateFile: (path: string) => `/wasm/${path}`
      });
      buffer = wasmModule.encode(uint8Data, width, height, {
        // Options based on @jsquash/avif defaults
        quality: options.quality ?? 50,
        qualityAlpha: -1,
        denoiseLevel: 0,
        tileColsLog2: 0,
        tileRowsLog2: 0,
        speed: 6,
        subsample: 1,
        chromaDeltaQ: false,
        sharpness: 0,
        tune: 0,
        enableSharpYUV: false,
        bitDepth: 8,
        lossless: false,
        // minQuantizer/maxQuantizer removed as jSquash handles 'quality'
      });
      break;
    }
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }

  return new Blob([buffer! as any], { type: `image/${options.format}` });
}
