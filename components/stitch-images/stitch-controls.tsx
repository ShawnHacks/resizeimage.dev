'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type StitchItem, type CanvasSettings } from '@/lib/stitch-utils';
import { Maximize2, Box, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Trash2, Plus, Minus } from 'lucide-react';
import { Slider as UI_Slider } from '@/components/ui/slider';

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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full flex flex-col bg-card/10">
      <div className="p-4 border-b border-border/40 bg-muted/30">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          {selectedItem ? (
            <>
              <Box className="w-3.5 h-3.5" />
              {t('controls.imageProperties')}
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              {t('controls.canvasSettings')}
            </>
          )}
        </h4>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
        {!selectedItem ? (
          <section className="space-y-5">
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
                    className="text-[10px] h-9 font-bold uppercase"
                    onClick={() => onUpdateSettings({ ...settings, backgroundColor: 'transparent' })}
                  >
                    {t('controls.transparent')}
                  </Button>
                  <Button
                    variant={settings.backgroundColor === '#ffffff' ? 'secondary' : 'outline'}
                    size="sm"
                    className="text-[10px] h-9 font-bold uppercase"
                    onClick={() => onUpdateSettings({ ...settings, backgroundColor: '#ffffff' })}
                  >
                    {t('controls.white')}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <div className="space-y-3">
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

              <div className="space-y-3">
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
                    className="gap-1 text-[10px] h-10 font-bold bg-muted/50 hover:bg-muted uppercase"
                  >
                    <ChevronsUp className="w-3.5 h-3.5" />
                    {t('controls.bringToFront')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onMoveToBack(selectedItem.id)}
                    className="gap-1 text-[10px] h-10 font-bold bg-muted/50 hover:bg-muted uppercase"
                  >
                    <ChevronsDown className="w-3.5 h-3.5" />
                    {t('controls.sendToBack')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveForward(selectedItem.id)}
                    className="gap-1 text-[10px] h-10 font-bold uppercase"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    {t('controls.bringForward')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveBackward(selectedItem.id)}
                    className="gap-1 text-[10px] h-10 font-bold uppercase"
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
                className="w-full gap-2 text-[10px] font-bold py-6 border-primary/20 hover:bg-primary/5 mb-3 uppercase"
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
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 text-[10px] font-bold py-6 uppercase"
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedItem) onRemoveItem(selectedItem.id);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t('controls.remove')}
              </Button>
            </div>
          </section>
        )}

        {/* Global Toolbar / Zoom Controls */}
        {mounted && (
          <div className="pt-4 border-t border-border/40 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/80">{t('controls.zoom')}</Label>
                <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
                  {Math.round(scale * 100)}%
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 bg-muted/30 border-transparent hover:bg-muted/50"
                  onClick={() => onZoom(-0.1)}
                  disabled={scale <= 0.1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 bg-muted/30 border-transparent hover:bg-muted/50"
                  onClick={() => onZoom(0.1)}
                  disabled={scale >= 5}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-9 text-[10px] font-bold uppercase gap-2 hover:bg-muted/50"
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
