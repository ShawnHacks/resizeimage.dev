'use client';

import { motion } from 'motion/react';
import { type StitchItem } from '@/lib/stitch-utils';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuSeparator, 
  ContextMenuTrigger 
} from '@/components/ui/context-menu';
import { Maximize, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface StitchItemProps {
  item: StitchItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<StitchItem>) => void;
  onSetCanvasSize: () => void;
  onRemove: () => void;
  onMoveToFront: () => void;
  onMoveToBack: () => void;
  onMoveForward: () => void;
  onMoveBackward: () => void;
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
}

export function StitchItemComponent({
  item,
  isSelected,
  onSelect,
  onUpdate,
  onSetCanvasSize,
  onRemove,
  onMoveToFront,
  onMoveToBack,
  onMoveForward,
  onMoveBackward,
  canvasWidth,
  canvasHeight,
  scale,
}: StitchItemProps) {
  const t = useTranslations('ImageStitcherTool');
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Custom resize logic
  const handleResize = (e: React.PointerEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = item.width;
    const startHeight = item.height;
    const startXPos = item.x;
    const startYPos = item.y;

    const rotationRad = (item.rotation * Math.PI) / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);

    const centerX = startXPos + startWidth / 2;
    const centerY = startYPos + startHeight / 2;

    // Determine which point should stay fixed (the point opposite to the handle being dragged)
    let fixedX = 0; // Local unrotated coordinate relative to center
    let fixedY = 0;

    if (direction.includes('left')) fixedX = startWidth / 2;
    else if (direction.includes('right')) fixedX = -startWidth / 2;

    if (direction.includes('top')) fixedY = startHeight / 2;
    else if (direction.includes('bottom')) fixedY = -startHeight / 2;

    // Calculate world position of the fixed point
    const fixedWorldX = centerX + (fixedX * cos - fixedY * sin);
    const fixedWorldY = centerY + (fixedX * sin + fixedY * cos);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaScreenX = (moveEvent.clientX - startX) / scale;
      const deltaScreenY = (moveEvent.clientY - startY) / scale;

      // Project mouse delta onto item's local axes (inverse rotation)
      const deltaLocalX = deltaScreenX * cos + deltaScreenY * sin;
      const deltaLocalY = -deltaScreenX * sin + deltaScreenY * cos;

      const aspectRatio = startWidth / startHeight;
      const isShiftKey = moveEvent.shiftKey;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate initial new dimensions based on handles
      if (direction.includes('right')) newWidth = Math.max(10, startWidth + deltaLocalX);
      if (direction.includes('left')) newWidth = Math.max(10, startWidth - deltaLocalX);
      if (direction.includes('bottom')) newHeight = Math.max(10, startHeight + deltaLocalY);
      if (direction.includes('top')) newHeight = Math.max(10, startHeight - deltaLocalY);

      // Preserve aspect ratio for corner handles by default (toggle with Shift)
      if (!isShiftKey && (direction.includes('top-') || direction.includes('bottom-'))) {
        // Use the dimension that changed most relative to its range or just prioritize one
        if (direction.includes('left') || direction.includes('right')) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }

      // Calculate new center based on the fixed point
      // New local coordinates of the fixed point relative to the new center
      let newFixedX = 0;
      let newFixedY = 0;
      if (direction.includes('left')) newFixedX = newWidth / 2;
      else if (direction.includes('right')) newFixedX = -newWidth / 2;
      if (direction.includes('top')) newFixedY = newHeight / 2;
      else if (direction.includes('bottom')) newFixedY = -newHeight / 2;

      const newCenterX = fixedWorldX - (newFixedX * cos - newFixedY * sin);
      const newCenterY = fixedWorldY - (newFixedX * sin + newFixedY * cos);

      onUpdate({
        width: newWidth,
        height: newHeight,
        x: newCenterX - newWidth / 2,
        y: newCenterY - newHeight / 2
      });
    };

    const onPointerUp = () => {
      isResizingRef.current = false;
      setIsResizing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Custom rotate logic
  const handleRotate = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - centerX;
      const deltaY = moveEvent.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      onUpdate({ rotation: angle });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.div
          onPan={(e, info) => {
            if (isResizingRef.current) return;
            onUpdate({
              x: item.x + info.delta.x / scale,
              y: item.y + info.delta.y / scale
            });
          }}
          onPanStart={() => {
            if (!isResizingRef.current) setIsDragging(true);
          }}
          onPanEnd={() => setIsDragging(false)}
          onContextMenu={() => onSelect()}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={cn(
            "absolute cursor-move select-none group",
            isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
          style={{
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            zIndex: item.zIndex,
            rotate: item.rotation,
            opacity: item.opacity,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.previewUrl}
            alt={t('controls.layerName', { index: item.zIndex })}
            className="w-full h-full object-contain pointer-events-none"
          />

          {isSelected && (
            <>
              {/* Resize handles */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary border border-white cursor-nw-resize z-50" onPointerDown={(e) => handleResize(e, 'top-left')} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary border border-white cursor-ne-resize z-50" onPointerDown={(e) => handleResize(e, 'top-right')} />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary border border-white cursor-sw-resize z-50" onPointerDown={(e) => handleResize(e, 'bottom-left')} />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary border border-white cursor-se-resize z-50" onPointerDown={(e) => handleResize(e, 'bottom-right')} />

              <div className="absolute top-1/2 -left-1 w-2 h-4 bg-primary border border-white -translate-y-1/2 cursor-w-resize z-50" onPointerDown={(e) => handleResize(e, 'left')} />
              <div className="absolute top-1/2 -right-1 w-2 h-4 bg-primary border border-white -translate-y-1/2 cursor-e-resize z-50" onPointerDown={(e) => handleResize(e, 'right')} />
              <div className="absolute -top-1 left-1/2 w-4 h-2 bg-primary border border-white -translate-x-1/2 cursor-n-resize z-50" onPointerDown={(e) => handleResize(e, 'top')} />
              <div className="absolute -bottom-1 left-1/2 w-4 h-2 bg-primary border border-white -translate-x-1/2 cursor-s-resize z-50" onPointerDown={(e) => handleResize(e, 'bottom')} />

              {/* Rotation handle */}
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-50 shadow-md"
                onPointerDown={handleRotate}
              >
                <div className="w-1 h-1 bg-primary rounded-full" />
              </div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-primary -z-10" />
            </>
          )}
        </motion.div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onSetCanvasSize} className="gap-2">
          <Maximize className="w-4 h-4" />
          <span>{t('controls.setCanvasToImageSize')}</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />

        <ContextMenuItem onClick={onMoveToFront} className="gap-2">
          <ArrowUp className="w-4 h-4" />
          <span>{t('controls.bringToFront')}</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onMoveForward} className="gap-2">
          <ArrowUp className="w-4 h-4 opacity-50" />
          <span>{t('controls.bringForward')}</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onMoveBackward} className="gap-2">
          <ArrowDown className="w-4 h-4 opacity-50" />
          <span>{t('controls.sendBackward')}</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onMoveToBack} className="gap-2">
          <ArrowDown className="w-4 h-4" />
          <span>{t('controls.sendToBack')}</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onRemove} className="gap-2 text-destructive focus:text-destructive">
          <Trash2 className="w-4 h-4" />
          <span>{t('controls.remove')}</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
