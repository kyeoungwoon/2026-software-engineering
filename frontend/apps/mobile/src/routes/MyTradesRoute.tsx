import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Inbox,
  MessageCircle,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button, cn } from "@umc/ui";

import {
  acceptTradeRequest,
  getMySales,
  getMyTradeRequests,
  getSalesRequests,
  getUsers,
  rejectTradeRequest,
} from "../api/swebook";
import type {
  MeTradeRequest,
  SeedUser,
  TradePostListItem,
  TradeRequestStatus,
} from "../api/types";
import { BottomNav, type BottomTab } from "../components/BottomNav";
import { LoginModal } from "../components/LoginModal";
import { StatusBadge } from "../components/StatusBadge";
import { useSession } from "../hooks/useSession";
import { formatDateTime, formatPrice } from "../utils/format";

type TradeView = "requests" | "sales" | "received";

const viewCopy = {
  requests: "구매 요청",
  sales: "판매 목록",
  received: "받은 요청",
} satisfies Record<TradeView, string>;

const requestStatusLabel = {
  PENDING: "대기중",
  ACCEPTED: "수락됨",
  REJECTED: "거절됨",
} satisfies Record<TradeRequestStatus, string>;

const requestStatusClass = {
  PENDING: "border-warning-200 bg-warning-50 text-warning-700",
  ACCEPTED: "border-teal-200 bg-teal-50 text-teal-700",
  REJECTED: "border-teal-gray-200 bg-teal-gray-100 text-teal-gray-500",
} satisfies Record<TradeRequestStatus, string>;

export function MyTradesRoute() {
  const search = useSearch({ from: "/my/trades" });
  const navigate = useNavigate();
  const { session, login } = useSession();
  const [activeView, setActiveView] = useState<TradeView>(search.tab ?? "requests");
  const [users, setUsers] = useState<SeedUser[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [myRequests, setMyRequests] = useState<MeTradeRequest[]>([]);
  const [mySales, setMySales] = useState<TradePostListItem[]>([]);
  const [salesRequests, setSalesRequests] = useState<MeTradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actingRequestId, setActingRequestId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setActiveView(search.tab ?? "requests");
  }, [search.tab]);

  useEffect(() => {
    if (!loginOpen || users.length > 0) return;

    getUsers()
      .then(setUsers)
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "사용자 목록을 불러오지 못했습니다.",
        );
      });
  }, [loginOpen, users.length]);

  const loadTrades = useCallback(async () => {
    if (!session) return;

    setIsLoading(true);
    setError("");
    try {
      const [nextMyRequests, nextMySales, nextSalesRequests] = await Promise.all([
        getMyTradeRequests(session.userId),
        getMySales(session.userId),
        getSalesRequests(session.userId),
      ]);
      setMyRequests(nextMyRequests);
      setMySales(nextMySales);
      setSalesRequests(nextSalesRequests);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "거래 내역을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void loadTrades();
  }, [loadTrades]);

  const requestCountByPostId = useMemo(() => {
    return salesRequests.reduce<Record<number, number>>((accumulator, request) => {
      accumulator[request.postId] = (accumulator[request.postId] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [salesRequests]);

  const pendingCountByPostId = useMemo(() => {
    return salesRequests.reduce<Record<number, number>>((accumulator, request) => {
      if (request.status === "PENDING") {
        accumulator[request.postId] = (accumulator[request.postId] ?? 0) + 1;
      }
      return accumulator;
    }, {});
  }, [salesRequests]);

  const setTradeView = (nextView: TradeView) => {
    setActiveView(nextView);
    void navigate({
      to: "/my/trades",
      search: { tab: nextView },
      replace: true,
    });
  };

  const handleBottomTabChange = (tab: BottomTab) => {
    if (tab === "chat") {
      setTradeView("requests");
      return;
    }

    void navigate({
      to: "/",
      search: tab === "home" ? {} : { tab },
    });
  };

  const handleRequestAction = async (
    requestId: number,
    action: "accept" | "reject",
  ) => {
    setActingRequestId(requestId);
    setMessage("");
    setError("");
    try {
      if (action === "accept") {
        await acceptTradeRequest(requestId);
        setMessage("구매 요청을 수락했습니다. 해당 판매글은 예약중으로 변경됩니다.");
      } else {
        await rejectTradeRequest(requestId);
        setMessage("구매 요청을 거절했습니다.");
      }
      await loadTrades();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "요청 처리에 실패했습니다.",
      );
    } finally {
      setActingRequestId(null);
    }
  };

  return (
    <main className="mx-auto flex h-dvh max-w-[430px] flex-col bg-white text-teal-gray-900 shadow-drop-neutral-1">
      <header className="sticky top-0 z-20 border-b border-teal-gray-100 bg-white/95 px-5 pt-3 pb-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex h-10 w-10 items-center justify-center rounded-full text-teal-gray-700 hover:bg-teal-gray-50"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="m-0 text-heading-7-semibold text-teal-gray-900">
              거래 내역
            </h1>
            <p className="m-0 mt-0.5 text-caption-1-medium text-teal-gray-500">
              구매 요청과 판매 요청을 한 곳에서 관리합니다.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 rounded-[14px] bg-teal-gray-100 p-1">
          {(Object.keys(viewCopy) as TradeView[]).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setTradeView(view)}
              className={cn(
                "h-9 rounded-[11px] text-caption-1-medium transition",
                activeView === view
                  ? "bg-white text-teal-700 shadow-drop-neutral-1"
                  : "text-teal-gray-500",
              )}
            >
              {viewCopy[view]}
            </button>
          ))}
        </div>
      </header>

      {!session ? (
        <section className="flex flex-1 items-center justify-center px-5 pb-24">
          <div className="w-full rounded-[18px] border border-teal-gray-150 bg-teal-gray-50 px-5 py-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-600">
              <UserRound className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="m-0 mt-4 text-heading-7-semibold text-teal-gray-900">
              로그인이 필요합니다
            </h2>
            <p className="m-0 mt-2 text-body-2-regular text-teal-gray-500">
              과제용 시드 사용자로 로그인하면 내 거래 내역을 확인할 수 있습니다.
            </p>
            <Button size="m" className="mt-5 w-full" onClick={() => setLoginOpen(true)}>
              로그인
            </Button>
          </div>
        </section>
      ) : (
        <section className="mobile-scrollbar flex-1 overflow-y-auto px-5 py-4 pb-28">
          {message && (
            <p className="m-0 mb-3 rounded-[14px] bg-teal-50 px-4 py-3 text-body-2-medium text-teal-800">
              {message}
            </p>
          )}

          {error && (
            <p className="m-0 mb-3 rounded-[14px] bg-error-50 px-4 py-3 text-body-2-medium text-error-600">
              {error}
            </p>
          )}

          {isLoading && <LoadingList />}

          {!isLoading && activeView === "requests" && (
            <RequestList
              emptyTitle="보낸 구매 요청이 없습니다."
              emptyDescription="상세 화면에서 구매 요청을 보내면 이곳에 표시됩니다."
              requests={myRequests}
              perspective="buyer"
            />
          )}

          {!isLoading && activeView === "sales" && (
            <SalesList
              sales={mySales}
              requestCountByPostId={requestCountByPostId}
              pendingCountByPostId={pendingCountByPostId}
              onOpenRequests={() => setTradeView("received")}
            />
          )}

          {!isLoading && activeView === "received" && (
            <ReceivedRequestList
              requests={salesRequests}
              actingRequestId={actingRequestId}
              onAccept={(requestId) => handleRequestAction(requestId, "accept")}
              onReject={(requestId) => handleRequestAction(requestId, "reject")}
            />
          )}
        </section>
      )}

      <BottomNav activeTab="chat" onTabChange={handleBottomTabChange} />

      <LoginModal
        open={loginOpen}
        users={users}
        onOpenChange={setLoginOpen}
        onLogin={login}
      />
    </main>
  );
}

