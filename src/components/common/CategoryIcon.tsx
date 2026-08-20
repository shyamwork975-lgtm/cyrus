import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  GraduationCap,
  HeartPulse,
  CreditCard,
  Sparkles,
  Tag,
  Sun,
  Briefcase,
  Plane,
  CheckSquare,
  Coffee,
  Smartphone,
  Home,
  Zap,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  const iconMap: Record<string, React.ReactElement> = {
    Utensils: <Utensils size={size} className={className} />,
    Car: <Car size={size} className={className} />,
    ShoppingBag: <ShoppingBag size={size} className={className} />,
    Receipt: <Receipt size={size} className={className} />,
    Film: <Film size={size} className={className} />,
    GraduationCap: <GraduationCap size={size} className={className} />,
    HeartPulse: <HeartPulse size={size} className={className} />,
    CreditCard: <CreditCard size={size} className={className} />,
    Sparkles: <Sparkles size={size} className={className} />,
    Tag: <Tag size={size} className={className} />,
    Sun: <Sun size={size} className={className} />,
    Briefcase: <Briefcase size={size} className={className} />,
    Plane: <Plane size={size} className={className} />,
    CheckSquare: <CheckSquare size={size} className={className} />,
    Coffee: <Coffee size={size} className={className} />,
    Smartphone: <Smartphone size={size} className={className} />,
    Home: <Home size={size} className={className} />,
    Zap: <Zap size={size} className={className} />,
  };

  // Check lowercase or direct matches
  const match = iconMap[name] || iconMap[Object.keys(iconMap).find(k => k.toLowerCase() === name.toLowerCase()) || ''];

  if (match) return match;
  return <Tag size={size} className={className} />;
};

export const getCategoryColorClasses = (colorName: string = 'emerald'): { bg: string; text: string; border: string; lightBg: string } => {
  switch (colorName) {
    case 'emerald':
      return { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', lightBg: 'bg-emerald-50 dark:bg-emerald-950/40' };
    case 'blue':
      return { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', lightBg: 'bg-blue-50 dark:bg-blue-950/40' };
    case 'purple':
      return { bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', lightBg: 'bg-purple-50 dark:bg-purple-950/40' };
    case 'amber':
      return { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', lightBg: 'bg-amber-50 dark:bg-amber-950/40' };
    case 'rose':
      return { bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', lightBg: 'bg-rose-50 dark:bg-rose-950/40' };
    case 'indigo':
      return { bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', lightBg: 'bg-indigo-50 dark:bg-indigo-950/40' };
    case 'teal':
      return { bg: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', lightBg: 'bg-teal-50 dark:bg-teal-950/40' };
    case 'cyan':
      return { bg: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', lightBg: 'bg-cyan-50 dark:bg-cyan-950/40' };
    default:
      return { bg: 'bg-stone-500', text: 'text-stone-600 dark:text-stone-400', border: 'border-stone-200 dark:border-stone-800', lightBg: 'bg-stone-100 dark:bg-stone-900' };
  }
};
