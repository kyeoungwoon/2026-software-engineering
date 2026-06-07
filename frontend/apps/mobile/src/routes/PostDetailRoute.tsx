import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { Button, CtaModal, cn } from "@umc/ui";

import {
  createTradeRequest,
  getAvailableTimes,
  getTradePost,
  getUsers,
  SwebookApiError,
} from "../api/swebook";
import type {
  AvailableTime,
  SeedUser,
  TradePostDetail,
  TradePostStatus,
} from "../api/types";
import { BookCover } from "../components/BookCover";
import { LoginModal } from "../components/LoginModal";
import { StatusBadge } from "../components/StatusBadge";
import { useSession } from "../hooks/useSession";
import { formatDateTime, formatPrice } from "../utils/format";

export function PostDetailRoute() {
  const { postId } = useParams({ strict: false }) as { postId: string };
  const navigate = useNavigate();
  const { session, login } = useSession();
  const [post, setPost] = useState<TradePostDetail | null>(null);
  const [times, setTimes] = useState<AvailableTime[]>([]);
  const [users, setUsers] = useState<SeedUser[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [duplicateRequestOpen, setDuplicateRequestOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const numericPostId = Number(postId);
    if (!Number.isFinite(numericPostId)) return;

    setIsLoading(true);
    setError("");
    Promise.all([getTradePost(numericPostId), getAvailableTimes(numericPostId)])
      .then(([detail, available]) => {
        setPost(detail);
        setTimes(available.availableTimes);
        setSelectedTime(
          available.availableTimes.find((time) => !time.isRequested)?.startAt ||
            available.availableTimes[0]?.startAt ||
            "",
        );
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "판매글을 불러오지 못했습니다.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [postId]);

  useEffect(() => {
    if (!loginOpen || users.length > 0) return;

    getUsers()
      .then(setUsers)
      .catch((loadError) => {
        setMessage(
          loadError instanceof Error
            ? loadError.message
            : "사용자 목록을 불러오지 못했습니다.",
        );
      });
  }, [loginOpen, users.length]);

  const selectedAvailableTime = useMemo(
    () => times.find((time) => time.startAt === selectedTime),
    [selectedTime, times],
  );

  const isOwnPost = Boolean(post && session?.userId === post.seller.userId);
  const requestDisabledReason = getRequestDisabledReason({
    isOwnPost,
    post,
    selectedAvailableTime,
  });
  const requestButtonLabel = getRequestButtonLabel({
    isOwnPost,
    isRequesting,
    postStatus: post?.status,
    requestDisabledReason,
    sessionExists: Boolean(session),
  });

  const handleRequest = async () => {
    if (!post) return;
    if (!session) {
      setLoginOpen(true);
      return;
    }
    if (requestDisabledReason) {
      setMessage(requestDisabledReason);
      return;
    }

    setIsRequesting(true);
    setMessage("");
    try {
      await createTradeRequest({
        postId: post.postId,
        userId: session.userId,
        availableTime: selectedTime,
      });
      setMessage("구매 요청을 보냈습니다. 판매자가 수락하면 예약됩니다.");
      const available = await getAvailableTimes(post.postId);
      setTimes(available.availableTimes);
    } catch (requestError) {
      if (isConflictError(requestError)) {
        setDuplicateRequestOpen(true);
        return;
      }

      setMessage(
        requestError instanceof Error
          ? requestError.message
          : "구매 요청에 실패했습니다.",
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <main className="mx-auto flex h-dvh max-w-[430px] flex-col bg-white text-teal-gray-900 shadow-drop-neutral-1">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-teal-gray-100 bg-white/95 px-4 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex h-10 w-10 items-center justify-center rounded-full text-teal-gray-700 hover:bg-teal-gray-50"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="text-label-1-semibold text-teal-gray-900">상세 정보</span>
      </header>

      {isLoading && (
        <section className="flex-1 animate-pulse px-5 py-5">
          <div className="h-72 rounded-[18px] bg-teal-gray-100" />
          <div className="mt-5 h-5 w-4/5 rounded bg-teal-gray-100" />
          <div className="mt-3 h-4 w-2/3 rounded bg-teal-gray-100" />
          <div className="mt-8 h-24 rounded-[16px] bg-teal-gray-100" />
        </section>
      )}

      {!isLoading && error && (
        <section className="flex-1 px-5 py-8">
          <div className="rounded-[18px] bg-error-50 px-4 py-5 text-body-2-medium text-error-600">
            {error}
          </div>
        </section>
      )}

      {!isLoading && post && (
        <>
          <section className="mobile-scrollbar flex-1 overflow-y-auto pb-28">
            <BookCover
              src={post.images.find((image) => image.isCover)?.imageUrl ?? post.images[0]?.imageUrl}
              title={post.book.title}
              size="lg"
              className="rounded-none border-0"
            />

            <div className="px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="m-0 text-heading-6-semibold text-teal-gray-900">
                    {post.book.title}
                  </h1>
                  <p className="m-0 mt-1 text-body-2-regular text-teal-gray-500">
                    {[post.book.author, post.book.publisher, post.book.edition]
                      .filter(Boolean)
                      .join(" · ") || "도서 상세 정보 없음"}
                  </p>
                </div>
                <StatusBadge status={post.status} />
              </div>

              <p className="m-0 mt-4 text-heading-6-semibold text-teal-gray-900">
                {formatPrice(post.price)}
              </p>

              <div className="mt-5 grid gap-3 rounded-[16px] border border-teal-gray-150 bg-teal-gray-50 px-4 py-4">
                <InfoRow
                  icon={<UserRound className="h-4 w-4" aria-hidden="true" />}
                  label="판매자"
                  value={post.seller.nickname}
                />
                <InfoRow
                  icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
                  label="거래 장소"
                  value={post.placeName}
                />
                <InfoRow
                  icon={<Navigation className="h-4 w-4" aria-hidden="true" />}
                  label="과목"
                  value={post.category.name}
                />
              </div>

              <section className="mt-6">
                <h2 className="m-0 text-label-1-semibold text-teal-gray-900">설명</h2>
                <p className="m-0 mt-2 whitespace-pre-line text-body-2-regular text-teal-gray-700">
                  {post.description || "판매자가 별도 설명을 남기지 않았습니다."}
                </p>
              </section>

              <section className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600" aria-hidden="true" />
                  <h2 className="m-0 text-label-1-semibold text-teal-gray-900">
                    거래 가능 시간
                  </h2>
                </div>
                <div className="grid gap-2">
                  {times.length === 0 && (
                    <p className="m-0 rounded-[14px] bg-teal-gray-50 px-4 py-3 text-body-2-regular text-teal-gray-500">
                      등록된 시간이 없습니다.
                    </p>
                  )}
                  {times.map((time) => {
                    const active = selectedTime === time.startAt;
                    return (
                      <button
                        key={time.id}
                        type="button"
                        disabled={time.isRequested}
                        onClick={() => setSelectedTime(time.startAt)}
                        className={cn(
                          "flex items-center justify-between rounded-[14px] border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
                          active
                            ? "border-teal-500 bg-teal-50 text-teal-800"
                            : "border-teal-gray-200 bg-white text-teal-gray-700",
                        )}
                      >
                        <span className="text-label-2-medium">
                          {formatDateTime(time.startAt)} - {formatDateTime(time.endAt)}
                        </span>
                        <span className="text-caption-2-medium">
                          {time.isRequested ? "요청됨" : "선택"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {message && (
                <p className="m-0 mt-4 rounded-[14px] bg-teal-50 px-4 py-3 text-body-2-medium text-teal-800">
                  {message}
                </p>
              )}
            </div>
          </section>

          <div className="fixed right-0 bottom-0 left-0 z-30 mx-auto max-w-[430px] border-t border-teal-gray-150 bg-white px-5 py-4">
            <div className="grid grid-cols-[52px_1fr] gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/my/trades", search: { tab: "requests" } })}
                className="flex h-[50px] items-center justify-center rounded-[14px] bg-teal-gray-100 text-teal-gray-700"
                aria-label="구매 요청 내역"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </button>
              <Button
                size="lg"
                className="w-full"
                disabled={Boolean(session && requestDisabledReason) || isRequesting}
                isLoading={isRequesting}
                onClick={handleRequest}
              >
                {requestButtonLabel}
              </Button>
            </div>
            {requestDisabledReason && session && !isOwnPost && (
              <p className="m-0 mt-2 text-center text-caption-2-regular text-teal-gray-500">
                {requestDisabledReason}
              </p>
            )}
          </div>
        </>
      )}

      <LoginModal
        open={loginOpen}
        users={users}
        onOpenChange={setLoginOpen}
        onLogin={login}
      />
      <CtaModal
        open={duplicateRequestOpen}
        title="이미 구매를 요청한 게시글이에요!"
        cancelText="닫기"
        confirmText="구매 요청 보러 가기"
        content={null}
        size="medium"
        variant="warning"
        onOpenChange={setDuplicateRequestOpen}
        onCancel={() => setDuplicateRequestOpen(false)}
        onConfirm={() => {
          setDuplicateRequestOpen(false);
          void navigate({ to: "/my/trades", search: { tab: "requests" } });
        }}
      />
    </main>
  );
}

function isConflictError(error: unknown) {
  if (error instanceof SwebookApiError) {
    return error.httpStatus?.startsWith("409") || error.code?.includes("_409_");
  }

  return false;
}

function getRequestDisabledReason({
  isOwnPost,
  post,
  selectedAvailableTime,
}: {
  isOwnPost: boolean;
  post: TradePostDetail | null;
  selectedAvailableTime: AvailableTime | undefined;
}) {
  if (!post) return "판매글을 불러오는 중입니다.";
  if (isOwnPost) return "내 판매글입니다.";
  if (post.status === "RESERVED") {
    return "판매자가 다른 구매 요청을 수락해 예약중입니다.";
  }
  if (post.status === "SOLD") {
    return "이미 거래 완료된 매물입니다.";
  }
  if (!selectedAvailableTime) return "판매자가 등록한 거래 가능 시간이 없습니다.";
  if (selectedAvailableTime.isRequested) {
    return "선택한 거래 시간은 이미 다른 요청에 사용되었습니다.";
  }

  return "";
}

function getRequestButtonLabel({
  isOwnPost,
  isRequesting,
  postStatus,
  requestDisabledReason,
  sessionExists,
}: {
  isOwnPost: boolean;
  isRequesting: boolean;
  postStatus: TradePostStatus | undefined;
  requestDisabledReason: string;
  sessionExists: boolean;
}) {
  if (!sessionExists) return "로그인하고 요청하기";
  if (isRequesting) return "요청 중";
  if (isOwnPost) return "내 판매글입니다";
  if (postStatus === "RESERVED") return "예약중인 매물입니다";
  if (postStatus === "SOLD") return "거래 완료된 매물입니다";
  if (requestDisabledReason.includes("거래 가능 시간")) return "거래 가능 시간 없음";
  if (requestDisabledReason.includes("이미 다른 요청")) return "이미 요청된 시간입니다";
  if (requestDisabledReason) return "구매 요청 불가";
  return "구매 요청하기";
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-teal-600">
        {icon}
      </span>
      <span className="text-caption-1-medium text-teal-gray-500">{label}</span>
      <span className="ml-auto max-w-[190px] truncate text-right text-label-2-medium text-teal-gray-800">
        {value}
      </span>
    </div>
  );
}
