import { Camera, Check, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button, InputBox, cn } from "@umc/ui";

import {
  createBook,
  createTradePost,
  searchBooks,
  uploadTradePostImages,
} from "../api/swebook";
import type {
  Book,
  Category,
  CreateBookInput,
  CreateTradePostInput,
  LocationPreset,
} from "../api/types";
import {
  getDefaultEndTime,
  getDefaultStartTime,
  normalizeLocalDateTime,
} from "../utils/format";
import { BottomSheet } from "./BottomSheet";

type CreatePostSheetProps = {
  open: boolean;
  courses: Category[];
  location: LocationPreset;
  session: {
    userId: number;
    nickname: string;
  };
  onCreated: () => void;
  onOpenChange: (open: boolean) => void;
};

export function CreatePostSheet({
  open,
  courses,
  location,
  session,
  onCreated,
  onOpenChange,
}: CreatePostSheetProps) {
  const [bookQuery, setBookQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [newAuthor, setNewAuthor] = useState("");
  const [newPublisher, setNewPublisher] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [price, setPrice] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState(getDefaultStartTime);
  const [endAt, setEndAt] = useState(getDefaultEndTime);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setPlaceName(`${location.label} 근처`);
    setCategoryCode((current) => current || courses[0]?.categoryCode || "");
  }, [courses, location.label, open]);

  useEffect(() => {
    if (!open) return;
    if (!bookQuery.trim()) {
      setBooks([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      searchBooks(bookQuery.trim())
        .then((items) => {
          if (!cancelled) setBooks(items.slice(0, 5));
        })
        .catch(() => {
          if (!cancelled) setBooks([]);
        });
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [bookQuery, open]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.categoryCode === categoryCode),
    [categoryCode, courses],
  );

  const canSubmit =
    bookQuery.trim().length > 0 &&
    categoryCode.length > 0 &&
    Number(price) >= 0 &&
    placeName.trim().length > 0 &&
    startAt.length > 0 &&
    endAt.length > 0 &&
    !isSubmitting;

  const resetForm = () => {
    setBookQuery("");
    setBooks([]);
    setSelectedBook(null);
    setNewAuthor("");
    setNewPublisher("");
    setCategoryCode(courses[0]?.categoryCode || "");
    setPrice("");
    setPlaceName(`${location.label} 근처`);
    setDescription("");
    setStartAt(getDefaultStartTime());
    setEndAt(getDefaultEndTime());
    setFiles([]);
    setError("");
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError("");

    try {
      let book = selectedBook;
      if (!book) {
        const bookInput: CreateBookInput = {
          title: bookQuery.trim(),
        };
        if (newAuthor.trim()) bookInput.author = newAuthor.trim();
        if (newPublisher.trim()) bookInput.publisher = newPublisher.trim();
        book = await createBook(bookInput);
      }

      const postInput: CreateTradePostInput = {
        sellerId: session.userId,
        bookId: book.bookId,
        categoryCode,
        price: Number(price),
        placeName: placeName.trim(),
        detailAddress: location.label,
        latitude: location.latitude,
        longitude: location.longitude,
        availableTimes: [
          {
            startAt: normalizeLocalDateTime(startAt),
            endAt: normalizeLocalDateTime(endAt),
          },
        ],
      };
      if (description.trim()) postInput.description = description.trim();

      const created = await createTradePost(postInput);

      if (files.length > 0) {
        await uploadTradePostImages(created.postId, files);
      }

      resetForm();
      onOpenChange(false);
      onCreated();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "판매글 등록에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet open={open} title="전공서적 판매하기" onOpenChange={onOpenChange}>
      <div className="mobile-scrollbar max-h-[calc(88dvh-66px)] overflow-y-auto px-5 py-4">
        <div className="mb-4 rounded-[14px] bg-teal-50 px-4 py-3 text-body-2-medium text-teal-800">
          {session.nickname}님 판매글로 등록됩니다.
        </div>

        <div className="space-y-5 pb-5">
          <section className="space-y-2">
            <label className="block text-label-2-medium text-teal-gray-700">
              책 검색/선택
            </label>
            <InputBox
              value={bookQuery}
              onChange={(event) => {
                setBookQuery(event.target.value);
                setSelectedBook(null);
              }}
              onClear={() => {
                setBookQuery("");
                setSelectedBook(null);
              }}
              type="clear"
              placeholder="책 제목을 입력하세요"
              className="w-full"
              rightAdornment={<Search className="h-4 w-4 text-teal-gray-400" />}
            />
            {books.length > 0 && (
              <div className="space-y-2">
                {books.map((book) => {
                  const selected = selectedBook?.bookId === book.bookId;
                  return (
                    <button
                      key={book.bookId}
                      type="button"
                      onClick={() => {
                        setSelectedBook(book);
                        setBookQuery(book.title);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-[12px] border px-3 py-3 text-left transition",
                        selected
                          ? "border-teal-500 bg-teal-50"
                          : "border-teal-gray-200 bg-white",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="line-clamp-1 text-label-2-medium text-teal-gray-900">
                          {book.title}
                        </span>
                        <span className="line-clamp-1 text-caption-2-regular text-teal-gray-500">
                          {[book.author, book.publisher].filter(Boolean).join(" · ") ||
                            "도서 정보 없음"}
                        </span>
                      </span>
                      {selected && <Check className="h-4 w-4 text-teal-600" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            )}
            {!selectedBook && bookQuery.trim() && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={newAuthor}
                  onChange={(event) => setNewAuthor(event.target.value)}
                  placeholder="저자"
                  className="h-11 rounded-[12px] border border-teal-gray-200 px-3 text-body-2-medium outline-none focus:border-teal-400"
                />
                <input
                  value={newPublisher}
                  onChange={(event) => setNewPublisher(event.target.value)}
                  placeholder="출판사"
                  className="h-11 rounded-[12px] border border-teal-gray-200 px-3 text-body-2-medium outline-none focus:border-teal-400"
                />
              </div>
            )}
          </section>

          <section className="space-y-2">
            <label className="block text-label-2-medium text-teal-gray-700">
              과목
            </label>
            <select
              value={categoryCode}
              onChange={(event) => setCategoryCode(event.target.value)}
              className="mobile-native-select h-12 w-full rounded-[12px] border border-teal-gray-200 bg-white px-3 text-[16px] leading-[1.45] font-medium text-teal-gray-800 outline-none focus:border-teal-400"
            >
              {courses.map((course) => (
                <option key={course.categoryCode} value={course.categoryCode}>
                  {course.name}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <p className="m-0 text-caption-2-regular text-teal-gray-500">
                {selectedCourse.name} 수업 교재로 노출됩니다.
              </p>
            )}
          </section>

          <section className="grid grid-cols-[1fr_1.2fr] gap-3">
            <label className="space-y-2">
              <span className="block text-label-2-medium text-teal-gray-700">가격</span>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                placeholder="18000"
                className="h-11 w-full rounded-[12px] border border-teal-gray-200 px-3 text-label-2-medium outline-none focus:border-teal-400"
              />
            </label>
            <label className="space-y-2">
              <span className="block text-label-2-medium text-teal-gray-700">
                거래 장소
              </span>
              <input
                value={placeName}
                onChange={(event) => setPlaceName(event.target.value)}
                placeholder="중앙대학교 정문"
                className="h-11 w-full rounded-[12px] border border-teal-gray-200 px-3 text-label-2-medium outline-none focus:border-teal-400"
              />
            </label>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <label className="space-y-2">
              <span className="block text-label-2-medium text-teal-gray-700">
                시작 시간
              </span>
              <input
                value={startAt}
                onChange={(event) => setStartAt(event.target.value)}
                type="datetime-local"
                className="h-11 w-full rounded-[12px] border border-teal-gray-200 px-2 text-caption-1-medium outline-none focus:border-teal-400"
              />
            </label>
            <label className="space-y-2">
              <span className="block text-label-2-medium text-teal-gray-700">
                종료 시간
              </span>
              <input
                value={endAt}
                onChange={(event) => setEndAt(event.target.value)}
                type="datetime-local"
                className="h-11 w-full rounded-[12px] border border-teal-gray-200 px-2 text-caption-1-medium outline-none focus:border-teal-400"
              />
            </label>
          </section>

          <label className="block space-y-2">
            <span className="block text-label-2-medium text-teal-gray-700">설명</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="필기, 사용감, 포함 자료를 적어주세요."
              rows={3}
              className="w-full resize-none rounded-[14px] border border-teal-gray-200 px-3 py-3 text-body-2-medium outline-none focus:border-teal-400"
            />
          </label>

          <label className="flex min-h-20 items-center gap-3 rounded-[14px] border border-dashed border-teal-gray-300 bg-teal-gray-50 px-4 py-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-teal-600">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-label-2-medium text-teal-gray-800">
                표지 사진 추가
              </span>
              <span className="block text-caption-2-regular text-teal-gray-500">
                {files.length > 0 ? `${files.length}개 선택됨` : "선택하지 않아도 등록할 수 있어요"}
              </span>
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            />
          </label>

          {error && (
            <p className="m-0 rounded-[12px] bg-error-50 px-3 py-2 text-body-2-medium text-error-600">
              {error}
            </p>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={!canSubmit}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            등록하기
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
