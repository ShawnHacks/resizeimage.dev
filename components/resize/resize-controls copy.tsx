'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Percent, Package, Maximize2, ArrowRightLeft, ArrowUpDown, Ruler, Star, Link2, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import type { ResizeMode, ImageFormat } from '@/types/resize';
import { RESIZE_PRESETS } from '@/types/resize';

interface ResizeControlsProps {
  onResize: (options: ResizeOptionsState) => void;
  disabled?: boolean;
}

export interface ResizeOptionsState {
  mode: ResizeMode;
  percentage?: number;
  targetFileSize?: number;
  format?: ImageFormat;
  quality?: number;
  width?: number;
  height?: number;
  lockAspectRatio?: boolean;
  targetValue?: number;
  backgroundColor?: string;
  usePadding?: boolean; // For Image Dimensions mode
}

const MODES = [
  { id: 'percentage' as ResizeMode, label: 'Percentage', icon: Percent },
  { id: 'fileSize' as ResizeMode, label: 'File Size', icon: Package },
  { id: 'dimensions' as ResizeMode, label: 'Image Dimensions', icon: Maximize2 },
  { id: 'width' as ResizeMode, label: 'Width', icon: ArrowRightLeft },
  { id: 'height' as ResizeMode, label: 'Height', icon: ArrowUpDown },
  { id: 'longestSide' as ResizeMode, label: 'Longest Side', icon: Ruler },
];

