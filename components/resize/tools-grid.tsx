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
import Image from 'next/image';
import { StaticImageData } from 'next/image';

import websitescreenshot from '@/public/tools/websitescreenshot.png';
import bulkresizeimages from '@/public/tools/bulkresizeimages.png';


interface Tool {
  icon?: React.ElementType;
  src?: StaticImageData;
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
      // icon: Camera,
      src: websitescreenshot,
      name: t('screenshot'),
      description: t('screenshotDesc'),
      href: 'https://websitescreenshot.online',
      iconBg: 'bg-green-600 border-2 border-green-600',
      iconColor: 'text-white',
    },
    {
      src: bulkresizeimages,
      name: t('bulkresizeimages'),
      description: t('bulkresizeimagesDesc'),
      href: 'https://bulkresizeimages.online',
      iconBg: 'bg-green-600 border-2 border-green-600',
      iconColor: 'text-white',
    },
    {
      icon: Minimize2,
      name: t('compress'),
      description: t('compressDesc'),
      href: '#',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
    },
    {
      icon: Crop,
      name: t('crop'),
      description: t('cropDesc'),
      href: '#',
      iconBg: 'bg-white border-2 border-dashed border-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      icon: ImagePlus,
      name: t('watermark'),
      description: t('watermarkDesc'),
      href: '#',
      iconBg: 'bg-gradient-to-br from-blue-500 to-red-500',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="mt-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const src = tool.src;
          return (
            <Link
              key={index}
              href={tool.href}
              target="_blank"
              className="bg-card rounded-xl px-2 py-4 md:px-4 border border-border hover:shadow-lg hover:border-purple-500 transition-all group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {Icon ? 
                <div className={`${tool.iconBg} w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${tool.iconColor}`} /> 
                </div>
                : 
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Image src={tool.src!} alt={tool.name} width={80} height={80} className='w-12 h-12 rounded-lg' />
                </div>
                }
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
