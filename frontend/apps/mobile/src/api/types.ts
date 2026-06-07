export type TradePostStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export type TradeRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type CategoryType = "MAJOR" | "COURSE";

export type Category = {
  categoryCode: string;
  parentCode: string | null;
  type: CategoryType;
  name: string;
};

export type LocationPreset = {
  id: string;
  label: string;
  description: string;
  latitude: number;
  longitude: number;
  radiusLabel: string;
};

export type SeedUser = {
  userId: number;
  email: string;
  nickname: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
};

export type Book = {
  bookId: number;
  title: string;
  author: string | null;
  publisher: string | null;
  edition: string | null;
  isbn: string | null;
  createdAt: string;
};

export type TradePostListItem = {
  postId: number;
  sellerId: number;
  sellerNickname: string;
  bookId: number;
  bookTitle: string;
  categoryCode: string;
  categoryName: string;
  price: number;
  description: string | null;
  status: TradePostStatus;
  placeName: string;
  latitude: number;
  longitude: number;
  radius: number;
  createdAt: string;
  updatedAt: string;
};

export type NearbyPostItem = {
  postId: number;
  bookName: string;
  categoryName: string;
  seller: {
    sellerId: number;
    sellerName: string;
  };
  price: number;
  status: TradePostStatus;
  distanceMeter: number;
  coverImageUrl: string | null;
};

export type NearbyTradePosts = {
  posts: NearbyPostItem[];
  page: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
  };
};

export type TradePostDetail = {
  postId: number;
  seller: {
    userId: number;
    nickname: string;
  };
  book: {
    bookId: number;
    title: string;
    author: string | null;
    publisher: string | null;
    edition: string | null;
    isbn: string | null;
  };
  category: {
    categoryCode: string;
    parentCode: string | null;
    type: CategoryType;
    name: string;
  };
  price: number;
  description: string | null;
  status: TradePostStatus;
  placeName: string;
  latitude: number;
  longitude: number;
  images: Array<{
    imageId: number;
    imageUrl: string;
    isCover: boolean;
  }>;
  availableTimes: Array<{
    id: string;
    startAt: string;
    endAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type AvailableTime = {
  id: string;
  startAt: string;
  endAt: string;
  isRequested: boolean;
};

export type AvailableTimeResponse = {
  postId: number;
  availableTimes: AvailableTime[];
};

export type CreateBookInput = {
  title: string;
  author?: string;
  publisher?: string;
  edition?: string;
  isbn?: string;
};

export type CreateTradePostInput = {
  sellerId: number;
  bookId: number;
  categoryCode: string;
  price: number;
  description?: string;
  placeName: string;
  detailAddress?: string;
  latitude: number;
  longitude: number;
  availableTimes: Array<{
    startAt: string;
    endAt: string;
  }>;
};

export type CreateTradePostResponse = {
  postId: number;
};

export type CreateTradeRequestResponse = {
  requestId: number;
  postId: number;
  requestStatus: TradeRequestStatus;
  createdAt: string;
};

export type MeTradeRequest = {
  requestId: number;
  buyerId: number;
  buyerNickname: string;
  sellerId: number;
  sellerNickname: string;
  postId: number;
  bookTitle: string;
  availableTimeId: number;
  startAt: string;
  endAt: string;
  status: TradeRequestStatus;
  createdAt: string;
};

export type TradeRequestActionResponse = MeTradeRequest & {
  updatedAt: string;
};
