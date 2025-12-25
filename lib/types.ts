export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Trial';
  platforms: ('Web' | 'iOS' | 'Android' | 'Desktop')[];
  verified: boolean;
  featured: boolean;
  imageUrl: string;
  image_url?: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  toolCount: number;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  readTime: string;
  url: string;
}
