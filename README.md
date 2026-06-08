# React + TypeScript + Vite

## Typography Guideline

Global UI fonts are defined in `src/styles/index.css`.

Use this Google Fonts import:

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

Font roles:

- Title: `Space Grotesk`
- Text: `Be Vietnam Pro`
- Sub text: `Manrope`

Implementation note:

- `body`, buttons, inputs, selects, and text controls use `Be Vietnam Pro`.
- `h1` to `h6` and `.font-title` use `Space Grotesk`.
- `p`, `small`, captions, and `.font-subtext` use `Manrope`.
- The Owlreka sidebar wordmark intentionally keeps `Agbalumo`.

# 🌐 i18n Guideline

Project hỗ trợ chuyển đổi ngôn ngữ giữa **VI** và **EN**. Khi code UI, team cần tuân thủ các rule sau để tránh hard-code text và giúp việc dịch/ngôn ngữ dễ maintain hơn.

## 1. Không hard-code text trực tiếp trong JSX

Không nên viết:

```tsx
<button>Login</button>
<h1>Trending Topic</h1>
```

Nên viết:

```tsx
<button>{t("common.login")}</button>
<h1>{t("navigation.trendingTopic")}</h1>
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

navigation.trendingTopic
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

## `api`

Chứa cấu hình và các hàm liên quan đến việc kết nối với máy chủ, ví dụ như cấu hình đường dẫn, phương thức gửi yêu cầu, xử lý phản hồi hoặc lỗi từ máy chủ.

## `app`

Chứa phần khởi tạo chính của ứng dụng, thường là nơi cấu hình tổng thể như định tuyến, bố cục chính, nhà cung cấp trạng thái hoặc các thiết lập toàn cục.

## `assets`

Chứa tài nguyên tĩnh của dự án như hình ảnh, biểu tượng, phông chữ, âm thanh hoặc các tệp dùng chung trong giao diện.

## `components`

Chứa các thành phần giao diện dùng lại nhiều nơi trong ứng dụng như nút bấm, ô nhập liệu, bảng, hộp thoại, thẻ hiển thị thông tin.

## `constants`

Chứa các giá trị cố định được dùng trong toàn dự án, giúp tránh viết lặp lại và dễ thay đổi khi cần.

## `features`

Chứa các chức năng lớn của hệ thống, được chia theo từng nghiệp vụ cụ thể như đăng nhập, quản lý người dùng, quản lý sản phẩm, đơn hàng.

## `hooks`

Chứa các hàm xử lý logic dùng lại trong React, giúp tách phần xử lý ra khỏi giao diện và làm mã nguồn gọn hơn.

## `layout`

Chứa các bố cục chung của trang như khung trang chính, thanh bên, thanh điều hướng, phần đầu trang, phần chân trang.

## `lib`

Chứa các thư viện tự viết, cấu hình công cụ, hàm hỗ trợ nâng cao hoặc phần kết nối với thư viện bên ngoài.

## `pages`

Chứa các trang chính của ứng dụng, mỗi tệp thường tương ứng với một màn hình hoặc một đường dẫn trên trang web.

## `services`

Chứa các hàm xử lý nghiệp vụ và giao tiếp với máy chủ, thường dùng để gọi dữ liệu, gửi dữ liệu, cập nhật hoặc xóa dữ liệu.

## `store`

Chứa phần quản lý trạng thái chung của ứng dụng, ví dụ như thông tin người dùng, giỏ hàng, trạng thái đăng nhập hoặc dữ liệu dùng ở nhiều màn hình.

## `styles`

Chứa các tệp định dạng giao diện như màu sắc, khoảng cách, kiểu chữ, bố cục, hiệu ứng và các thiết lập giao diện dùng chung.

## `types`

Chứa các kiểu dữ liệu dùng trong TypeScript, giúp kiểm soát cấu trúc dữ liệu và hạn chế lỗi khi lập trình.

## `utils`

Chứa các hàm tiện ích dùng chung trong nhiều nơi, thường là các hàm xử lý dữ liệu, định dạng ngày tháng, định dạng tiền tệ hoặc kiểm tra dữ liệu đơn giản.

## `validators`

Chứa các hàm hoặc quy tắc kiểm tra dữ liệu đầu vào, ví dụ như kiểm tra email, mật khẩu, số điện thoại, biểu mẫu đăng nhập hoặc đăng ký.
