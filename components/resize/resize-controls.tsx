'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Percent, Package, Maximize2, ArrowRightLeft, ArrowUpDown, Ruler, Star, Link2, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import type { ResizeMode, ImageFormat } from '@/types/resize';
import { ResizePreset } from '@/types/resize';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

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

export function ResizeControls({ onResize, disabled }: ResizeControlsProps) {
  const t = useTranslations('ResizeTool.controls');
  const tConfig = useTranslations('ResizeTool.config');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [urlCopied, setUrlCopied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const MODES = [
    { id: 'percentage' as ResizeMode, label: t('percentage.title'), icon: Percent },
    { id: 'fileSize' as ResizeMode, label: t('fileSize.title'), icon: Package },
    { id: 'dimensions' as ResizeMode, label: t('dimensions.title'), icon: Maximize2 },
    { id: 'width' as ResizeMode, label: t('width.title'), icon: ArrowRightLeft },
    { id: 'height' as ResizeMode, label: t('height.title'), icon: ArrowUpDown },
    { id: 'longestSide' as ResizeMode, label: t('longestSide.title'), icon: Ruler },
  ];

  const RESIZE_PRESETS: ResizePreset[] = [
  {
    name: t('presets.instagram'),
    description: t('presets.instagramDesc'),
    mode: 'dimensions',
    value: 1080,
  },
  {
    name: t('presets.twitter'),
    description: t('presets.twitterDesc'),
    mode: 'width',
    value: 1500,
  },
  {
    name: t('presets.facebook'),
    description: t('presets.facebookDesc'),
    mode: 'width',
    value: 820,
  },
  {
    name: t('presets.youtube'),
    description: t('presets.youtubeDesc'),
    mode: 'width',
    value: 1280,
  },
  {
    name: t('presets.email'),
    description: t('presets.emailDesc'),
    mode: 'width',
    value: 800,
  },
  {
    name: t('presets.compress'),
    description: t('presets.compressDesc'),
    mode: 'fileSize',
    value: 100,
  },
];

  // State with default values
  const [mode, setMode] = useState<ResizeMode>('percentage');
  const [percentage, setPercentage] = useState(50);
  const [targetFileSize, setTargetFileSize] = useState(100);
  const [format, setFormat] = useState<ImageFormat>('jpeg');
  const [quality, setQuality] = useState(80);
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

    // Use window.history.replaceState to avoid triggering Next.js router and component re-render
    const newUrl = `${pathname}?${params.toString()}`;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', newUrl);
    }
  }, [isInitialized, mode, percentage, targetFileSize, format, quality, width, height, lockAspectRatio, targetValue, backgroundColor, usePadding, pathname]);

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
    if (typeof window === 'undefined') {
      return '';
    }
    
    const baseUrl = `${window.location.origin}${pathname}`;
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
    
    params.set('bgColor', backgroundColor.replace('#', ''));
    
    return `${baseUrl}?${params.toString()}`;
  };

  const copyConfigUrl = async () => {
    const url = getCurrentUrl();
    try {
      await navigator.clipboard.writeText(url);
      setUrlCopied(true);
      toast.success(tConfig('urlCopied'));
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      toast.error(tConfig('urlCopyFailed'));
    }
  };

  const openInNewTab = () => {
    const url = getCurrentUrl();
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="w-full bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Mode selector */}
          <aside className="w-full md:w-56 bg-muted border-b md:border-b-0 md:border-r border-border">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {t('resizeMode')}
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
                          : 'text-foreground hover:bg-accent/60'
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
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {t('percentage.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('percentage.description', { percentage })}
                    </p>
                  </div>

                  {/* Percentage input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Slider
                        min={10}
                        max={200}
                        step={5}
                        value={[percentage]}
                        onValueChange={(value) => setPercentage(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={10}
                        max={200}
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('percentage.rangeLabel')}
                    </p>
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format-percentage">{t('format.label')}</Label>
                      <Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
                        <SelectTrigger id="format-percentage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">{t('format.jpeg')}</SelectItem>
                          <SelectItem value="png">{t('format.png')}</SelectItem>
                          <SelectItem value="webp">{t('format.webp')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quality-percentage">{t('quality.label')}: {quality}%</Label>
                      <Slider
                        id="quality-percentage"
                        min={0}
                        max={100}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color-percentage">{t('backgroundColor.label')}</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="bg-color-percentage"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-input rounded cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        {backgroundColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* File Size Mode */}
              {mode === 'fileSize' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {t('fileSize.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('fileSize.description', { size: targetFileSize.toFixed(1) })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">{targetFileSize.toFixed(1)} kB</span>
                    </div>
                    <Slider
                      min={10}
                      max={5000}
                      step={10}
                      value={[targetFileSize]}
                      onValueChange={(value) => setTargetFileSize(value[0])}
                    />
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format-filesize">{t('format.label')}</Label>
                      <Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
                        <SelectTrigger id="format-filesize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">{t('format.jpeg')}</SelectItem>
                          <SelectItem value="png">{t('format.png')}</SelectItem>
                          <SelectItem value="webp">{t('format.webp')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quality-filesize">{t('quality.label')}: {quality}%</Label>
                      <Slider
                        id="quality-filesize"
                        min={0}
                        max={100}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color-filesize">{t('backgroundColor.label')}</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="bg-color-filesize"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-input rounded cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        {backgroundColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dimensions Mode */}
              {mode === 'dimensions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {t('dimensions.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('dimensions.description')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width-dimensions">{t('dimensions.width')}</Label>
                      <Input
                        id="width-dimensions"
                        type="number"
                        value={width || ''}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        placeholder="800"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height-dimensions">{t('dimensions.height')}</Label>
                      <Input
                        id="height-dimensions"
                        type="number"
                        value={height || ''}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        placeholder="600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="padding-dimensions"
                      checked={usePadding}
                      onCheckedChange={(checked) => setUsePadding(checked === true)}
                    />
                    <Label
                      htmlFor="padding-dimensions"
                      className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t('dimensions.paddingNote')}
                    </Label>
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format-dimensions">{t('format.label')}</Label>
                      <Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
                        <SelectTrigger id="format-dimensions">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">{t('format.jpeg')}</SelectItem>
                          <SelectItem value="png">{t('format.png')}</SelectItem>
                          <SelectItem value="webp">{t('format.webp')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quality-dimensions">{t('quality.label')}: {quality}%</Label>
                      <Slider
                        id="quality-dimensions"
                        min={0}
                        max={100}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color-dimensions">{t('backgroundColor.label')}</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="bg-color-dimensions"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-input rounded cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        {backgroundColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Width Mode */}
              {mode === 'width' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {t('width.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('width.description')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width-target">{t('width.targetWidth')}</Label>
                    <Input
                      id="width-target"
                      type="number"
                      value={targetValue || ''}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      placeholder="800"
                    />
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format-width">{t('format.label')}</Label>
                      <Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
                        <SelectTrigger id="format-width">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">{t('format.jpeg')}</SelectItem>
                          <SelectItem value="png">{t('format.png')}</SelectItem>
                          <SelectItem value="webp">{t('format.webp')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quality-width">{t('quality.label')}: {quality}%</Label>
                      <Slider
                        id="quality-width"
                        min={0}
                        max={100}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color-width">{t('backgroundColor.label')}</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="bg-color-width"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-input rounded cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        {backgroundColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Height Mode */}
              {mode === 'height' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {t('height.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('height.description')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height-target">{t('height.targetHeight')}</Label>
                    <Input
                      id="height-target"
                      type="number"
                      value={targetValue || ''}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      placeholder="600"
                    />
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format-height">{t('format.label')}</Label>
                      <Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
                        <SelectTrigger id="format-height">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">{t('format.jpeg')}</SelectItem>
                          <SelectItem value="png">{t('format.png')}</SelectItem>
                          <SelectItem value="webp">{t('format.webp')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quality-height">{t('quality.label')}: {quality}%</Label>
                      <Slider
                        id="quality-height"
                        min={0}
                        max={100}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color-height">{t('backgroundColor.label')}</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="bg-color-height"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-input rounded cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        {backgroundColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Longest Side Mode */}
              {mode === 'longestSide' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {t('longestSide.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('longestSide.description')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longest-target">{t('longestSide.targetLongest')}</Label>
                    <Input
                      id="longest-target"
                      type="number"
                      value={targetValue || ''}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      placeholder="800"
                    />
                  </div>

                  {/* Common parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format-longest">{t('format.label')}</Label>
                      <Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
                        <SelectTrigger id="format-longest">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">{t('format.jpeg')}</SelectItem>
                          <SelectItem value="png">{t('format.png')}</SelectItem>
                          <SelectItem value="webp">{t('format.webp')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quality-longest">{t('quality.label')}: {quality}%</Label>
                      <Slider
                        id="quality-longest"
                        min={0}
                        max={100}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color-longest">{t('backgroundColor.label')}</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="bg-color-longest"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-input rounded cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        {backgroundColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Presets */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-foreground">{t('presets.title')}</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {RESIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-2 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <p className="text-xs font-medium text-foreground">{preset.name}</p>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resize Button */}
              <Button
                onClick={handleResize}
                disabled={disabled}
                className="w-full mt-6"
                size="lg"
              >
                {mode === 'percentage' ? t('resizeButton', { percentage }) : t('resizeButtonDefault')}
              </Button>
            </motion.div>
          </main>
        </div>
      </div>
      {/* Configuration URL Display */}
      <div className="pb-6 bg-background border-border">
        <div className="bg-muted rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {tConfig('title')}
            </h4>
            <p className="text-xs text-muted-foreground">
              {tConfig('description')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={getCurrentUrl()}
              readOnly
              className="flex-1 text-xs font-mono"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            
            <Button
              onClick={copyConfigUrl}
              variant={urlCopied ? "default" : "outline"}
              size="sm"
              className={urlCopied ? "bg-green-600 hover:bg-green-700 border-green-600" : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"}
            >
              {urlCopied ? tConfig('copied') : tConfig('copy')}
            </Button>

            <Button
              onClick={openInNewTab}
              variant="outline"
              size="sm"
            >
              {tConfig('link')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