function LoadingList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[16px] border border-teal-gray-100 px-4 py-4"
        >
          <div className="h-4 w-3/4 rounded bg-teal-gray-100" />
          <div className="mt-3 h-3 w-1/2 rounded bg-teal-gray-100" />
          <div className="mt-4 h-9 rounded bg-teal-gray-100" />
        </div>
      ))}
    </div>
  );
}

function RequestList({
  emptyTitle,
  emptyDescription,
  requests,
  perspective,
}: {
  emptyTitle: string;
  emptyDescription: string;
  requests: MeTradeRequest[];
  perspective: "buyer" | "seller";
}) {
  if (requests.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestCard key={request.requestId} request={request} perspective={perspective} />
      ))}
    </div>
  );
}

function ReceivedRequestList({
  requests,
  actingRequestId,
  onAccept,
  onReject,
}: {
  requests: MeTradeRequest[];
  actingRequestId: number | null;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}) {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="받은 구매 요청이 없습니다."
        description="내 판매글에 구매 요청이 들어오면 이곳에서 수락하거나 거절할 수 있습니다."
      />
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const isPending = request.status === "PENDING";
        const isActing = actingRequestId === request.requestId;

        return (
          <div
            key={request.requestId}
            className="rounded-[16px] border border-teal-gray-150 bg-white px-4 py-4"
          >
            <RequestCardHeader request={request} perspective="seller" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                size="m"
                variant="weak"
                disabled={!isPending || isActing}
                isLoading={isActing}
                onClick={() => onReject(request.requestId)}
                className="w-full"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                거절
              </Button>
              <Button
                size="m"
                disabled={!isPending || isActing}
                isLoading={isActing}
                onClick={() => onAccept(request.requestId)}
                className="w-full"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                수락
              </Button>
            </div>
            {!isPending && (
              <p className="m-0 mt-3 text-center text-caption-2-regular text-teal-gray-500">
                이미 {requestStatusLabel[request.status]} 처리된 요청입니다.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SalesList({
  sales,
  requestCountByPostId,
  pendingCountByPostId,
  onOpenRequests,
}: {
  sales: TradePostListItem[];
  requestCountByPostId: Record<number, number>;
  pendingCountByPostId: Record<number, number>;
  onOpenRequests: () => void;
}) {
  if (sales.length === 0) {
    return (
      <EmptyState
        title="등록한 판매글이 없습니다."
        description="홈에서 판매글을 등록하면 내 판매 목록에 표시됩니다."
      />
    );
  }

  return (
    <div className="space-y-3">
      {sales.map((post) => {
        const requestCount = requestCountByPostId[post.postId] ?? 0;
        const pendingCount = pendingCountByPostId[post.postId] ?? 0;

        return (
          <article
            key={post.postId}
            className="rounded-[16px] border border-teal-gray-150 bg-white px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="m-0 line-clamp-2 text-label-1-semibold text-teal-gray-900">
                  {post.bookTitle}
                </h2>
                <p className="m-0 mt-1 text-caption-1-medium text-teal-gray-500">
                  {post.categoryName} · {post.placeName}
                </p>
              </div>
              <StatusBadge status={post.status} />
            </div>
            <p className="m-0 mt-3 text-label-1-semibold text-teal-gray-900">
              {formatPrice(post.price)}
            </p>
            <div className="mt-4 flex items-center justify-between rounded-[14px] bg-teal-gray-50 px-3 py-3">
              <div>
                <p className="m-0 text-label-2-medium text-teal-gray-800">
                  구매 요청 {requestCount}건
                </p>
                <p className="m-0 mt-0.5 text-caption-2-regular text-teal-gray-500">
                  대기중 {pendingCount}건
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenRequests}
                className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-caption-1-medium text-teal-700"
              >
                요청 보기
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <Link
              to="/posts/$postId"
              params={{ postId: String(post.postId) }}
              className="mt-3 flex items-center justify-center rounded-[12px] border border-teal-gray-150 px-3 py-2 text-caption-1-medium text-teal-gray-700 no-underline"
            >
              판매글 상세 보기
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function RequestCard({
  request,
  perspective,
}: {
  request: MeTradeRequest;
  perspective: "buyer" | "seller";
}) {
  return (
    <article className="rounded-[16px] border border-teal-gray-150 bg-white px-4 py-4">
      <RequestCardHeader request={request} perspective={perspective} />
      <Link
        to="/posts/$postId"
        params={{ postId: String(request.postId) }}
        className="mt-4 flex items-center justify-center rounded-[12px] border border-teal-gray-150 px-3 py-2 text-caption-1-medium text-teal-gray-700 no-underline"
      >
        판매글 상세 보기
      </Link>
    </article>
  );
}

function RequestCardHeader({
  request,
  perspective,
}: {
  request: MeTradeRequest;
  perspective: "buyer" | "seller";
}) {
  const partyLabel = perspective === "buyer" ? "판매자" : "구매자";
  const partyName = perspective === "buyer"
    ? request.sellerNickname
    : request.buyerNickname;

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="m-0 line-clamp-2 text-label-1-semibold text-teal-gray-900">
            {request.bookTitle}
          </h2>
          <p className="m-0 mt-1 text-caption-1-medium text-teal-gray-500">
            {partyLabel} {partyName}
          </p>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>
      <div className="mt-4 grid gap-2 text-caption-1-medium text-teal-gray-600">
        <span className="inline-flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-teal-600" aria-hidden="true" />
          요청 #{request.requestId}
        </span>
        <span className="inline-flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-teal-600" aria-hidden="true" />
          {formatDateTime(request.startAt)} - {formatDateTime(request.endAt)}
        </span>
      </div>
    </>
  );
}

function RequestStatusBadge({ status }: { status: TradeRequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full border px-2 text-[11px] leading-none font-medium",
        requestStatusClass[status],
      )}
    >
      {requestStatusLabel[status]}
    </span>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[18px] border border-teal-gray-150 bg-teal-gray-50 px-5 py-10 text-center">
      <Inbox className="mx-auto h-8 w-8 text-teal-gray-400" aria-hidden="true" />
      <h2 className="m-0 mt-3 text-label-1-semibold text-teal-gray-800">
        {title}
      </h2>
      <p className="m-0 mt-1 text-body-2-regular text-teal-gray-500">
        {description}
      </p>
    </div>
  );
}
