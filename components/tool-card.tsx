import { Star, BadgeCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AITool } from '@/lib/types';

interface ToolCardProps {
  tool: AITool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const imageUrl = tool.image_url || tool.imageUrl;
  const isBase64Image = imageUrl?.startsWith('data:image/');

  return (
    <div className="group relative bg-background border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
      {/* Featured Badge */}
      {tool.featured && (
        <div className="absolute -top-2 -right-2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
          Featured
        </div>
      )}

      <div className="flex flex-col h-full">
        {/* Header - Clickable */}
        <div className="flex items-start gap-4 mb-4">
          {/* Tool Image/Icon */}
          <Link href={`/tools/${tool.id}`} className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {imageUrl ? (
              isBase64Image ? (
                <img
                  src={imageUrl}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={tool.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <span className="text-2xl font-bold text-gradient">
                {tool.name.charAt(0)}
              </span>
            )}
          </Link>

          {/* Tool Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/tools/${tool.id}`}>
                <h3 className="font-bold text-lg truncate hover:text-primary transition-colors cursor-pointer">
                  {tool.name}
                </h3>
              </Link>
              {tool.verified && (
                <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span className="px-2 py-0.5 bg-secondary/10 rounded text-xs">
                {tool.category}
              </span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-semibold">
                {tool.pricing}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-secondary mb-4 line-clamp-2 flex-1">
          {tool.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{tool.rating}</span>
          </div>
          <span className="text-xs text-secondary">
            ({tool.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-2 mb-4">
          {tool.platforms.map((platform) => (
            <span
              key={platform}
              className="text-xs px-2 py-1 bg-secondary/10 rounded"
            >
              {platform}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm flex items-center justify-center gap-2 group-hover:gap-3"
        >
          Try Now
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
