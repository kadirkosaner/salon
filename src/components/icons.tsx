/**
 * Icon facade: Heroicons 24 outline/solid.
 * Named to match former lucide-react imports so call sites stay readable.
 * Missing Heroicons glyphs are small local SVGs (dumbbell, weight, vibrate…).
 */
import type { ComponentType, SVGProps } from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowDownRightIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUpRightIcon,
  AtSymbolIcon,
  BellIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  CheckBadgeIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FireIcon,
  ForwardIcon,
  GlobeAltIcon,
  HeartIcon,
  KeyIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PaperAirplaneIcon,
  PauseIcon,
  PhotoIcon,
  PlayIcon,
  PlusIcon,
  ScaleIcon,
  ShareIcon,
  SparklesIcon,
  Squares2X2Icon,
  SwatchIcon,
  TrashIcon,
  TrophyIcon,
  UserIcon,
  UserMinusIcon,
  UserPlusIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellSolidIcon,
  CalendarDaysIcon as CalendarDaysSolidIcon,
  ChartBarIcon as ChartBarSolidIcon,
  FireIcon as FireSolidIcon,
  HeartIcon as HeartSolidIcon,
  MagnifyingGlassIcon as SearchSolidIcon,
  Squares2X2Icon as SquaresSolidIcon,
  TrophyIcon as TrophySolidIcon,
  UserIcon as UserSolidIcon,
  UsersIcon as UsersSolidIcon,
  Cog6ToothIcon as CogSolidIcon,
  BookOpenIcon as BookOpenSolidIcon,
} from "@heroicons/react/24/solid";

export type IconProps = SVGProps<SVGSVGElement> & { className?: string };
export type AppIcon = ComponentType<IconProps>;
export type LucideIcon = AppIcon;

function DumbbellIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 9.5v5M17.5 9.5v5M4 10.5v3M20 10.5v3M6.5 12h11M8.5 8v8M15.5 8v8" />
    </svg>
  );
}

function WeightIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    </svg>
  );
}

function VibrateIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5h6A1.5 1.5 0 0 1 16.5 6v12a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 18V6A1.5 1.5 0 0 1 9 4.5Z" />
      <path strokeLinecap="round" d="M4 9v6M2.5 10.5v3M20 9v6M21.5 10.5v3" />
    </svg>
  );
}

function EraserIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m7 14 5-5 5 5-3.5 3.5H10.5L7 14Z" />
      <path strokeLinecap="round" d="M5 19.5h14" />
    </svg>
  );
}

function RulerIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.5 15.5 4.5l4 4L8.5 19.5h-4v-4Z" />
      <path strokeLinecap="round" d="m8 12 1.5 1.5M10.5 9.5 12 11M13 7l1.5 1.5" />
    </svg>
  );
}

function SaveIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5h9.5L19.5 8.5V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V6A1.5 1.5 0 0 1 6 4.5Z" />
      <path strokeLinecap="round" d="M8 4.5v4h7v-4M8 19.5v-5h8v5" />
    </svg>
  );
}

export const Activity = ChartBarIcon;
export const ActivitySolid = ChartBarSolidIcon;
export const ArrowDownRight = ArrowDownRightIcon;
export const ArrowLeftRight = ArrowsRightLeftIcon;
export const ArrowUpRight = ArrowUpRightIcon;
export const AtSign = AtSymbolIcon;
export const Bell = BellIcon;
export const BellSolid = BellSolidIcon;
export const BookOpen = BookOpenIcon;
export const BookOpenSolid = BookOpenSolidIcon;
export const CalendarDays = CalendarDaysIcon;
export const CalendarDaysSolid = CalendarDaysSolidIcon;
export const CalendarRange = CalendarIcon;
export const Check = CheckIcon;
export const CheckCheck = CheckBadgeIcon;
export const ChevronDown = ChevronDownIcon;
export const ChevronLeft = ChevronLeftIcon;
export const ChevronRight = ChevronRightIcon;
export const ChevronUp = ChevronUpIcon;
export const ClipboardPaste = ClipboardDocumentIcon;
export const Clock = ClockIcon;
export const Copy = DocumentDuplicateIcon;
export const Download = ArrowDownTrayIcon;
export const Dumbbell = DumbbellIcon;
export const Eraser = EraserIcon;
export const Eye = EyeIcon;
export const FileText = DocumentTextIcon;
export const Flame = FireIcon;
export const FlameSolid = FireSolidIcon;
export const Globe = GlobeAltIcon;
export const Heart = HeartIcon;
export const HeartSolid = HeartSolidIcon;
export const ImagePlus = PhotoIcon;
export const KeyRound = KeyIcon;
export const LayoutDashboard = Squares2X2Icon;
export const LayoutDashboardSolid = SquaresSolidIcon;
export const Lock = LockClosedIcon;
export const LogOut = ArrowRightOnRectangleIcon;
export const MessageCircle = ChatBubbleLeftIcon;
export const Minus = MinusIcon;
export const MoreHorizontal = EllipsisHorizontalIcon;
export const Palette = SwatchIcon;
export const Pause = PauseIcon;
export const Play = PlayIcon;
export const Plus = PlusIcon;
export const RefreshCw = ArrowPathIcon;
export const Ruler = RulerIcon;
export const Save = SaveIcon;
export const Scale = ScaleIcon;
export const Search = MagnifyingGlassIcon;
export const SearchSolid = SearchSolidIcon;
export const Send = PaperAirplaneIcon;
export const Settings = Cog6ToothIcon;
export const SettingsSolid = CogSolidIcon;
export const Settings2 = AdjustmentsHorizontalIcon;
export const Share2 = ShareIcon;
export const SkipForward = ForwardIcon;
export const Sparkles = SparklesIcon;
export const Trash2 = TrashIcon;
export const TrendingDown = ArrowTrendingDownIcon;
export const TrendingUp = ArrowTrendingUpIcon;
export const TriangleAlert = ExclamationTriangleIcon;
export const Trophy = TrophyIcon;
export const TrophySolid = TrophySolidIcon;
export const UserMinus = UserMinusIcon;
export const UserPlus = UserPlusIcon;
export const UserRound = UserIcon;
export const UserRoundSolid = UserSolidIcon;
export const Users = UsersIcon;
export const UsersSolid = UsersSolidIcon;
export const Vibrate = VibrateIcon;
export const Weight = WeightIcon;
export const X = XMarkIcon;
