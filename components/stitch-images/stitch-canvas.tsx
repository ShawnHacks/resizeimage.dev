'use client';

import { useRef } from 'react';
import { type StitchItem, type CanvasSettings } from '@/lib/stitch-utils';
import { StitchItemComponent } from './stitch-item';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StitchCanvasProps {
  items: StitchItem[];
  settings: CanvasSettings;
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItem: (id: string, updates: Partial<StitchItem>) => void;
  onFilesDropped: (files: File[]) => void;
  onSetCanvasToItemSize: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onMoveToFront: (id: string) => void;
  onMoveToBack: (id: string) => void;
  onMoveForward: (id: string) => void;
  onMoveBackward: (id: string) => void;
  scale: number;
  onZoom?: (delta: number) => void;
  onResetZoom?: () => void;
}

export function StitchCanvas({
  items,
  settings,
  selectedId,
  onSelectItem,
  onUpdateItem,
  onFilesDropped,
  onSetCanvasToItemSize,
  onRemoveItem,
  onMoveToFront,
  onMoveToBack,
  onMoveForward,
  onMoveBackward,
  scale = 1,
  onZoom,
  onResetZoom,
}: StitchCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('ImageStitcherTool');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(Array.from(e.dataTransfer.files));
    }
  };

  // Handle Ctrl/Cmd + Wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    if ((e.ctrlKey || e.metaKey) && onZoom) {
      e.preventDefault();
      // Adjust zoom speed and direction
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      onZoom(delta);
    }
  };

  return (
    <div
      className="relative flex-1 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] bg-muted/20 flex items-center justify-center overflow-auto p-12 min-h-[600px] max-h-[700px] cursor-crosshair group/canvas"
      onClick={() => onSelectItem(null)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onWheel={handleWheel}
    >
      {/* Scaling Wrapper: This div has the visual size of the scaled canvas to prevent overflow */}
      <div
        style={{
          width: settings.width * scale,
          height: settings.height * scale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden', // CRITICAL: Isolates the large logical dimensions of the scaled child
        }}
        className="shrink-0 ring-1 ring-border/50 rounded-sm"
      >
        <div
          className="relative transition-all duration-300 ease-in-out shrink-0"
          style={{
            width: settings.width,
            height: settings.height,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            backgroundColor: settings.backgroundColor === 'transparent' ? 'transparent' : settings.backgroundColor,
            // If background is transparent, show checkered pattern
            backgroundImage: settings.backgroundColor === 'transparent'
              ? 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)'
              : 'none',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          {items.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map((item) => (
            <StitchItemComponent
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onSelect={() => onSelectItem(item.id)}
              onUpdate={(updates: Partial<StitchItem>) => onUpdateItem(item.id, updates)}
              onSetCanvasSize={() => onSetCanvasToItemSize(item.id)}
              onRemove={() => onRemoveItem(item.id)}
              onMoveToFront={() => onMoveToFront(item.id)}
              onMoveToBack={() => onMoveToBack(item.id)}
              onMoveForward={() => onMoveForward(item.id)}
              onMoveBackward={() => onMoveBackward(item.id)}
              canvasWidth={settings.width}
              canvasHeight={settings.height}
              scale={scale}
            />
          ))}
        </div>
      </div>

      {/* Empty State Overlay */}
      {items.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none transition-all duration-700 group-hover/canvas:scale-105">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 border border-primary/10 shadow-inner">
            <Plus className="w-10 h-10 text-primary/40" />
          </div>
          <p className="text-sm font-medium text-muted-foreground/80 max-w-[200px] leading-relaxed">
            {t('canvas.placeholder')}
          </p>
        </div>
      )}
    </div>
  );
}
