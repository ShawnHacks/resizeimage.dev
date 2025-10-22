'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ASPECT_RATIO_CATEGORIES } from '@/lib/single-resize-presets';
import type { AspectCategory, AspectPreset, LengthUnit, SelectionRect, SingleImageFormat } from '@/types/single-resize';
import { clampSelection, ensureMinimumSize, fitSelectionToAspect, fromPixels, getAspectRatio, toPixels } from '@/lib/single-resize-utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { formatFileSize } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Lock, Unlock } from 'lucide-react';

interface SingleResizeWorkspaceProps {
  file: File;
  onReset: () => void;
  previewUrl: string;
}

type DragHandle =
  | 'move'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface DragState {
  mode: 'move' | 'resize';
  handle: DragHandle;
  startPointer: { x: number; y: number };
  startSelection: SelectionRect;
}

interface ImageMetrics {
  width: number;
  height: number;
}

const DEFAULT_UNIT: LengthUnit = 'px';
const MIN_SELECTION_SIZE = 20;
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const JPEG_QUALITY = 0.92;

const FORMAT_OPTIONS: Array<{ value: SingleImageFormat; label: string }> = [
  { value: 'jpeg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
];

const UNIT_OPTIONS: Array<{ value: LengthUnit; label: string }> = [
  { value: 'px', label: 'px' },
  { value: 'pt', label: 'pt' },
  { value: 'in', label: 'in' },
  { value: 'cm', label: 'cm' },
  { value: 'mm', label: 'mm' },
];

function getCategoryById(id: string): AspectCategory | undefined {
  return ASPECT_RATIO_CATEGORIES.find(category => category.id === id);
}

function roundPx(value: number): number {
  return Math.max(1, Math.round(value));
}

export function SingleResizeWorkspace({ file, onReset, previewUrl }: SingleResizeWorkspaceProps) {
  const t = useTranslations('SingleResize');
  const [imageMetrics, setImageMetrics] = useState<ImageMetrics>({ width: 0, height: 0 });
  const [isImageReady, setIsImageReady] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageLayerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const [selection, setSelection] = useState<SelectionRect>({ x: 0, y: 0, width: 0, height: 0 });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [categoryId, setCategoryId] = useState<string>('custom');
  const [selectedPreset, setSelectedPreset] = useState<AspectPreset | null>(null);
  const [format, setFormat] = useState<SingleImageFormat>('jpeg');
  const [unit, setUnit] = useState<LengthUnit>(DEFAULT_UNIT);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [targetDimensions, setTargetDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [derivedBlob, setDerivedBlob] = useState<Blob | null>(null);
  const latestBlobUrl = useRef<string | null>(null);
  const [isGeneratingBlob, setIsGeneratingBlob] = useState(false);

  const isCustom = categoryId === 'custom';
  const imageMetricsRef = useRef<ImageMetrics>({ width: 0, height: 0 });
  const lockAspectRef = useRef(lockAspect);
  const isCustomRef = useRef(isCustom);
  const aspectRatioRef = useRef(1);

  const aspectRatio = useMemo(() => {
    if (selectedPreset) {
      return selectedPreset.width / selectedPreset.height;
    }
    if (targetDimensions.height === 0) {
      return imageMetrics.width && imageMetrics.height ? imageMetrics.width / imageMetrics.height : 1;
    }
    return targetDimensions.width / targetDimensions.height;
  }, [selectedPreset, targetDimensions.height, targetDimensions.width, imageMetrics.height, imageMetrics.width]);

  useEffect(() => {
    imageMetricsRef.current = imageMetrics;
  }, [imageMetrics]);

  useEffect(() => {
    lockAspectRef.current = lockAspect;
  }, [lockAspect]);

  useEffect(() => {
    isCustomRef.current = isCustom;
  }, [isCustom]);

  useEffect(() => {
    aspectRatioRef.current = aspectRatio || 1;
  }, [aspectRatio]);

  const displayWidthValue = useMemo(() => {
    return fromPixels(targetDimensions.width || imageMetrics.width || 0, unit);
  }, [targetDimensions.width, imageMetrics.width, unit]);

  const displayHeightValue = useMemo(() => {
    return fromPixels(targetDimensions.height || imageMetrics.height || 0, unit);
  }, [targetDimensions.height, imageMetrics.height, unit]);

  const selectionCenter = useMemo(() => {
    if (!imageMetrics.width || !imageMetrics.height || !selection.width || !selection.height) {
      return { xPercent: 50, yPercent: 50 };
    }

    const centerX = selection.x + selection.width / 2;
    const centerY = selection.y + selection.height / 2;

    return {
      xPercent: (centerX / imageMetrics.width) * 100,
      yPercent: (centerY / imageMetrics.height) * 100,
    };
  }, [imageMetrics.height, imageMetrics.width, selection.height, selection.width, selection.x, selection.y]);

  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const element = imageLayerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const overlayStyle = useMemo(() => {
    const { width: imgWidth, height: imgHeight } = imageMetrics;
    if (!imgWidth || !imgHeight || !selection.width || !containerSize.width || !containerSize.height) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }

    const baseScaleX = containerSize.width / imgWidth;
    const baseScaleY = containerSize.height / imgHeight;

    const scaleX = baseScaleX;
    const scaleY = baseScaleY;

    const selectionCenterX = selection.x + selection.width / 2;
    const selectionCenterY = selection.y + selection.height / 2;

    const screenCenterX = selectionCenterX * baseScaleX;
    const screenCenterY = selectionCenterY * baseScaleY;

    const screenWidth = selection.width * scaleX;
    const screenHeight = selection.height * scaleY;

    const maxLeft = containerSize.width - screenWidth;
    const maxTop = containerSize.height - screenHeight;

    const left = Math.min(Math.max(screenCenterX - screenWidth / 2, 0), Math.max(maxLeft, 0));
    const top = Math.min(Math.max(screenCenterY - screenHeight / 2, 0), Math.max(maxTop, 0));

    return {
      left,
      top,
      width: screenWidth,
      height: screenHeight,
    };
  }, [containerSize, imageMetrics, selection]);

  const imageBoxStyle = useMemo(() => {
    if (!imageMetrics.width || !imageMetrics.height) {
      return {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
      } as const;
    }

    const aspect = imageMetrics.width / imageMetrics.height;
    const ratio = `${imageMetrics.width} / ${imageMetrics.height}`;

    if (aspect >= 1) {
      return {
        width: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: ratio,
      } as const;
    }

    return {
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      aspectRatio: ratio,
    } as const;
  }, [imageMetrics.height, imageMetrics.width]);

  const categoryOptions = useMemo(() => {
    const base = ASPECT_RATIO_CATEGORIES.map(category => ({
      value: category.id,
      label: category.label,
    }));

    return [
      ...base,
      { value: 'custom', label: t('controls.customOption') },
    ];
  }, [t]);

  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const { naturalWidth, naturalHeight } = img;
    setImageMetrics({ width: naturalWidth, height: naturalHeight });
    imageMetricsRef.current = { width: naturalWidth, height: naturalHeight };
    setZoom(DEFAULT_ZOOM);
    setSelection({
      x: 0,
      y: 0,
      width: naturalWidth,
      height: naturalHeight,
    });
    setTargetDimensions({ width: naturalWidth, height: naturalHeight });
    setIsImageReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (latestBlobUrl.current) {
        URL.revokeObjectURL(latestBlobUrl.current);
        latestBlobUrl.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isCustom || !isImageReady) return;
    setSelection(current => {
      if (!current.width || !current.height) {
        const width = imageMetrics.width;
        const height = imageMetrics.height;
        return { x: 0, y: 0, width, height };
      }
      return clampSelection(current, imageMetrics.width, imageMetrics.height);
    });
  }, [isCustom, imageMetrics.height, imageMetrics.width, isImageReady]);

  const updateSelection = useCallback((rect: SelectionRect, opts?: { updateTarget?: boolean }) => {
    setSelection(prev => {
      const next = clampSelection(ensureMinimumSize(rect, MIN_SELECTION_SIZE), imageMetrics.width, imageMetrics.height);
      if (opts?.updateTarget && isCustom) {
        setTargetDimensions({
          width: next.width,
          height: next.height,
        });
      }
      return next;
    });
  }, [imageMetrics.height, imageMetrics.width, isCustom]);

  const applyPreset = useCallback((preset: AspectPreset) => {
    if (!imageMetrics.width || !imageMetrics.height) return;
    setSelectedPreset(preset);
    setLockAspect(true);
    setCategoryId(prev => prev === 'custom' ? 'custom' : prev);
    setTargetDimensions({
      width: preset.width,
      height: preset.height,
    });
    const fitted = fitSelectionToAspect(
      preset.width / preset.height,
      imageMetrics.width,
      imageMetrics.height
    );
    updateSelection(fitted);
  }, [imageMetrics.height, imageMetrics.width, updateSelection]);

  useEffect(() => {
    if (!isCustom || !isImageReady) return;
    setSelectedPreset(null);
  }, [isCustom, isImageReady]);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryId(value);
    if (value === 'custom') {
      setSelectedPreset(null);
      setLockAspect(true);
      setTargetDimensions({
        width: imageMetrics.width,
        height: imageMetrics.height,
      });
      updateSelection({
        x: 0,
        y: 0,
        width: imageMetrics.width,
        height: imageMetrics.height,
      }, { updateTarget: true });
      return;
    }

    const nextCategory = getCategoryById(value);
    if (nextCategory && nextCategory.presets.length > 0 && imageMetrics.width && imageMetrics.height) {
      const defaultPreset = nextCategory.presets[0];
      applyPreset(defaultPreset);
    }
  }, [applyPreset, imageMetrics.height, imageMetrics.width, updateSelection]);

  const handleUnitChange = useCallback((value: LengthUnit) => {
    setUnit(value);
  }, []);

  const handleWidthInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return;

    const widthInPx = toPixels(numericValue, unit);
    const heightInPx = lockAspect ? widthInPx / aspectRatio : targetDimensions.height;
    setTargetDimensions({
      width: widthInPx,
      height: lockAspect ? heightInPx : targetDimensions.height,
    });

    if (isCustom) {
      const newAspect = lockAspect ? widthInPx / heightInPx : getAspectRatio(selection);
      const nextSelection = fitSelectionToAspect(
        newAspect,
        imageMetrics.width,
        imageMetrics.height
      );
      updateSelection(nextSelection, { updateTarget: !lockAspect });
    }
  }, [unit, lockAspect, aspectRatio, targetDimensions.height, isCustom, imageMetrics.height, imageMetrics.width, selection, updateSelection]);

  const handleHeightInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return;

    const heightInPx = toPixels(numericValue, unit);
    const widthInPx = lockAspect ? heightInPx * aspectRatio : targetDimensions.width;
    setTargetDimensions({
      width: lockAspect ? widthInPx : targetDimensions.width,
      height: heightInPx,
    });

    if (isCustom) {
      const newAspect = lockAspect ? widthInPx / heightInPx : getAspectRatio(selection);
      const nextSelection = fitSelectionToAspect(
        newAspect,
        imageMetrics.width,
        imageMetrics.height
      );
      updateSelection(nextSelection, { updateTarget: !lockAspect });
    }
  }, [unit, lockAspect, aspectRatio, targetDimensions.width, isCustom, imageMetrics.height, imageMetrics.width, selection, updateSelection]);

  const handleZoomChange = useCallback((value: number) => {
    setZoom(Math.max(MIN_ZOOM, value));
  }, []);

  const updateDerivedBlob = useCallback(async () => {
    if (!imageRef.current || !selection.width || !selection.height || !targetDimensions.width || !targetDimensions.height) {
      setDerivedBlob(null);
      return;
    }

    setIsGeneratingBlob(true);

    const canvas = document.createElement('canvas');
    canvas.width = roundPx(targetDimensions.width);
    canvas.height = roundPx(targetDimensions.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDerivedBlob(null);
      setIsGeneratingBlob(false);
      return;
    }

    const { width: imgWidth, height: imgHeight } = imageMetricsRef.current;

    const centerX = selection.x + selection.width / 2;
    const centerY = selection.y + selection.height / 2;

    const zoomFactor = Math.max(zoom, 1);

    let sourceWidth = selection.width / zoomFactor;
    let sourceHeight = selection.height / zoomFactor;

    sourceWidth = Math.max(1, Math.min(sourceWidth, imgWidth));
    sourceHeight = Math.max(1, Math.min(sourceHeight, imgHeight));

    let sourceX = centerX - sourceWidth / 2;
    let sourceY = centerY - sourceHeight / 2;

    if (sourceX < 0) {
      sourceX = 0;
    }
    if (sourceY < 0) {
      sourceY = 0;
    }
    if (sourceX + sourceWidth > imgWidth) {
      sourceX = imgWidth - sourceWidth;
    }
    if (sourceY + sourceHeight > imgHeight) {
      sourceY = imgHeight - sourceHeight;
    }

    ctx.drawImage(
      imageRef.current,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const mimeType =
      format === 'jpeg' ? 'image/jpeg' :
      format === 'png' ? 'image/png' :
      'image/webp';

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (result) => resolve(result),
        mimeType,
        format === 'jpeg' ? JPEG_QUALITY : undefined
      );
    });

    setDerivedBlob(blob);
    setIsGeneratingBlob(false);
  }, [format, selection.height, selection.width, selection.x, selection.y, targetDimensions.height, targetDimensions.width, zoom]);

  useEffect(() => {
    if (!isImageReady) return;

    const timeout = setTimeout(() => {
      updateDerivedBlob().catch(() => {
        setIsGeneratingBlob(false);
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [isImageReady, selection, targetDimensions, format, updateDerivedBlob]);

  const getPointerPosition = useCallback((event: PointerEvent | React.PointerEvent) => {
    const rect = imageLayerRef.current?.getBoundingClientRect();
    const { width: imgWidth, height: imgHeight } = imageMetricsRef.current;
    if (!rect || !imgWidth || !imgHeight) {
      return { x: 0, y: 0, scaleX: 1, scaleY: 1, rect: null };
    }

    const scaleX = imgWidth / rect.width;
    const scaleY = imgHeight / rect.height;

    return { x: 0, y: 0, scaleX, scaleY, rect };
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const dragState = dragStateRef.current;
    const { width: imgWidth, height: imgHeight } = imageMetricsRef.current;
    if (!dragState || !imgWidth || !imgHeight) return;

    event.preventDefault();
    const { scaleX, scaleY } = getPointerPosition(event);

    const deltaX = (event.clientX - dragState.startPointer.x) * scaleX;
    const deltaY = (event.clientY - dragState.startPointer.y) * scaleY;

    let nextSelection = { ...dragState.startSelection };

    if (dragState.mode === 'move') {
      nextSelection.x = dragState.startSelection.x + deltaX;
      nextSelection.y = dragState.startSelection.y + deltaY;
    } else {
      const handle = dragState.handle;
      const hasLeft = handle.includes('left');
      const hasRight = handle.includes('right');
      const hasTop = handle.includes('top');
      const hasBottom = handle.includes('bottom');

      const startWidth = dragState.startSelection.width;
      const startHeight = dragState.startSelection.height;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = dragState.startSelection.x;
      let newY = dragState.startSelection.y;

      if (lockAspectRef.current) {
        const ratio = aspectRatioRef.current || (startWidth / startHeight) || 1;
        const deltaWidth = (hasLeft ? -deltaX : 0) + (hasRight ? deltaX : 0);
        const deltaHeight = (hasTop ? -deltaY : 0) + (hasBottom ? deltaY : 0);

        const widthCandidate = startWidth + deltaWidth;
        const heightFromWidth = widthCandidate / ratio;
        const heightCandidate = startHeight + deltaHeight;
        const widthFromHeight = heightCandidate * ratio;

        if (Math.abs(heightCandidate - startHeight) > Math.abs(heightFromWidth - startHeight)) {
          newWidth = widthCandidate;
          newHeight = heightFromWidth;
        } else {
          newHeight = heightCandidate;
          newWidth = widthFromHeight;
        }

        newWidth = Math.max(MIN_SELECTION_SIZE, newWidth);
        newHeight = Math.max(MIN_SELECTION_SIZE, newHeight);

        if (hasLeft || hasRight) {
          newX = hasLeft
            ? dragState.startSelection.x + (startWidth - newWidth)
            : dragState.startSelection.x;
        }
        if (hasTop || hasBottom) {
          newY = hasTop
            ? dragState.startSelection.y + (startHeight - newHeight)
            : dragState.startSelection.y;
        }
      } else {
        if (hasLeft) {
          const updatedWidth = startWidth - deltaX;
          newWidth = Math.max(MIN_SELECTION_SIZE, updatedWidth);
          newX = dragState.startSelection.x + (startWidth - newWidth);
        }
        if (hasRight) {
          const updatedWidth = startWidth + deltaX;
          newWidth = Math.max(MIN_SELECTION_SIZE, updatedWidth);
        }
        if (hasTop) {
          const updatedHeight = startHeight - deltaY;
          newHeight = Math.max(MIN_SELECTION_SIZE, updatedHeight);
          newY = dragState.startSelection.y + (startHeight - newHeight);
        }
        if (hasBottom) {
          const updatedHeight = startHeight + deltaY;
          newHeight = Math.max(MIN_SELECTION_SIZE, updatedHeight);
        }
      }

      nextSelection = {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      };
    }

    nextSelection = clampSelection(nextSelection, imgWidth, imgHeight);
    setSelection(nextSelection);

    if (isCustomRef.current) {
      setTargetDimensions({
        width: nextSelection.width,
        height: nextSelection.height,
      });
    }
  }, [getPointerPosition]);

  const finishDrag = useCallback(() => {
    dragStateRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', finishDrag);
    window.removeEventListener('pointercancel', finishDrag);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback((handle: DragHandle) => (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isImageReady) return;

    event.preventDefault();
    event.stopPropagation();

    const { rect } = getPointerPosition(event);
    if (!rect) return;

    const dragState: DragState = {
      mode: handle === 'move' ? 'move' : 'resize',
      handle,
      startPointer: { x: event.clientX, y: event.clientY },
      startSelection: selection,
    };

    dragStateRef.current = dragState;

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
  }, [finishDrag, getPointerPosition, handlePointerMove, isImageReady, selection]);

  const handleDownload = useCallback(async () => {
    if (!imageRef.current) return;

    if (!derivedBlob) {
      await updateDerivedBlob();
    }

    const blob = derivedBlob ?? null;
    if (!blob) return;

    if (latestBlobUrl.current) {
      URL.revokeObjectURL(latestBlobUrl.current);
    }

    const blobUrl = URL.createObjectURL(blob);
    latestBlobUrl.current = blobUrl;

    const filenameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const extension = format === 'jpeg' ? 'jpg' : format;
    const outputName = `${filenameWithoutExt}-resized.${extension}`;

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [derivedBlob, file.name, format, updateDerivedBlob]);

  const handleResetSelection = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
    setCategoryId('custom');
    setSelectedPreset(null);
    setLockAspect(true);
    if (imageMetrics.width && imageMetrics.height) {
      const resetSelection = {
        x: 0,
        y: 0,
        width: imageMetrics.width,
        height: imageMetrics.height,
      };
      setSelection(resetSelection);
      setTargetDimensions({
        width: imageMetrics.width,
        height: imageMetrics.height,
      });
    }
    updateDerivedBlob().catch(() => {});
  }, [imageMetrics.height, imageMetrics.width, updateDerivedBlob]);

  useEffect(() => {
    return () => {
      finishDrag();
    };
  }, [finishDrag]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
      <div className="space-y-3">
        <div
          ref={containerRef}
          className="relative w-full rounded-3xl border border-border bg-muted/60 p-4 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-foreground">
              {t('imageDetails.originalDimensions', {
                width: imageMetrics.width || '--',
                height: imageMetrics.height || '--',
              })}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onReset}>
                {t('actions.changeImage')}
              </Button>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-h-[640px] overflow-hidden rounded-lg bg-background p-4"
            style={{
              aspectRatio: '1 / 1',
            }}
          >
            <div className="absolute inset-3 flex items-center justify-center">
              <div className="relative flex items-center justify-center" style={imageBoxStyle}>
                <div ref={imageLayerRef} className="relative h-full w-full">
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: `${selectionCenter.xPercent}% ${selectionCenter.yPercent}%`,
                    }}
                  >
                    <Image
                      ref={node => {
                        imageRef.current = node;
                      }}
                      src={previewUrl}
                      alt={file.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="pointer-events-none select-none object-contain"
                      onLoad={handleImageLoad}
                    />
                  </div>

                  {isImageReady && (
                    <div
                      role="presentation"
                      className="absolute border-dashed border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                      style={{
                        borderWidth: '2px',
                        left: overlayStyle.left,
                        top: overlayStyle.top,
                        width: overlayStyle.width,
                        height: overlayStyle.height,
                      }}
                      onPointerDown={handlePointerDown('move')}
                    >
                      <div className="pointer-events-none absolute inset-0">
                        <div className="pointer-events-none absolute inset-x-0 border-t border-white/70" style={{ top: '33.333%' }} />
                        <div className="pointer-events-none absolute inset-x-0 border-t border-white/70" style={{ top: '66.666%' }} />
                        <div className="pointer-events-none absolute inset-y-0 border-l border-white/70" style={{ left: '33.333%' }} />
                        <div className="pointer-events-none absolute inset-y-0 border-l border-white/70" style={{ left: '66.666%' }} />

                        <div
                          className="pointer-events-none absolute h-4 w-4 border-2 border-primary border-b-0 border-r-0 bg-transparent"
                          style={{ top: -2, left: -2 }}
                        />
                        <div
                          className="pointer-events-none absolute h-4 w-4 border-2 border-primary border-b-0 border-l-0 bg-transparent"
                          style={{ top: -2, right: -2 }}
                        />
                        <div
                          className="pointer-events-none absolute h-4 w-4 border-2 border-primary border-t-0 border-r-0 bg-transparent"
                          style={{ bottom: -2, left: -2 }}
                        />
                        <div
                          className="pointer-events-none absolute h-4 w-4 border-2 border-primary border-t-0 border-l-0 bg-transparent"
                          style={{ bottom: -2, right: -2 }}
                        />
                      </div>

                      <Handle position="top-left" onPointerDown={handlePointerDown('top-left')} />
                      <Handle position="top-right" onPointerDown={handlePointerDown('top-right')} />
                      <Handle position="bottom-left" onPointerDown={handlePointerDown('bottom-left')} />
                      <Handle position="bottom-right" onPointerDown={handlePointerDown('bottom-right')} />
                      <Handle position="top" onPointerDown={handlePointerDown('top')} />
                      <Handle position="bottom" onPointerDown={handlePointerDown('bottom')} />
                      <Handle position="left" onPointerDown={handlePointerDown('left')} />
                      <Handle position="right" onPointerDown={handlePointerDown('right')} />

                      <div
                        className="absolute left-1/2 -top-3 -translate-x-1/2 -translate-y-full rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow"
                        style={{ transform: 'scale(1)', transformOrigin: 'center bottom' }}
                      >
                        {`${roundPx(targetDimensions.width)} × ${roundPx(targetDimensions.height)}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* border border-border bg-card/60 sm:p-6  */}
        <div className="rounded-2xl p-3 w-[400px] mx-auto">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-foreground">{t('preview.zoom')}</Label>
            <span className="text-sm font-medium text-foreground">{`${zoom.toFixed(2)}x`}</span>
          </div>
          <div className="mt-3">
            <Slider
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.05}
              value={[zoom]}
              onValueChange={([value]) => handleZoomChange(value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/70 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <Label className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {t('controls.aspectRatio')}
            </Label>
            {!isCustom && selectedPreset && (
              <span className="text-xs font-medium text-foreground">
                {`${selectedPreset.label} · ${selectedPreset.width}×${selectedPreset.height}`}
              </span>
            )}
          </div>

          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('controls.selectAspect')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {categoryId !== 'custom' && (
            <div className="mt-6 grid grid-cols-3 gap-x-2 gap-y-4">
              {getCategoryById(categoryId)?.presets.map(preset => {
                const isActive = selectedPreset?.id === preset.id;
                return (
                  <div key={preset.id} className="flex flex-col items-center gap-x-4">
                    <div className="group relative flex aspect-square w-full max-w-[140px] items-center justify-center p-2">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => applyPreset(preset)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            applyPreset(preset);
                          }
                        }}
                        className={cn(
                          'relative !bg-muted flex h-full w-full items-center justify-center rounded-lg border-2 outline-none transition',
                          isActive
                            ? 'border-primary bg-primary/10 shadow-inner'
                            : 'border-dashed border-border/60 bg-card hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary'
                        )}
                      >
                        {/* <div className="absolute inset-0 rounded-2xl border border-dashed border-border/60" /> */}
                        <div className="absolute inset-2 rounded-xl">
                          <div className="flex h-full w-full items-center justify-center">
                            <div
                              className="rounded-xs bg-muted-foreground/20 shadow-inner"
                              style={{
                                aspectRatio: `${preset.width} / ${preset.height}`,
                                width: preset.width >= preset.height ? '100%' : 'auto',
                                height: preset.height >= preset.width ? '100%' : 'auto',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-foreground">{preset.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {categoryId === 'standard' ? `${preset.description}` : 
                        `${preset.width} × ${preset.height}`}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* <button
                type="button"
                onClick={() => setCategoryId('custom')}
                className={cn(
                  'rounded-xl border border-dashed px-4 py-3 text-left transition hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  categoryId === 'custom' ? 'border-primary bg-primary/10' : 'border-border/70'
                )}
              >
                <p className="text-sm font-semibold text-foreground">{t('controls.customCardTitle')}</p>
                <p className="text-xs text-muted-foreground">{t('controls.customCardDescription')}</p>
              </button> */}
            </div>
          )}

          {isCustom && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('controls.lockAspect')}</p>
                  <p className="text-xs text-muted-foreground">{t('controls.lockAspectHint')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={lockAspect} onCheckedChange={setLockAspect} />
                  {lockAspect ? <Lock className="h-4 w-4 text-primary" /> : <Unlock className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">{t('controls.customWidth')}</Label>
                  <Input
                    type="number"
                    min={1}
                    value={Number.isFinite(displayWidthValue) ? Number(displayWidthValue.toFixed(2)) : ''}
                    onChange={handleWidthInputChange}
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">{t('controls.customHeight')}</Label>
                  <Input
                    type="number"
                    min={1}
                    value={Number.isFinite(displayHeightValue) ? Number(displayHeightValue.toFixed(2)) : ''}
                    onChange={handleHeightInputChange}
                  />
                </div>
                <div className="">
                  <Label className="text-sm font-semibold text-muted-foreground">{t('controls.units')}</Label>
                  <Select value={unit} onValueChange={value => handleUnitChange(value as LengthUnit)}>
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {UNIT_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold uppercase tracking-wide text-foreground">{t('export.format')}</Label>
            <Select value={format} onValueChange={value => setFormat(value as SingleImageFormat)}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="JPG" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {FORMAT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl bg-background/70">
            <p className="text-sm text-foreground">
              {t('export.originalSize', { size: formatFileSize(file.size) })}
            </p>
            <p className="text-sm font-bold text-foreground">
              {t('export.newSize', {
                size: derivedBlob ? formatFileSize(derivedBlob.size) : t('export.pending'),
              })}
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" size="lg" onClick={handleDownload} disabled={isGeneratingBlob}>
            {t('actions.download')}
          </Button>
          <Button variant="outline" className="flex-1" size="lg" onClick={handleResetSelection}>
            {t('actions.reset')}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface HandleProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right';
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
}

function Handle({ position, onPointerDown }: HandleProps) {
  const classes = {
    'top-left': 'cursor-nwse-resize -top-2 -left-2',
    'top-right': 'cursor-nesw-resize -top-2 -right-2',
    'bottom-left': 'cursor-nesw-resize -bottom-2 -left-2',
    'bottom-right': 'cursor-nwse-resize -bottom-2 -right-2',
    'top': 'cursor-ns-resize -top-2 left-1/2 -translate-x-1/2',
    'bottom': 'cursor-ns-resize -bottom-2 left-1/2 -translate-x-1/2',
    'left': 'cursor-ew-resize top-1/2 -left-2 -translate-y-1/2',
    'right': 'cursor-ew-resize top-1/2 -right-2 -translate-y-1/2',
  } as const;

  const isCorner = position.includes('-');

  const cornerBorders: Record<HandleProps['position'], string> = {
    'top-left': 'border-b-0 border-r-0 rounded-tl-md',
    'top-right': 'border-b-0 border-l-0 rounded-tr-md',
    'bottom-left': 'border-t-0 border-r-0 rounded-bl-md',
    'bottom-right': 'border-t-0 border-l-0 rounded-br-md',
    top: '',
    bottom: '',
    left: '',
    right: '',
  };

  if (isCorner) {
    const cornerBorderClass = {
      'top-left': 'border-b-0 border-r-0 rounded-tl-[10px]',
      'top-right': 'border-b-0 border-l-0 rounded-tr-[10px]',
      'bottom-left': 'border-t-0 border-r-0 rounded-bl-[10px]',
      'bottom-right': 'border-t-0 border-l-0 rounded-br-[10px]',
    }[position as Exclude<HandleProps['position'], 'top' | 'bottom' | 'left' | 'right'>];

    return (
      <div
        role="presentation"
        className={cn(
          'absolute h-6 w-6',
          classes[position],
          'flex items-center justify-center'
        )}
        onPointerDown={onPointerDown}
      >
        <span
          className={cn(
            'pointer-events-none block h-6 w-6 border-[3px] border-primary',
            cornerBorderClass
          )}
        />
      </div>
    );
  }

  return (
    <div
      role="presentation"
      className={cn(
        'absolute flex items-center justify-center rounded-full bg-primary shadow-lg ring-2 ring-white/70',
        position === 'top' || position === 'bottom' ? 'h-3 w-8' : position === 'left' || position === 'right' ? 'h-8 w-3' : 'h-3 w-3',
        classes[position]
      )}
      onPointerDown={onPointerDown}
    />
  );
}
