'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { type StitchItem, type CanvasSettings, renderStitchedImage } from '@/lib/stitch-utils';
import { StitchCanvas } from './stitch-canvas';
import { StitchControls } from './stitch-controls';
import { StitchLayersList } from './stitch-layers-list';
import { Download, RotateCcw, Plus, ImageIcon } from 'lucide-react';
import { getImageDimensions } from '@/lib/image-resize-utils';

export function ImageStitcherWorkspace() {
  const t = useTranslations('ImageStitcherTool');
  const [items, setItems] = useState<StitchItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [workspaceSize, setWorkspaceSize] = useState({ width: 0, height: 0 });
  const [userScale, setUserScale] = useState<number | null>(null);
  const [autoScale, setAutoScale] = useState(1);
  const scale = userScale ?? autoScale;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const selectedItem = items.find((item) => item.id === selectedId) || null;

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newItems: StitchItem[] = [];

    for (const file of files) {
      try {
        const dimensions = await getImageDimensions(file);
        const previewUrl = URL.createObjectURL(file);

        const scale = Math.min(
          1,
          canvasSettings.width / dimensions.width,
          canvasSettings.height / dimensions.height
        ) * 0.5;

        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          previewUrl,
          x: (canvasSettings.width - dimensions.width * scale) / 2,
          y: (canvasSettings.height - dimensions.height * scale) / 2,
          width: dimensions.width * scale,
          height: dimensions.height * scale,
          rotation: 0,
          zIndex: items.length + newItems.length,
          opacity: 1,
        });
      } catch (error) {
        console.error('Failed to load image:', error);
        toast.error(t('errors.loadFailed', { name: file.name }));
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setSelectedId(newItems[newItems.length - 1].id);
      toast.success(t('actions.uploadMore'));
    }
  }, [canvasSettings, items.length, t]);

  const removeSelectedItem = useCallback(() => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const removeItemById = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const updateItem = useCallback((id: string, updates: Partial<StitchItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const handleDownload = async () => {
    if (items.length === 0) {
      toast.error(t('errors.noImages'));
      return;
    }
    setIsExporting(true);
    try {
      const blob = await renderStitchedImage(canvasSettings, items);
      const filename = `stitched-image-${Date.now()}.png`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success(t('actions.download'));
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(t('errors.exportFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  const clearCanvas = () => {
    items.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setSelectedId(null);
  };

  const handleSetCanvasToItemSize = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setCanvasSettings((prev) => ({
      ...prev,
      width: Math.round(item.width),
      height: Math.round(item.height),
    }));

    updateItem(id, { x: 0, y: 0, rotation: 0 });
    toast.success(t('controls.matchCanvasSize'));
  }, [items, t, updateItem]);

  const handleZoom = useCallback((delta: number) => {
    setUserScale((prev) => {
      const current = prev ?? autoScale;
      return Math.min(5, Math.max(0.1, current + delta));
    });
  }, [autoScale]);

  const handleResetZoom = useCallback(() => {
    setUserScale(null);
  }, []);

  // Layer reordering handlers
  const normalizeZIndices = useCallback((items: StitchItem[]) => {
    return [...items]
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((item, index) => ({ ...item, zIndex: index }));
  }, []);

  const handleMoveToFront = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const targetItem = prev.find((item) => item.id === id);
      if (!targetItem) return prev;

      const otherItems = prev.filter((item) => item.id !== id);
      const maxZ = Math.max(...otherItems.map((item) => item.zIndex), -1);
      
      const newItems = [
        ...otherItems,
        { ...targetItem, zIndex: maxZ + 1 }
      ];
      return normalizeZIndices(newItems);
    });
  }, [normalizeZIndices]);

  const handleMoveToBack = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const targetItem = prev.find((item) => item.id === id);
      if (!targetItem) return prev;

      const otherItems = prev.filter((item) => item.id !== id);
      const minZ = Math.min(...otherItems.map((item) => item.zIndex), 0);
      
      const newItems = [
        ...otherItems,
        { ...targetItem, zIndex: minZ - 1 }
      ];
      return normalizeZIndices(newItems);
    });
  }, [normalizeZIndices]);

  const handleMoveForward = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sorted.findIndex((item) => item.id === id);

      if (currentIndex < sorted.length - 1) {
        const currentItem = sorted[currentIndex];
        const nextItem = sorted[currentIndex + 1];
        
        // Swap zIndices
        const nextZ = nextItem.zIndex;
        const currentZ = currentItem.zIndex;

        const newItems = prev.map((item) => {
          if (item.id === id) return { ...item, zIndex: nextZ };
          if (item.id === nextItem.id) return { ...item, zIndex: currentZ };
          return item;
        });
        return normalizeZIndices(newItems);
      }
      return prev;
    });
  }, [normalizeZIndices]);

  const handleMoveBackward = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sorted.findIndex((item) => item.id === id);

      if (currentIndex > 0) {
        const currentItem = sorted[currentIndex];
        const prevItem = sorted[currentIndex - 1];
        
        // Swap zIndices
        const prevZ = prevItem.zIndex;
        const currentZ = currentItem.zIndex;

        const newItems = prev.map((item) => {
          if (item.id === id) return { ...item, zIndex: prevZ };
          if (item.id === prevItem.id) return { ...item, zIndex: currentZ };
          return item;
        });
        return normalizeZIndices(newItems);
      }
      return prev;
    });
  }, [normalizeZIndices]);

  useEffect(() => {
    if (!mainRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        // Ensure non-negative dimensions with a safe buffer
        setWorkspaceSize({
          width: Math.max(100, width - 60),
          height: Math.max(100, height - 60)
        });
      }
    });

    observer.observe(mainRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const w = Math.max(1, canvasSettings.width);
    const h = Math.max(1, canvasSettings.height);

    const scaleX = workspaceSize.width / w;
    const scaleY = workspaceSize.height / h;

    const calculatedScale = Math.min(1, scaleX, scaleY);
    // Ensure scale is a valid positive number
    setAutoScale(isNaN(calculatedScale) || calculatedScale <= 0 ? 1 : calculatedScale);
  }, [workspaceSize, canvasSettings.width, canvasSettings.height]);

  useEffect(() => {
    return () => {
      items.forEach(item => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  return (
    <div className="overflow-hidden border border-border/60 bg-background/50 backdrop-blur-md flex flex-col min-h-[700px] py-0 gap-0">
      {/* Studio Top Bar */}
      <div className="border-b border-border/40 bg-muted/20 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{t('metadata.title')}</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{items.length} {t('controls.layers')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 shrink-0 h-9"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('controls.addItem')}</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                handleFilesSelected(Array.from(e.target.files));
              }
              e.target.value = '';
            }}
          />

          <div className="h-6 w-px bg-border/40 mx-1 shrink-0" />

          <Button
            variant="ghost"
            size="sm"
            onClick={clearCanvas}
            disabled={items.length === 0}
            className="gap-2 shrink-0 h-9"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{t('actions.reset')}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            disabled={items.length === 0 || isExporting}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 shadow-lg shadow-primary/20 h-9"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('actions.download')}</span>
          </Button>
        </div>
      </div>

      {/* Studio Workspace Area - 3 Column Layout */}
      <div className="flex-1 grid grid-cols-[240px_1fr_280px] divide-x divide-border/40 overflow-hidden">
        {/* Left Sidebar: Layers */}
        <aside className="bg-muted/5 overflow-hidden">
          <StitchLayersList
            items={items}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
            onRemoveItem={removeItemById}
          />
        </aside>

        {/* Center: Canvas Area */}
        <main ref={mainRef} className="relative flex flex-col bg-muted/10 overflow-hidden">
          <div className="flex-1 relative overflow-auto custom-scrollbar flex items-center justify-center">
            <StitchCanvas
              items={items}
              settings={canvasSettings}
              selectedId={selectedId}
              onSelectItem={setSelectedId}
              onUpdateItem={updateItem}
              onFilesDropped={handleFilesSelected}
              onSetCanvasToItemSize={handleSetCanvasToItemSize}
              onRemoveItem={removeItemById}
              scale={scale}
              onZoom={handleZoom}
              onResetZoom={handleResetZoom}
              onMoveToFront={handleMoveToFront}
              onMoveToBack={handleMoveToBack}
              onMoveForward={handleMoveForward}
              onMoveBackward={handleMoveBackward}
            />
          </div>
        </main>

        {/* Right Sidebar: Controls/Properties */}
        <aside className="bg-muted/5 overflow-hidden">
          <StitchControls
            settings={canvasSettings}
            onUpdateSettings={setCanvasSettings}
            selectedItem={selectedItem}
            onUpdateItem={updateItem}
            items={items}
            onRemoveItem={removeSelectedItem}
            onSelectItem={setSelectedId}
            scale={scale}
            onZoom={handleZoom}
            onResetZoom={handleResetZoom}
            onMoveToFront={handleMoveToFront}
            onMoveToBack={handleMoveToBack}
            onMoveForward={handleMoveForward}
            onMoveBackward={handleMoveBackward}
          />
        </aside>
      </div>
    </div>
  );
}
