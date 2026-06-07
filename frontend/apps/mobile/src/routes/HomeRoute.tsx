import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button, InputBox, cn } from "@umc/ui";

import {
  getCourses,
  getLocations,
  getMajors,
  getTradePosts,
  getUsers,
  searchNearbyTradePosts,
} from "../api/swebook";
import type {
  Category,
  LocationPreset,
  NearbyPostItem,
  SeedUser,
  TradePostListItem,
  TradePostStatus,
} from "../api/types";
import { BookCover } from "../components/BookCover";
import { BottomNav, type BottomTab } from "../components/BottomNav";
import { CreatePostSheet } from "../components/CreatePostSheet";
import { LocationSheet } from "../components/LocationSheet";
import { LoginModal } from "../components/LoginModal";
import { StatusBadge } from "../components/StatusBadge";
import { useSession } from "../hooks/useSession";
import { distanceMeter, formatDistance, formatPrice } from "../utils/format";

type FeedItem = {
  postId: number;
  title: string;
  categoryName: string;
  sellerName: string;
  price: number;
  status: TradePostStatus;
  distanceMeter?: number;
  coverImageUrl?: string | null;
  placeName?: string;
  createdAt?: string;
};

function mapListPost(post: TradePostListItem, location: LocationPreset): FeedItem {
  return {
    postId: post.postId,
    title: post.bookTitle,
    categoryName: post.categoryName,
    sellerName: post.sellerNickname,
    price: post.price,
    status: post.status,
    distanceMeter: distanceMeter(location, {
      latitude: Number(post.latitude),
      longitude: Number(post.longitude),
    }),
    placeName: post.placeName,
    createdAt: post.createdAt,
  };
}

function mapNearbyPost(post: NearbyPostItem): FeedItem {
  return {
    postId: post.postId,
    title: post.bookName,
    categoryName: post.categoryName,
    sellerName: post.seller.sellerName,
    price: post.price,
    status: post.status,
    distanceMeter: post.distanceMeter,
    coverImageUrl: post.coverImageUrl,
  };
}

