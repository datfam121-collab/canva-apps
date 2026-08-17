# Canva App — Tôm Content Tool (skeleton)

Skeleton **Canva Apps SDK** (app chạy trong Canva editor) cho Markus Agency. Mục tiêu: cho AI assistant "Tôm" (hoặc người dùng) đổ nội dung tiếng Việt / hình khối vào design Canva đang mở.

> **Vì sao webpack chứ không phải Vite?** Task gốc đề xuất Vite, nhưng docs chính thức của Canva Apps SDK (quick-start, starter kit) dùng **webpack** qua `@canva/cli` — Canva tự quản lý webpack config (dev server HTTPS/HMR/CORS riêng cho iframe sandbox, bundle single-file theo yêu cầu CSP...). Project này được scaffold bằng `@canva/cli` chính thức (`canva apps create --offline`) rồi tuỳ biến, thay vì dựng tay bằng Vite, để tránh lệch với runtime thật của Canva.

## Thông tin app (đã cấu hình sẵn trong `.env`)

| Biến | Giá trị |
|---|---|
| App ID | `AAHOGMQhWVM` |
| Origin | `https://app-aahogmqhwvm.canva-apps.com` |
| Frontend dev URL | `http://localhost:8080` |
| HMR | Bật (`CANVA_HMR_ENABLED=TRUE`) |

Nếu cần đổi App ID/origin (ví dụ tạo app khác), sửa `CANVA_APP_ID` / `CANVA_APP_ORIGIN` trong `.env` — lấy giá trị đúng tại **Developer Portal → app của bạn → Settings → Security**.

## Cấu trúc thư mục

```
canva-apps/
├── .env                          # App ID / origin / port (đã điền)
├── canva-app.json                # Manifest: quyền (content:read/write) + intent design_editor
├── package.json
├── webpack.config.ts             # Build + dev server chuẩn Canva CLI (không cần sửa)
├── src/
│   ├── index.tsx                 # Entry point → prepareDesignEditor()
│   └── intents/design_editor/
│       ├── index.tsx             # Mount React root (AppI18nProvider + AppUiProvider)
│       ├── app.tsx               # ★ UI chính — 3 nút demo, sửa file này để thêm tính năng
│       └── __tests__/app.test.tsx
├── styles/components.css         # CSS module cho layout
└── declarations/                 # Type declarations (CSS modules, biến môi trường)
```

## Chạy dev

```bash
cd canva-apps
npm install      # đã chạy sẵn lúc scaffold, chỉ cần chạy lại nếu đổi máy/xoá node_modules
npm start
```

Dev server chạy tại `http://localhost:8080` (không mở được trực tiếp bằng trình duyệt — server chỉ trả JS bundle, phải xem qua Canva editor ở bước dưới).

## Preview trong Canva

1. Đảm bảo `npm start` đang chạy.
2. Vào [canva.com](https://www.canva.com) → **tạo hoặc mở một design** bất kỳ.
3. Mở panel **Apps** (sidebar trái) → tìm app **"Untitled App"** (app development, chỉ tài khoản đã tạo app mới thấy) → bấm để mở.
   - Nếu app chưa từng mở trong editor này, Canva sẽ hỏi xác nhận **Open** một lần.
4. App hiện ra ở side panel bên phải với 3 nút demo.

Nếu Development URL trong Developer Portal chưa trỏ đúng `http://localhost:8080`: vào **Developer Portal → app → App source → Development URL**, nhập `http://localhost:8080`, bấm **Preview**.

Mỗi lần sửa code, HMR (đã bật) sẽ tự cập nhật app trong editor mà không cần đóng/mở lại. Nếu không thấy tự cập nhật, đóng rồi mở lại app trong panel Apps.

<details>
<summary>Preview trên Safari (không bắt buộc)</summary>

Safari chặn HTTPS editor load script từ HTTP localhost. Nếu cần test trên Safari:

```bash
npm start -- --use-https
```

Sau đó set Development URL thành `https://localhost:8080` và bỏ qua cảnh báo chứng chỉ tự ký.
</details>

## 3 tính năng demo (trong `src/intents/design_editor/app.tsx`)

| Nút | Hành vi | API dùng |
|---|---|---|
| **Thêm text tiếng Việt** | Thêm text box mẫu có dấu vào design | `addElementAtPoint` / `addElementAtCursor` (`@canva/design`) |
| **Thêm hình chữ nhật** | Thêm shape hình chữ nhật màu tím | `addElementAtPoint` với `type: "shape"` |
| **Nội dung tuỳ chỉnh + "Đổ nội dung vào design"** | Người dùng gõ text → bấm nút → text được thêm vào design | Cùng cơ chế text ở trên, đây là nền tảng để Tôm "đổ" nội dung động vào slide |

Cả 3 nút tự động disable + hiện tooltip khi trang thiết kế hiện tại không hỗ trợ (ví dụ một số loại design không cho thêm phần tử tự do).

## Lưu ý tiếng Việt (font)

- App **không tự set font** — text mới thêm sẽ dùng font mặc định của design hiện tại. Phần lớn font Canva hỗ trợ tốt dấu tiếng Việt, nhưng một số font trang trí/script có thể lỗi dấu (dấu bay, dính chữ).
- Nếu cần đảm bảo font hỗ trợ tiếng Việt hoặc cho phép người dùng chọn font: dùng `requestFontSelection` (từ `@canva/asset`) để mở font picker của Canva, lấy `fontRef` trả về rồi gán vào `TextAttributes.fontRef` khi gọi `addElementAtPoint`. Chưa implement trong skeleton này — thêm khi cần Tôm kiểm soát font cụ thể.

## Build production

```bash
npm run build
```

Output: `dist/app.js` (bundle duy nhất theo yêu cầu CSP của Canva) + `dist/messages_en.json` (chuỗi UI đã extract qua `react-intl`, dùng nếu sau này cần đa ngôn ngữ).

## Kiểm tra khác

```bash
npm run lint:types   # tsc — type check
npm run lint         # eslint (bao gồm rule bắt buộc string UI phải qua react-intl)
npm test             # jest — 3 test cho 3 nút demo
```

Tất cả đã chạy sạch (không lỗi) tại thời điểm tạo skeleton này.

## Việc cần Đại ca làm / lưu ý

- Git repo đã init (`--git`) nhưng **chưa commit** gì — tự quyết định commit khi sẵn sàng.
- App hiện chỉ có quyền `canva:design:content:read` + `canva:design:content:write` (đủ cho việc thêm nội dung). Nếu Tôm cần đọc/ghi asset (ảnh, upload), phải thêm scope tương ứng trong `canva-app.json` và bật lại trong Developer Portal.
- Đây là skeleton MVP — chưa có backend, chưa gọi API của Tôm. Bước tiếp theo hợp lý: thêm 1 action gọi sang backend/Tôm để lấy nội dung tự động thay vì gõ tay vào ô "Nội dung tuỳ chỉnh".
