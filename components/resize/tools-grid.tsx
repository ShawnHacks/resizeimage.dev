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

interface Tool {
  icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  iconBg: string;
  iconColor: string;
}

const tools: Tool[] = [
  // {
  //   icon: Type,
  //   name: 'Change Case To...',
  //   description: 'Change Capitalization',
  //   href: '/tools/change-case',
  //   iconBg: 'bg-gray-800',
  //   iconColor: 'text-white',
  // },
  {
    icon: Minimize2,
    name: 'Compress Image',
    description: 'Compress Images',
    href: '/tools/compress-image',
    iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    iconColor: 'text-gray-900',
  },
  {
    icon: Crop,
    name: 'Crop image',
    description: 'Crop Images',
    href: '/tools/crop-image',
    iconBg: 'bg-white border-2 border-dashed border-blue-500',
    iconColor: 'text-blue-500',
  },
  // {
  //   icon: FileText,
  //   name: 'DOCUVERT',
  //   description: 'Convert Documents',
  //   href: '/tools/convert-document',
  //   iconBg: 'bg-red-600',
  //   iconColor: 'text-white',
  // },
  // {
  //   icon: List,
  //   name: 'Combine Lists',
  //   description: 'Combine Lists',
  //   href: '/tools/combine-lists',
  //   iconBg: 'bg-gray-100',
  //   iconColor: 'text-gray-800',
  // },
  {
    icon: Camera,
    name: 'Website Screenshot Online',
    description: 'Take Screenshots',
    href: 'https://websitescreenshot.online',
    iconBg: 'bg-green-600 border-2 border-green-600',
    iconColor: 'text-white',
  },
  // {
  //   icon: FileEdit,
  //   name: 'Temporary Note',
  //   description: 'Write Notes',
  //   href: '/tools/temporary-note',
  //   iconBg: 'bg-gray-100',
  //   iconColor: 'text-gray-800',
  // },
  {
    icon: ImagePlus,
    name: 'WATERMARK IMAGE',
    description: 'Watermark Images',
    href: '/tools/watermark',
    iconBg: 'bg-gradient-to-br from-blue-500 to-red-500',
    iconColor: 'text-white',
  },
  // {
  //   icon: Hash,
  //   name: 'WORD COUNTS',
  //   description: 'Count Words',
  //   href: '/tools/word-count',
  //   iconBg: 'bg-gray-900',
  //   iconColor: 'text-white',
  // },
];

export function ToolsGrid() {
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
