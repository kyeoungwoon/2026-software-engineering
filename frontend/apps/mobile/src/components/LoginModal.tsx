import { Check, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";

import { Button, InputBox, Modal, cn } from "@umc/ui";

import type { SeedUser } from "../api/types";

type LoginModalProps = {
  open: boolean;
  users: SeedUser[];
  onOpenChange: (open: boolean) => void;
  onLogin: (user: SeedUser) => void;
};

export function LoginModal({
  open,
  users,
  onOpenChange,
  onLogin,
}: LoginModalProps) {
  const [selectedUser, setSelectedUser] = useState<SeedUser | null>(users[0] ?? null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedUser((currentUser) => {
      if (currentUser && users.some((user) => user.userId === currentUser.userId)) {
        return currentUser;
      }
      return users[0] ?? null;
    });
  }, [users]);

  const handleLogin = () => {
    setError("");

    if (email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      const found = users.find((user) => user.email.toLowerCase() === normalizedEmail);
      if (!found) {
        setError("서버에 등록된 시드 사용자 이메일을 입력해주세요.");
        return;
      }

      onLogin(found);
      onOpenChange(false);
      return;
    }

    if (!selectedUser) {
      setError("사용자 목록을 불러온 뒤 다시 시도해주세요.");
      return;
    }

    onLogin(selectedUser);
    onOpenChange(false);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (error) {
      setError("");
    }
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setEmail("");
      setError("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Modal.Root open={open} onOpenChange={handleClose}>
      <Modal.Portal>
        <Modal.Overlay tone="light" />
        <Modal.Content className="w-[calc(100vw-32px)] max-w-[390px] overflow-hidden rounded-[24px] bg-white shadow-drop-neutral-1 focus:outline-none">
          <div className="flex items-start justify-between px-5 pt-5">
            <div>
              <Modal.Title className="m-0 text-heading-6-semibold text-teal-gray-900">
                과제용 로그인
              </Modal.Title>
              <Modal.Description className="mt-1 text-body-2-regular text-teal-gray-500">
                서버에 저장된 시드 사용자로 거래 흐름을 확인합니다.
              </Modal.Description>
            </div>
            <Modal.Close
              className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-gray-50 text-teal-gray-600"
              aria-label="닫기"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Modal.Close>
          </div>

          <div className="space-y-4 px-5 py-5">
            <div className="grid max-h-[236px] grid-cols-2 gap-2 overflow-y-auto">
              {users.map((user) => {
                const selected = selectedUser?.userId === user.userId;
                return (
                  <button
                    key={user.userId}
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className={cn(
                      "flex items-center justify-between rounded-[12px] border px-3 py-3 text-left transition",
                      selected
                        ? "border-teal-500 bg-teal-50 text-teal-800"
                        : "border-teal-gray-200 bg-white text-teal-gray-700",
                    )}
                  >
                    <span>
                      <span className="block text-label-2-medium">{user.nickname}</span>
                      <span className="block text-caption-2-regular text-teal-gray-500">
                        ID {user.userId}
                      </span>
                    </span>
                    {selected && <Check className="h-4 w-4" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>

            {users.length === 0 && (
              <p className="m-0 rounded-[12px] bg-teal-gray-50 px-3 py-3 text-body-3-regular text-teal-gray-500">
                사용자 목록을 불러오는 중입니다.
              </p>
            )}

            <InputBox
              value={email}
              onChange={handleEmailChange}
              onClear={() => {
                setEmail("");
                setError("");
              }}
              type="clear"
              placeholder="이메일로 선택하기"
              className="w-full"
            />

            {error && (
              <p className="m-0 text-caption-1-medium text-error-600">
                {error}
              </p>
            )}

            <Button size="lg" className="w-full" onClick={handleLogin}>
              로그인
            </Button>
          </div>
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  );
}
