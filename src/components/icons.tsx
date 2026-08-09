/**
 * Icon facade — Lucide React.
 * Single import surface for the app (`@/components/icons`).
 * `*Solid` variants = same glyph with fill for active/selected states.
 */
import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Activity,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  AtSign,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardPaste,
  Clock,
  Copy,
  Download,
  Dumbbell,
  Eraser,
  Eye,
  FileText,
  Flame,
  Globe,
  Heart,
  ImagePlus,
  Info,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Palette,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Ruler,
  Save,
  Scale,
  Search,
  Send,
  Settings,
  Settings2,
  Share2,
  SkipForward,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Trophy,
  UserMinus,
  UserPlus,
  UserRound,
  Users,
  Vibrate,
  Weight,
  X,
} from "lucide-react";

export type IconProps = LucideProps;
export type AppIcon = LucideIcon;
export type { LucideIcon };

export {
  Activity,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  AtSign,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardPaste,
  Clock,
  Copy,
  Download,
  Dumbbell,
  Eraser,
  Eye,
  FileText,
  Flame,
  Globe,
  Heart,
  ImagePlus,
  Info,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Palette,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Ruler,
  Save,
  Scale,
  Search,
  Send,
  Settings,
  Settings2,
  Share2,
  SkipForward,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Trophy,
  UserMinus,
  UserPlus,
  UserRound,
  Users,
  Vibrate,
  Weight,
  X,
};

/** Filled glyph for active nav / liked / selected states. */
function solid(Icon: LucideIcon): LucideIcon {
  function SolidIcon({ className, ...props }: LucideProps) {
    return (
      <Icon
        className={className}
        fill="currentColor"
        strokeWidth={1.75}
        aria-hidden
        {...props}
      />
    );
  }
  SolidIcon.displayName = `${Icon.displayName ?? "Icon"}Solid`;
  return SolidIcon as LucideIcon;
}

export const ActivitySolid = solid(Activity);
export const BellSolid = solid(Bell);
export const BookOpenSolid = solid(BookOpen);
export const CalendarDaysSolid = solid(CalendarDays);
export const FlameSolid = solid(Flame);
export const HeartSolid = solid(Heart);
export const LayoutDashboardSolid = solid(LayoutDashboard);
export const SearchSolid = solid(Search);
export const SettingsSolid = solid(Settings);
export const TrophySolid = solid(Trophy);
export const UserRoundSolid = solid(UserRound);
export const UsersSolid = solid(Users);
