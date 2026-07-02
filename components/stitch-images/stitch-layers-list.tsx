'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { type StitchItem } from '@/lib/stitch-utils';
import { Layers, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StitchLayersListProps {
  items: StitchItem[];
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onRemoveItem: (id: string) => void;
}

export function StitchLayersList({
  items,
  selectedId,
  onSelectItem,
  onRemoveItem,
}: StitchLayersListProps) {
  const t = useTranslations('ImageStitcherTool');
  const sortedItems = [...items].sort((a, b) => b.zIndex - a.zIndex) as StitchItem[];

  return (
    <div className="h-full flex flex-col bg-card/10">
      <div className="p-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Layers className="w-3.5 h-3.5" />
          {t('controls.layers')}
        </h4>
        <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
          {items.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {sortedItems.length > 0 ? (
          sortedItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className={cn(
                "group flex items-center gap-3 p-2 rounded-xl transition-all border cursor-pointer relative",
                selectedId === item.id
                  ? "bg-primary/5 border-primary/20 shadow-sm ring-1 ring-primary/10"
                  : "bg-transparent border-transparent hover:bg-muted/20 hover:border-border/40"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-border/40 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.previewUrl} alt="thumb" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-[11px] font-bold truncate transition-colors",
                  selectedId === item.id ? "text-primary" : "opacity-80"
                )}>
                  {item.file.name ? item.file.name : t('controls.layerName', { index: item.zIndex + 1 })}
                </p>
                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                  {item.width.toFixed(0)}x{item.height.toFixed(0)}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <div className="text-[9px] font-mono font-bold text-muted-foreground/60 w-5 text-right">
                  {item.zIndex}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              {selectedId === item.id && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-full" />
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border/10 rounded-2xl mx-2">
            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">{t('controls.noLayers')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