export function HomeRoute() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });
  const { session, login, logout } = useSession();
  const [locations, setLocations] = useState<LocationPreset[]>([]);
  const [location, setLocation] = useState<LocationPreset | null>(null);
  const [courses, setCourses] = useState<Category[]>([]);
  const [users, setUsers] = useState<SeedUser[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [activeTab, setActiveTab] = useState<BottomTab>(search.tab ?? "home");
  const [locationOpen, setLocationOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (search.tab && search.tab !== "chat") {
      setActiveTab(search.tab);
    }
  }, [search.tab]);

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      const [nextLocations, nextMajors, nextUsers] = await Promise.all([
        getLocations(),
        getMajors(),
        getUsers(),
      ]);
      const defaultMajorCode = nextMajors[0]?.categoryCode;
      const nextCourses = defaultMajorCode ? await getCourses(defaultMajorCode) : [];

      if (ignore) return;

      setLocations(nextLocations);
      setLocation((currentLocation) => currentLocation ?? nextLocations[0] ?? null);
      setCourses(nextCourses);
      setUsers(nextUsers);
    }

    loadInitialData()
      .catch((loadError) => {
        if (ignore) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "초기 데이터를 불러오지 못했습니다.",
        );
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const loadPosts = useCallback(async () => {
    if (!location) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (selectedCourseCode === "all") {
        const posts = await getTradePosts();
        setItems(
          posts
            .map((post) => mapListPost(post, location))
            .sort((a, b) => (a.distanceMeter ?? 0) - (b.distanceMeter ?? 0)),
        );
      } else {
        const searchParams = {
          latitude: location.latitude,
          longitude: location.longitude,
          categoryCode: selectedCourseCode,
          size: 30,
        };
        const nearby = await searchNearbyTradePosts(
          query.trim() ? { ...searchParams, bookTitle: query.trim() } : searchParams,
        );
        setItems(nearby.posts.map(mapNearbyPost));
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "매물 목록을 불러오지 못했습니다.",
      );
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [location, query, selectedCourseCode]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts, reloadKey]);

  const selectedCourse = courses.find((course) => course.categoryCode === selectedCourseCode);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items.filter((item) =>
      [item.title, item.categoryName, item.sellerName, item.placeName]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery)),
    );
  }, [items, query]);

  const openCreateFlow = () => {
    if (!session) {
      setLoginOpen(true);
      return;
    }
    if (!location) {
      setError("동네 정보를 불러오지 못해 판매글을 등록할 수 없습니다. 백엔드 DB 연결 상태를 확인한 뒤 새로고침해 주세요.");
      return;
    }
    if (courses.length === 0) {
      setError("과목 정보를 불러오지 못해 판매글을 등록할 수 없습니다. 백엔드 응답을 확인한 뒤 다시 시도해 주세요.");
      return;
    }
    setCreateOpen(true);
  };

  const handleBottomTabChange = (tab: BottomTab) => {
    if (tab === "chat") {
      void navigate({ to: "/my/trades", search: { tab: "requests" } });
      return;
    }

    setActiveTab(tab);
    void navigate({
      to: "/",
      search: tab === "home" ? {} : { tab },
      replace: true,
    });
  };

  return (
    <main className="mx-auto flex h-dvh max-w-[430px] flex-col bg-white text-teal-gray-900 shadow-drop-neutral-1">
      <header className="sticky top-0 z-20 border-b border-teal-gray-100 bg-white/95 px-5 pt-4 pb-4 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            className="flex min-w-0 items-center gap-1 rounded-[10px] py-2 pr-2 text-heading-7-semibold text-teal-gray-900"
          >
            <span className="truncate">{location?.label ?? "동네 선택"}</span>
            <ChevronDown className="h-5 w-5 text-teal-gray-500" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-1">
            {session ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-teal-50 px-3 py-1.5 text-caption-1-medium text-teal-700"
              >
                {session.nickname}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="rounded-full bg-teal-gray-100 px-3 py-1.5 text-caption-1-medium text-teal-gray-700"
              >
                로그인
              </button>
            )}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-teal-gray-600 hover:bg-teal-gray-50"
              aria-label="알림"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {activeTab === "home" && (
          <InputBox
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            type="clear"
            placeholder="전공서적 검색"
            className="h-11 w-full rounded-[14px]"
            rightAdornment={<Search className="h-4 w-4 text-teal-gray-400" />}
          />
        )}
      </header>

      {activeTab === "home" && (
        <section className="border-b border-teal-gray-100 bg-white px-5 py-3">
          <div className="mobile-scrollbar flex gap-2 overflow-x-auto">
            <CourseChip
              label="전체"
              active={selectedCourseCode === "all"}
              onClick={() => setSelectedCourseCode("all")}
            />
            {courses.slice(0, 10).map((course) => (
              <CourseChip
                key={course.categoryCode}
                label={course.name}
                active={selectedCourseCode === course.categoryCode}
                onClick={() => setSelectedCourseCode(course.categoryCode)}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === "home" ? (
        <section className="mobile-scrollbar flex-1 overflow-y-auto pb-24">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h1 className="m-0 text-heading-7-semibold text-teal-gray-900">
                {selectedCourse ? `${selectedCourse.name} 교재` : "근처 전공서적"}
              </h1>
              <p className="m-0 mt-0.5 text-caption-1-medium text-teal-gray-500">
                {location ? `${location.label} 기준 가까운 순서` : "서버에서 동네 목록을 불러오는 중"}
              </p>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-gray-50 text-teal-gray-600"
              aria-label="필터"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {isLoading && (
            <div className="space-y-3 px-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex animate-pulse gap-3 border-b border-teal-gray-100 py-3">
                  <div className="h-24 w-18 rounded-[10px] bg-teal-gray-100" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 w-4/5 rounded bg-teal-gray-100" />
                    <div className="h-3 w-2/3 rounded bg-teal-gray-100" />
                    <div className="h-4 w-1/3 rounded bg-teal-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="mx-5 rounded-[16px] bg-error-50 px-4 py-4 text-body-2-medium text-error-600">
              {error}
            </div>
          )}

          {!isLoading && !error && filteredItems.length === 0 && (
            <div className="mx-5 rounded-[18px] border border-teal-gray-150 bg-teal-gray-50 px-5 py-10 text-center">
              <MapPin className="mx-auto h-7 w-7 text-teal-gray-400" aria-hidden="true" />
              <p className="m-0 mt-3 text-label-1-semibold text-teal-gray-800">
                조건에 맞는 매물이 없습니다.
              </p>
              <p className="m-0 mt-1 text-body-2-regular text-teal-gray-500">
                다른 과목이나 동네로 다시 찾아보세요.
              </p>
            </div>
          )}

          {!isLoading && !error && filteredItems.length > 0 && (
            <div className="px-5">
              {filteredItems.map((item) => (
                <Link
                  key={item.postId}
                  to="/posts/$postId"
                  params={{ postId: String(item.postId) }}
                  className="flex gap-3 border-b border-teal-gray-100 py-3.5 text-left no-underline"
                >
                  <BookCover src={item.coverImageUrl} title={item.title} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="m-0 line-clamp-2 text-label-1-semibold text-teal-gray-900">
                        {item.title}
                      </h2>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="m-0 mt-1 line-clamp-1 text-caption-1-medium text-teal-gray-500">
                      {item.categoryName} · {item.sellerName} · {formatDistance(item.distanceMeter)}
                    </p>
                    {item.placeName && (
                      <p className="m-0 mt-0.5 line-clamp-1 text-caption-2-regular text-teal-gray-400">
                        {item.placeName}
                      </p>
                    )}
                    <p className="m-0 mt-2 text-label-1-semibold text-teal-gray-900">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <TabPanel
          activeTab={activeTab}
          isLoggedIn={Boolean(session)}
          nickname={session?.nickname}
          onLoginClick={() => setLoginOpen(true)}
          onHomeClick={() => setActiveTab("home")}
          onTradesClick={(tab) => {
            void navigate({ to: "/my/trades", search: { tab } });
          }}
          onLogout={logout}
        />
      )}

      {activeTab === "home" && (
        <div className="pointer-events-none fixed right-0 bottom-24 left-0 z-30 mx-auto max-w-[430px] px-5">
          <div className="flex justify-end">
            <Button
              size="m"
              icon
              className="pointer-events-auto rounded-full shadow-drop-primary-1"
              onClick={openCreateFlow}
            >
              판매
            </Button>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} onTabChange={handleBottomTabChange} />

      <LocationSheet
        open={locationOpen}
        locations={locations}
        selected={location}
        onSelect={setLocation}
        onOpenChange={setLocationOpen}
      />
      <LoginModal
        open={loginOpen}
        users={users}
        onOpenChange={setLoginOpen}
        onLogin={login}
      />
      {session && location && (
        <CreatePostSheet
          open={createOpen}
          courses={courses}
          location={location}
          session={session}
          onCreated={() => setReloadKey((key) => key + 1)}
          onOpenChange={setCreateOpen}
        />
      )}
    </main>
  );
}

function TabPanel({
  activeTab,
  isLoggedIn,
  nickname,
  onLoginClick,
  onHomeClick,
  onTradesClick,
  onLogout,
}: {
  activeTab: Exclude<BottomTab, "home">;
  isLoggedIn: boolean;
  nickname?: string;
  onLoginClick: () => void;
  onHomeClick: () => void;
  onTradesClick: (tab: "requests" | "sales" | "received") => void;
  onLogout: () => void;
}) {
  if (activeTab === "my") {
    return (
      <section className="flex-1 overflow-y-auto px-5 py-5 pb-24">
        <h1 className="m-0 text-heading-7-semibold text-teal-gray-900">내 정보</h1>
        <div className="mt-4 rounded-[18px] border border-teal-gray-150 bg-teal-gray-50 px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-600">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="m-0 text-label-1-semibold text-teal-gray-900">
                {isLoggedIn ? `${nickname}님` : "로그인이 필요합니다"}
              </p>
              <p className="m-0 mt-1 text-caption-1-medium text-teal-gray-500">
                과제용 시드 계정으로 거래 흐름을 확인합니다.
              </p>
            </div>
          </div>
          <Button
            size="m"
            color={isLoggedIn ? "neutral" : "primary"}
            variant={isLoggedIn ? "weak" : "fill"}
            className="mt-4 w-full"
            onClick={isLoggedIn ? onLogout : onLoginClick}
          >
            {isLoggedIn ? "로그아웃" : "로그인"}
          </Button>
          {isLoggedIn && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                size="m"
                variant="weak"
                className="w-full"
                onClick={() => onTradesClick("requests")}
              >
                구매 요청
              </Button>
              <Button
                size="m"
                variant="weak"
                className="w-full"
                onClick={() => onTradesClick("sales")}
              >
                판매 목록
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  const tabCopy = {
    favorites: {
      icon: Heart,
      title: "관심목록이 비어 있습니다.",
      description: "마음에 드는 전공서적을 발견하면 관심목록에서 다시 확인할 수 있습니다.",
      button: "매물 둘러보기",
    },
    chat: {
      icon: MessageCircle,
      title: "요청내역으로 이동합니다.",
      description: "보낸 구매 요청과 내 판매글에 들어온 요청을 확인할 수 있습니다.",
      button: "요청내역 보기",
    },
  }[activeTab];
  const Icon = tabCopy.icon;

  return (
    <section className="flex flex-1 items-center justify-center px-5 pb-24">
      <div className="w-full rounded-[20px] border border-teal-gray-150 bg-teal-gray-50 px-6 py-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-600">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="m-0 mt-5 text-heading-7-semibold text-teal-gray-900">
          {tabCopy.title}
        </h1>
        <p className="m-0 mt-2 text-body-2-regular text-teal-gray-500">
          {tabCopy.description}
        </p>
        <Button
          size="m"
          variant="weak"
          className="mt-5"
          onClick={activeTab === "chat" ? () => onTradesClick("requests") : onHomeClick}
        >
          {tabCopy.button}
        </Button>
      </div>
    </section>
  );
}

function CourseChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full border px-3 text-label-2-medium transition",
        active
          ? "border-teal-500 bg-teal-500 text-white"
          : "border-teal-gray-200 bg-white text-teal-gray-700 hover:bg-teal-gray-50",
      )}
    >
      {label}
    </button>
  );
}
