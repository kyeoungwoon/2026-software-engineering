import { Home, MessageCircle, User, Heart } from "lucide-react";

import { cn } from "@umc/ui";

export type BottomTab = "home" | "favorites" | "chat" | "my";

const items = [
  { id: "home", label: "홈", icon: Home },
  { id: "favorites", label: "관심목록", icon: Heart },
  { id: "chat", label: "요청내역", icon: MessageCircle },
  { id: "my", label: "내 정보", icon: User },
] satisfies Array<{
  id: BottomTab;
  label: string;
  icon: typeof Home;
}>;

type BottomNavProps = {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="grid min-h-[76px] grid-cols-4 border-t border-teal-gray-150 bg-white px-3 pt-2 pb-[calc(10px+env(safe-area-inset-bottom))]">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex min-w-0 flex-col items-center justify-center gap-1 rounded-[12px] px-1 text-[11px] leading-[1.25] font-medium transition",
              active
                ? "text-ds-primary"
                : "text-teal-gray-400 hover:text-teal-gray-700",
            )}
          >
            <Icon className="h-[21px] w-[21px]" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
