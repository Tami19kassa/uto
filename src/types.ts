export interface Riddle {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  amharicWord?: string; // The original enqoqlsh context
  difficulty: "Easy" | "Medium" | "Hard";
  prizeValue: number; // Virtual ETB / coins
}

export interface HighScore {
  name: string;
  score: number;
  difficulty: string;
  date: string;
  ticketId: string;
}

export interface CookiePreferences {
  accepted: boolean;
  essential: boolean;
  functional: boolean;
  marketing: boolean;
}

export interface MediaItem {
  id: string;
  type: "blog" | "vlog";
  title: string;
  author: string;
  date: string;
  duration: string; // "6 min read" or "14 min watch"
  category: string;
  excerpt: string;
  content: string;
  videoUrl?: string; // YouTube embed link or video source URL
  likes: number;
  tags: string[];
  gradientTheme: string; // CSS gradient class
}

export interface SocialAccount {
  id: string;
  platform: "Youtube" | "Telegram" | "Facebook" | "Twitter" | "Instagram" | "LinkedIn" | "TikTok";
  label: string; // Display label
  url: string; // Link URL
  isActive: boolean;
}

export interface AdminSettings {
  heroVideoUrl: string;
  adminPasswordHash: string; // Standard check password (default "admin123")
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}
