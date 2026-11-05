export interface Category {
  id: string;
  name: string;
  shortDesc: string;
  image: string;
  badge?: string;
  itemCount: number;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'softies' | 'sundaes' | 'jelly' | 'dips' | 'combos';
  categoryLabel: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  isBestSeller?: boolean;
  caloriesNote?: string;
  badge?: string;
}

export interface ComboItem {
  id: string;
  name: string;
  subtitle: string;
  itemsIncluded: string[];
  price: number;
  originalPrice?: number;
  savings: number;
  image: string;
  tag: string;
  featured?: boolean;
}

export interface DailyFlavour {
  day: number;
  dayLabel: string;
  name: string;
  tamilName?: string;
  tagline: string;
  description: string;
  cardImage: string;
  cupImage: string;
  accentBg: string;
  accentColor: string;
  badgeColor: string;
  isToday?: boolean;
  availableDate?: string;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  timeAgo: string;
  rating: number;
  text: string;
  source: 'google';
  avatarLetter: string;
  avatarBg: string;
  isVerified: boolean;
}

export interface MascotExpression {
  id: string;
  label: string;
  caption: string;
  image: string;
  quote: string;
  tag: string;
}

export interface FranchiseFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  enquiryType: 'franchise' | 'kiosk' | 'event' | 'distribution';
  investmentRange?: string;
  message?: string;
}