export function ResizeControls({ onResize, disabled }: ResizeControlsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [urlCopied, setUrlCopied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // State with default values
  const [mode, setMode] = useState<ResizeMode>('dimensions');
  const [percentage, setPercentage] = useState(50);
  const [targetFileSize, setTargetFileSize] = useState(100);
  const [format, setFormat] = useState<ImageFormat>('jpeg');
  const [quality, setQuality] = useState(68);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [targetValue, setTargetValue] = useState<number | undefined>(undefined);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [usePadding, setUsePadding] = useState(false);

  // Read from URL on mount and when URL changes
  useEffect(() => {
    const urlMode = searchParams.get('mode') as ResizeMode;
    const urlPercentage = searchParams.get('percentage');
    const urlFileSize = searchParams.get('fileSize');
    const urlFormat = searchParams.get('format') as ImageFormat;
    const urlQuality = searchParams.get('quality');
    const urlWidth = searchParams.get('width');
    const urlHeight = searchParams.get('height');
    const urlLockRatio = searchParams.get('lockRatio');
    const urlTarget = searchParams.get('target');
    const urlBgColor = searchParams.get('bgColor');
    const urlPadding = searchParams.get('padding');

    if (urlMode) setMode(urlMode);
    if (urlPercentage) setPercentage(Number(urlPercentage));
    if (urlFileSize) setTargetFileSize(Number(urlFileSize));
    if (urlFormat) setFormat(urlFormat);
    if (urlQuality) setQuality(Number(urlQuality));
    if (urlWidth) setWidth(Number(urlWidth));
    if (urlHeight) setHeight(Number(urlHeight));
    if (urlLockRatio !== null) setLockAspectRatio(urlLockRatio !== 'false');
    if (urlTarget) setTargetValue(Number(urlTarget));
    if (urlBgColor) setBackgroundColor(`#${urlBgColor}`);
    if (urlPadding !== null) setUsePadding(urlPadding === 'true');

    setIsInitialized(true);
  }, [searchParams]);

  // Update URL when parameters change (but not during initial load)
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    
    params.set('mode', mode);
    params.set('format', format);
    params.set('quality', quality.toString());
    
    if (mode === 'percentage') {
      params.set('percentage', percentage.toString());
    } else if (mode === 'fileSize') {
      params.set('fileSize', targetFileSize.toString());
    } else if (mode === 'dimensions') {
      if (width) params.set('width', width.toString());
      if (height) params.set('height', height.toString());
      params.set('lockRatio', lockAspectRatio.toString());
      params.set('padding', usePadding.toString());
    } else if (mode === 'width' || mode === 'height' || mode === 'longestSide') {
      if (targetValue) params.set('target', targetValue.toString());
    }
    
    // Background color (remove # prefix)
    params.set('bgColor', backgroundColor.replace('#', ''));

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [isInitialized, mode, percentage, targetFileSize, format, quality, width, height, lockAspectRatio, targetValue, backgroundColor, usePadding, router]);

  const handleResize = () => {
    const options: ResizeOptionsState = {
      mode,
      percentage,
      targetFileSize,
      format,
      quality,
      width,
      height,
      lockAspectRatio,
      targetValue,
      backgroundColor,
      usePadding,
    };
    onResize(options);
  };

  const applyPreset = (preset: typeof RESIZE_PRESETS[0]) => {
    setMode(preset.mode);
    
    if (preset.mode === 'dimensions') {
      setWidth(preset.value);
      setHeight(preset.value);
      setLockAspectRatio(true);
    } else if (preset.mode === 'fileSize') {
      setTargetFileSize(preset.value);
    } else {
      setTargetValue(preset.value);
    }
  };

  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const copyConfigUrl = async () => {
    const url = getCurrentUrl();
    try {
      await navigator.clipboard.writeText(url);
      setUrlCopied(true);
      toast.success('Configuration URL copied to clipboard!');
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const openInNewTab = () => {
    const url = getCurrentUrl();
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl border border-[#D2D2D7] overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Mode selector */}
          <aside className="w-full md:w-56 bg-[#F5F5F7] border-b md:border-b-0 md:border-r border-[#D2D2D7]">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-[#86868B] uppercase tracking-wide mb-3">
                Resize Mode
              </h3>
              <div className="space-y-1">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const isActive = mode === m.id;
                  
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all
                        ${isActive 
                          ? 'bg-primary text-white shadow-md' 
                          : 'text-[#1D1D1F] hover:bg-white/60'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Parameter panel */}
          <main className="flex-1 p-6">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Percentage Mode */}
              {mode === 'percentage' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
                      Percentage
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Scale images to <strong>{percentage}%</strong> of the original dimensions.
                    </p>
                  </div>

                  {/* Percentage input */}
                  <div>
                    {/* <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Scale Percentage: {percentage}%
                    </label> */}
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        className="flex-1 h-2 bg-[#D2D2D7] rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        className="w-20 px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-[#86868B] mt-2">
                      Range: 10% to 200%
                    </p>
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as ImageFormat)}
                        className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-[#D2D2D7] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Image Background
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-[#D2D2D7] rounded cursor-pointer"
                      />
                      <span className="text-sm text-[#86868B]">Color</span>
                    </div>
                  </div>
                </div>
              )}

              {/* File Size Mode */}
              {mode === 'fileSize' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
                      File Size
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Images will be resized to <strong>{targetFileSize.toFixed(1)} kB</strong> or less.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-sm text-[#86868B]">{targetFileSize.toFixed(1)} kB</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="10"
                      value={targetFileSize}
                      onChange={(e) => setTargetFileSize(Number(e.target.value))}
                      className="w-full h-2 bg-[#D2D2D7] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as ImageFormat)}
                        className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-[#D2D2D7] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Image Background
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-[#D2D2D7] rounded cursor-pointer"
                      />
                      <span className="text-sm text-[#86868B]">Color</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dimensions Mode */}
              {mode === 'dimensions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
                      Image Dimensions
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Make images <strong>{width || 800}</strong> × <strong>{height || 600}</strong> Width × Height
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={width || ''}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        placeholder="800"
                        className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={height || ''}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        placeholder="600"
                        className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usePadding}
                      onChange={(e) => setUsePadding(e.target.checked)}
                      className="w-4 h-4 text-primary border-[#D2D2D7] rounded focus:ring-[#007AFF]"
                    />
                    <span className="text-sm text-[#1D1D1F]">Use padding to avoid stretching or squashing images.</span>
                  </label>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as ImageFormat)}
                        className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-[#D2D2D7] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Image Background
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-[#D2D2D7] rounded cursor-pointer"
                      />
                      <span className="text-sm text-[#86868B]">Color</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Width Mode */}
              {mode === 'width' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
                      Width
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Make the width of images <strong>{targetValue || 800}</strong> pixels.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Target Width (px)
                    </label>
                    <input
                      type="number"
                      value={targetValue || ''}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      placeholder="800"
                      className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                    />
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as ImageFormat)}
                        className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-[#D2D2D7] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Image Background
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-[#D2D2D7] rounded cursor-pointer"
                      />
                      <span className="text-sm text-[#86868B]">Color</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Height Mode */}
              {mode === 'height' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
                      Height
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Make the height of images <strong>{targetValue || 600}</strong> pixels.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Target Height (px)
                    </label>
                    <input
                      type="number"
                      value={targetValue || ''}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      placeholder="600"
                      className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                    />
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as ImageFormat)}
                        className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-[#D2D2D7] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Image Background
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-[#D2D2D7] rounded cursor-pointer"
                      />
                      <span className="text-sm text-[#86868B]">Color</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Longest Side Mode */}
              {mode === 'longestSide' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
                      Longest Side
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Make the longest side of images <strong>{targetValue || 800}</strong> pixels.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Target Longest Side (px)
                    </label>
                    <input
                      type="number"
                      value={targetValue || ''}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      placeholder="800"
                      className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                    />
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as ImageFormat)}
                        className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Image Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-[#D2D2D7] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Image Background
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-[#D2D2D7] rounded cursor-pointer"
                      />
                      <span className="text-sm text-[#86868B]">Color</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Presets */}
              <div className="mt-6 pt-6 border-t border-[#D2D2D7]">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#86868B]" />
                  <h4 className="text-sm font-semibold text-[#1D1D1F]">Quick Presets</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {RESIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-2 text-left border border-[#D2D2D7] rounded-lg hover:border-[#007AFF] hover:bg-[#007AFF]/5 transition-all"
                    >
                      <p className="text-xs font-medium text-[#1D1D1F]">{preset.name}</p>
                      <p className="text-xs text-[#86868B]">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resize Button */}
              <button
                onClick={handleResize}
                disabled={disabled}
                className="w-full mt-6 px-6 py-3 bg-[#007AFF] text-white text-base font-semibold rounded-xl hover:bg-[#0051D5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                Resize {mode === 'percentage' ? `to ${percentage}%` : 'Images'}
              </button>
            </motion.div>
          </main>
        </div>
      </div>
      {/* Configuration URL Display */}
      <div className="pb-6 bg-white border-[#D2D2D7]">
        <div className="bg-[#F5F5F7] rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-[#1D1D1F] mb-1">
              Shareable Configuration
            </h4>
            <p className="text-xs text-[#86868B]">
              Use these settings automatically with this URL.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={getCurrentUrl()}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-[#D2D2D7] rounded-lg text-xs text-[#1D1D1F] font-mono truncate focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            
            <button
              onClick={copyConfigUrl}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                urlCopied
                  ? 'bg-[#34C759] border-[#34C759] text-white'
                  : 'bg-white border-[#34C759] text-[#34C759] hover:bg-[#34C759] hover:text-white'
              }`}
            >
              {urlCopied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={openInNewTab}
              className="px-4 py-2 bg-white border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Link
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
