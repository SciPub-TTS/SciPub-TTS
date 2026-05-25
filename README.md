# React + TypeScript + Vite

# 🌐 i18n Guideline

Project hỗ trợ chuyển đổi ngôn ngữ giữa **VI** và **EN**. Khi code UI, team cần tuân thủ các rule sau để tránh hard-code text và giúp việc dịch/ngôn ngữ dễ maintain hơn.

## 1. Không hard-code text trực tiếp trong JSX

Không nên viết:

```tsx
<button>Login</button>
<h1>Dashboard</h1>
```

Nên viết:

```tsx
<button>{t("common.login")}</button>
<h1>{t("navigation.dashboard")}</h1>
```

## 2. Mọi text hiển thị trên UI phải được khai báo trong file i18n

Khi thêm text mới, cần thêm vào cả 2 file:

```txt
src/app/i18n/resources/en.ts
src/app/i18n/resources/vi.ts
```

Ví dụ:

```ts
// en.ts
const en = {
  common: {
    login: "Login",
  },
};

export default en;
```

```ts
// vi.ts
const vi = {
  common: {
    login: "Đăng nhập",
  },
};

export default vi;
```

## 3. Sử dụng `useTranslation` trong component

```tsx
import { useTranslation } from "react-i18next";

export default function LoginButton() {
  const { t } = useTranslation();

  return <button>{t("common.login")}</button>;
}
```

## 4. Quy tắc đặt key

Key nên đặt theo nhóm chức năng hoặc khu vực UI:

```txt
common.login
common.logout
common.save
common.cancel

navigation.dashboard
navigation.searchPapers
navigation.bookmarks

admin.users
admin.fields
admin.synchronization

paper.title
paper.abstract
paper.authors

profile.fullName
profile.email
```

Không nên đặt key quá chung chung như:

```txt
text1
button2
title
label
```

## 5. Khi thêm page/component mới

Checklist trước khi tạo pull request:

- Không hard-code text hiển thị trực tiếp trong JSX.
- Thêm key tương ứng vào `en.ts`.
- Thêm key tương ứng vào `vi.ts`.
- Dùng `t("key")` để render text.
- Test nhanh nút đổi ngôn ngữ `VI | EN`.
- Đảm bảo key đặt tên rõ nghĩa và đúng nhóm chức năng.

## 6. Text nào không cần đưa vào i18n?

Các text động lấy từ API không cần đưa vào i18n, ví dụ:

- Tên bài báo.
- Tên tác giả.
- Tên institution.
- Tên funder.
- Abstract.
- Keyword/topic lấy từ dữ liệu thật.

Chỉ cần i18n cho text thuộc giao diện hệ thống, ví dụ:

- Button.
- Menu.
- Label.
- Placeholder.
- Page title.
- Empty state.
- Error message.
- Confirmation message.

## 7. Lưu ý khi code chung

Nếu component có text hiển thị cho user, hãy kiểm tra trước trong `en.ts` và `vi.ts` đã có key phù hợp chưa. Nếu chưa có thì thêm key mới, tránh tự hard-code text trong component.
