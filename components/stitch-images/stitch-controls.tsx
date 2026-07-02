'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type StitchItem, type CanvasSettings } from '@/lib/stitch-utils';
import { Maximize2, Box, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Trash2, Plus, Minus, ChevronDown, Settings } from 'lucide-react';
import { Slider as UI_Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// Note: I renamed Slider to UI_Slider to avoid conflict with the icon name if any, 
// and I noticed I used Slider icon in previous imports but it should be UI component.

interface StitchControlsProps {
  settings: CanvasSettings;
  onUpdateSettings: (settings: CanvasSettings) => void;
  selectedItem: StitchItem | null;
  onUpdateItem: (id: string, updates: Partial<StitchItem>) => void;
  items: StitchItem[];
  onSelectItem: (id: string | null) => void;
  onRemoveItem: (id: string) => void;
  scale: number;
  onZoom: (delta: number) => void;
  onResetZoom: () => void;
  onMoveToFront: (id: string) => void;
  onMoveToBack: (id: string) => void;
  onMoveForward: (id: string) => void;
  onMoveBackward: (id: string) => void;
}

export function StitchControls({
  settings,
  onUpdateSettings,
  selectedItem,
  onUpdateItem,
  items,
  onRemoveItem,
  onSelectItem,
  scale,
  onZoom,
  onResetZoom,
  onMoveToFront,
  onMoveToBack,
  onMoveForward,
  onMoveBackward,
}: StitchControlsProps) {
  const t = useTranslations('ImageStitcherTool');
  const [mounted, setMounted] = useState(false);
  const [isCanvasCollapsed, setIsCanvasCollapsed] = useState(false);
  const [isImagePropsCollapsed, setIsImagePropsCollapsed] = useState(false);
  const [prevHasSelected, setPrevHasSelected] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const hasSelected = selectedItem !== null;
    if (hasSelected !== prevHasSelected) {
      // setIsCanvasCollapsed(hasSelected);
      setIsImagePropsCollapsed(!hasSelected);
      setPrevHasSelected(hasSelected);
    }
  }, [selectedItem, prevHasSelected]);

  const renderCanvasSettings = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground/80">{t('controls.width')}</Label>
          <div className="relative">
            <Input
              type="number"
              className="h-9 px-3 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-primary/20 transition-all text-sm font-medium"
              value={settings.width}
              onChange={(e) => onUpdateSettings({ ...settings, width: Number(e.target.value) })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">PX</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground/80">{t('controls.height')}</Label>
          <div className="relative">
            <Input
              type="number"
              className="h-9 px-3 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-primary/20 transition-all text-sm font-medium"
              value={settings.height}
              onChange={(e) => onUpdateSettings({ ...settings, height: Number(e.target.value) })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">PX</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground/80">{t('controls.backgroundColor')}</Label>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div
              className="w-6 h-6 rounded-xl shadow-sm cursor-pointer border-2 border-background ring-1 ring-border group-hover:ring-primary/40 transition-all"
              style={{ backgroundColor: settings.backgroundColor === 'transparent' ? 'white' : settings.backgroundColor }}
            >
              {settings.backgroundColor === 'transparent' && (
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] [background-size:8px_8px] rounded-lg" />
              )}
              <Input
                type="color"
                value={settings.backgroundColor === 'transparent' ? '#ffffff' : settings.backgroundColor}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={(e) => onUpdateSettings({ ...settings, backgroundColor: e.target.value })}
              />
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <Button
              variant={settings.backgroundColor === 'transparent' ? 'secondary' : 'outline'}
              size="sm"
              className="text-[10px] h-8 font-bold uppercase"
              onClick={() => onUpdateSettings({ ...settings, backgroundColor: 'transparent' })}
            >
              {t('controls.transparent')}
            </Button>
            <Button
              variant={settings.backgroundColor === '#ffffff' ? 'secondary' : 'outline'}
              size="sm"
              className="text-[10px] h-8 font-bold uppercase"
              onClick={() => onUpdateSettings({ ...settings, backgroundColor: '#ffffff' })}
            >
              {t('controls.white')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-card/10">
      <div className="p-4 border-b border-border/40 bg-muted/30">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Settings className="w-3.5 h-3.5" />
          {t('controls.settings')}
        </h4>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Canvas Settings */}
        <div className="border border-border/40 bg-card/25 overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => setIsCanvasCollapsed(!isCanvasCollapsed)}
            className="w-full flex items-center justify-between h-10 px-3 text-left bg-muted hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-primary/80" />
              {t('controls.canvasSettings')}
            </span>
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground/85 transition-transform duration-200", !isCanvasCollapsed && "rotate-180")} />
          </button>

          {!isCanvasCollapsed && (
            <div className="p-4 border-t border-border/40 bg-card/10 animate-in fade-in slide-in-from-top-1 duration-200">
              {renderCanvasSettings()}
            </div>
          )}
        </div>

        {/* Image Properties */}
        {selectedItem && (
          <div className="border border-border/40 bg-card/25 overflow-hidden transition-all duration-200 animate-in slide-in-from-right-4 duration-300">
            <button
              type="button"
              onClick={() => setIsImagePropsCollapsed(!isImagePropsCollapsed)}
              className="w-full flex items-center justify-between h-10 px-3 text-left bg-muted hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-primary/80" />
                {t('controls.imageProperties')}
              </span>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground/85 transition-transform duration-200", !isImagePropsCollapsed && "rotate-180")} />
            </button>

            {!isImagePropsCollapsed && (
              <div className="p-4 border-t border-border/40 bg-card/10 animate-in fade-in slide-in-from-top-1 duration-200 space-y-2">
                <div className="space-y-0">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground/80">{t('controls.rotate')}</Label>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">{selectedItem.rotation.toFixed(0)}°</span>
                  </div>
                  <UI_Slider
                    value={[selectedItem.rotation]}
                    min={-180}
                    max={360}
                    step={1}
                    onValueChange={([val]) => onUpdateItem(selectedItem.id, { rotation: val })}
                    className="py-4"
                  />
                </div>

                <div className="space-y-0">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground/80">{t('controls.opacity')}</Label>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">{Math.round(selectedItem.opacity * 100)}%</span>
                  </div>
                  <UI_Slider
                    value={[selectedItem.opacity]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={([val]) => onUpdateItem(selectedItem.id, { opacity: val })}
                    className="py-4"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground/80">{t('controls.layers')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onMoveToFront(selectedItem.id)}
                      className="gap-1 text-[10px] bg-muted/50 hover:bg-muted uppercase"
                    >
                      <ChevronsUp className="w-3.5 h-3.5" />
                      {t('controls.bringToFront')}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onMoveToBack(selectedItem.id)}
                      className="gap-1 text-[10px] bg-muted/50 hover:bg-muted uppercase"
                    >
                      <ChevronsDown className="w-3.5 h-3.5" />
                      {t('controls.sendToBack')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMoveForward(selectedItem.id)}
                      className="gap-1 text-[10px] bg-muted/50 hover:bg-muted uppercase"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      {t('controls.bringForward')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMoveBackward(selectedItem.id)}
                      className="gap-1 text-[10px] bg-muted/50 hover:bg-muted uppercase"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      {t('controls.sendBackward')}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 h-px bg-border/40" />

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-[10px] font-bold py-3 border-primary/20 hover:bg-primary/5 mb-3 uppercase cursor-pointer"
                  onClick={() => {
                    onUpdateSettings({
                      ...settings,
                      width: Math.round(selectedItem.width),
                      height: Math.round(selectedItem.height),
                    });
                    onUpdateItem(selectedItem.id, { x: 0, y: 0, rotation: 0 });
                  }}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  {t('controls.matchCanvasSize')}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 text-[10px] font-bold py-3 uppercase cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedItem) onRemoveItem(selectedItem.id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t('controls.remove')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Global Toolbar / Zoom Controls */}
        {mounted && (
          <div className="border-t border-border/40 space-y-4">
            <div className="space-y-3">
              <div className="p-3 flex justify-between bg-muted items-center">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/80">{t('controls.zoom')}</Label>
                <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
                  {Math.round(scale * 100)}%
                </span>
              </div>
              <div className="p-3 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 bg-muted/80 border-transparent hover:bg-muted/50 cursor-pointer"
                  onClick={() => onZoom(-0.1)}
                  disabled={scale <= 0.1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 bg-muted/80 border-transparent hover:bg-muted/50 cursor-pointer"
                  onClick={() => onZoom(0.1)}
                  disabled={scale >= 5}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-9 text-[10px] font-bold uppercase gap-2 hover:bg-muted/50 cursor-pointer"
                  onClick={onResetZoom}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  {t('controls.fitToScreen')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
