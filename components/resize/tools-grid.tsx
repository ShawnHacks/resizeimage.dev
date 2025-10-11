'use client';

import { 
  Type, 
  Minimize2, 
  Crop, 
  FileText, 
  List, 
  Camera, 
  FileEdit, 
  ImagePlus,
  Hash
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Tool {
  icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  iconBg: string;
  iconColor: string;
}

export function ToolsGrid() {
  const t = useTranslations('ResizeTool.tools');

  const tools: Tool[] = [
    {
      icon: Minimize2,
      name: t('compress'),
      description: t('compressDesc'),
      href: '/tools/compress-image',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
    },
    {
      icon: Crop,
      name: t('crop'),
      description: t('cropDesc'),
      href: '/tools/crop-image',
      iconBg: 'bg-white border-2 border-dashed border-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      icon: Camera,
      name: t('screenshot'),
      description: t('screenshotDesc'),
      href: 'https://websitescreenshot.online',
      iconBg: 'bg-green-600 border-2 border-green-600',
      iconColor: 'text-white',
    },
    {
      icon: ImagePlus,
      name: t('watermark'),
      description: t('watermarkDesc'),
      href: '/tools/watermark',
      iconBg: 'bg-gradient-to-br from-blue-500 to-red-500',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="mt-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link
              key={index}
              href={tool.href}
              target="_blank"
              className="bg-card rounded-xl p-4 border border-border hover:shadow-lg hover:border-purple-500 transition-all group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`${tool.iconBg} w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
