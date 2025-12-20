import { AITool, Category, NewsItem } from './types';

export const sampleTools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced conversational AI that can help with writing, coding, analysis, and more.',
    category: 'Chatbots',
    rating: 4.6,
    reviewCount: 12453,
    pricing: 'Freemium',
    platforms: ['Web', 'iOS', 'Android'],
    verified: true,
    featured: true,
    imageUrl: '/placeholder-chatgpt.png',
    url: 'https://chat.openai.com'
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'Create stunning AI-generated artwork and images from text descriptions.',
    category: 'Image Generation',
    rating: 4.5,
    reviewCount: 8921,
    pricing: 'Paid',
    platforms: ['Web'],
    verified: true,
    featured: true,
    imageUrl: '/placeholder-midjourney.png',
    url: 'https://midjourney.com'
  },
  {
    id: '3',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster with intelligent suggestions.',
    category: 'Code Assistant',
    rating: 4.4,
    reviewCount: 6734,
    pricing: 'Paid',
    platforms: ['Desktop'],
    verified: true,
    featured: false,
    imageUrl: '/placeholder-copilot.png',
    url: 'https://github.com/features/copilot'
  },
  {
    id: '4',
    name: 'Jasper AI',
    description: 'AI content creation platform for marketing copy, blog posts, and social media.',
    category: 'Writing',
    rating: 4.3,
    reviewCount: 5432,
    pricing: 'Paid',
    platforms: ['Web'],
    verified: true,
    featured: false,
    imageUrl: '/placeholder-jasper.png',
    url: 'https://jasper.ai'
  },
  {
    id: '5',
    name: 'Eleven Labs',
    description: 'Generate realistic AI voices and clone your own voice for various applications.',
    category: 'Voice & Audio',
    rating: 4.5,
    reviewCount: 4123,
    pricing: 'Freemium',
    platforms: ['Web'],
    verified: true,
    featured: true,
    imageUrl: '/placeholder-elevenlabs.png',
    url: 'https://elevenlabs.io'
  },
  {
    id: '6',
    name: 'Runway ML',
    description: 'AI-powered video editing and generation tools for creative professionals.',
    category: 'Video',
    rating: 4.4,
    reviewCount: 3821,
    pricing: 'Freemium',
    platforms: ['Web'],
    verified: true,
    featured: true,
    imageUrl: '/placeholder-runway.png',
    url: 'https://runwayml.com'
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Chatbots', icon: 'MessageSquare', toolCount: 1243 },
  { id: '2', name: 'Image Generation', icon: 'Image', toolCount: 892 },
  { id: '3', name: 'Writing', icon: 'FileText', toolCount: 1567 },
  { id: '4', name: 'Code Assistant', icon: 'Code', toolCount: 634 },
  { id: '5', name: 'Video', icon: 'Video', toolCount: 421 },
  { id: '6', name: 'Voice & Audio', icon: 'Mic', toolCount: 378 },
  { id: '7', name: 'Analytics', icon: 'BarChart', toolCount: 523 },
  { id: '8', name: 'Design', icon: 'Palette', toolCount: 789 },
];

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'OpenAI Announces GPT-5 Development',
    excerpt: 'The next generation of AI language models promises even more capabilities...',
    imageUrl: '/placeholder-news1.png',
    date: '2025-12-15',
    readTime: '5 min read',
    url: '#'
  },
  {
    id: '2',
    title: 'Google DeepMind Releases Gemini Ultra',
    excerpt: 'New multimodal AI model showcases impressive reasoning abilities...',
    imageUrl: '/placeholder-news2.png',
    date: '2025-12-14',
    readTime: '4 min read',
    url: '#'
  },
  {
    id: '3',
    title: 'AI Regulation: What You Need to Know',
    excerpt: 'Governments worldwide are implementing new frameworks for AI governance...',
    imageUrl: '/placeholder-news3.png',
    date: '2025-12-13',
    readTime: '6 min read',
    url: '#'
  }
];
