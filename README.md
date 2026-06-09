# Stay Savvy -- Nền tảng đặt phòng khách sạn trực tuyến

**Stay Savvy** (tên dự án: `3-st-survey`) là ứng dụng web full-stack cho phép chủ khách sạn đăng tin và quản lý phòng, khách hàng tìm kiếm, xem chi tiết, đặt phòng và thanh toán trực tuyến qua Stripe. Ứng dụng được xây dựng cho thị trường Việt Nam với đầy đủ tiếng Việt, dữ liệu hành chính Việt Nam và định dạng tiền tệ VND.

---

## Tính năng chính

### Dành cho khách hàng
- **Tìm kiếm khách sạn**: lọc theo tỉnh/thành phố và/hoặc quận/huyện, kết hợp tìm kiếm theo từ khóa tên khách sạn
- **Xem chi tiết khách sạn**: ảnh, mô tả, vị trí, danh sách tiện ích (hồ bơi, spa, gym, wifi...), danh sách phòng
- **Xem chi tiết phòng**: ảnh, mô tả, cấu hình giường (giường lớn/giường trung), số lượng khách, tiện ích phòng (điều hòa, ban công, view...)
- **Đặt phòng**: chọn ngày nhận/trả phòng bằng lịch trực quan, chọn thêm bữa sáng, tự động tính tổng tiền, kiểm tra xung đột lịch
- **Thanh toán**: tích hợp Stripe Checkout (redirect) hoặc Stripe Elements (inline)
- **Quản lý đặt phòng**: xem lịch sử đặt phòng, thanh toán lại nếu chưa thanh toán

### Dành cho chủ khách sạn
- **Quản lý khách sạn**: thêm/sửa/xóa khách sạn với ảnh (UploadThing), tiện ích (12 loại), vị trí (tỉnh/huyện Việt Nam)
- **Quản lý phòng**: thêm/sửa/xóa phòng với cấu hình giường, giá, tiện ích (10 loại)
- **Xem đặt phòng**: danh sách booking từ khách hàng trên khách sạn của mình

### Tính năng hệ thống
- **Xác thực**: JWT custom (jose) + bcryptjs + httpOnly cookie, session lưu trong DB
- **Phân quyền**: middleware proxy.ts kiểm tra token, redirect về sign-in nếu chưa đăng nhập
- **Chế độ tối (Dark mode)**: next-themes với light/dark/system
- **Giao diện**: shadcn/ui Radix Maia theme, màu primary purple, Tailwind CSS v4
- **Upload ảnh**: UploadThing (tối đa 8MB, định dạng JPG/PNG)
- **Tìm kiếm**: debounce 300ms, URL searchParams, fulltext search trên database

---

## Công nghệ sử dụng

| Loại | Công nghệ | Phiên bản |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| UI Library | React | 19.2.4 |
| Ngôn ngữ | TypeScript | ^5 |
| Styling | Tailwind CSS v4 + tw-animate-css | ^4.3.0 |
| UI Components | shadcn/ui (Radix Maia) | radix-ui ^1.5.0, shadcn ^4.10.0 |
| Form | react-hook-form + @hookform/resolvers | ^7.78.0 / ^5.4.0 |
| Validation | Zod | ^4.4.3 |
| Database ORM | Prisma (MariaDB adapter) | ^7.8.0 |
| Database | MariaDB (MySQL-compatible) | -- (Railway cloud) |
| Auth | JWT (jose), bcryptjs, httpOnly cookies | jose ^6.2.3, bcryptjs ^3.0.3 |
| Thanh toán | Stripe (Checkout Sessions + Elements) | stripe ^22.2.0, @stripe/react-stripe-js ^6.6.0 |
| Upload ảnh | UploadThing | ^7.7.4 |
| State management | Zustand (persist middleware) | ^5.0.14 |
| HTTP Client | Axios | ^1.17.0 |
| Date utilities | date-fns v4, moment.js | ^4.4.0 / ^2.30.1 |
| Icons | Lucide React, react-icons | lucide-react ^1.17.0, react-icons ^5.6.0 |
| Theme | next-themes | ^0.4.6 |
| Notifications | react-hot-toast | ^2.6.0 |
| Location data | vietnam-divisions-js | ^3.0.0 |
| Query strings | query-string | ^9.4.0 |
| Linting/Formatting | Biome v2 (primary), ESLint 9 (secondary) | Biome 2.4.16, ESLint ^9 |
| PostCSS | @tailwindcss/postcss | ^4.3.0 |
| Font | Inter (next/font/google) | -- |

---

## Cấu trúc thư mục

```
/
├── actions/                        # Server-side data access functions
│   ├── get-bookings.ts             -- Lấy bookings theo hotelId
│   ├── get-hotels.ts               -- Lấy danh sách khách sạn (có filter)
│   ├── getBookingsByHotelOwnerId.ts-- Booking trên khách sạn của tôi
│   ├── getBookingsByUserId.ts      -- Booking của tôi
│   ├── getHotelById.ts             -- Lấy chi tiết 1 khách sạn
│   ├── getHotelsByUserId.ts        -- Khách sạn của tôi
│   └── verify-payment.ts           -- Xác minh thanh toán Stripe
│
├── app/                            # Next.js App Router
│   ├── globals.css                 -- Tailwind v4 theme + CSS variables (purple primary)
│   ├── layout.tsx                  -- Root layout: Inter font, ThemeProvider, Navbar, Toaster
│   ├── page.tsx                    -- Trang chủ: danh sách khách sạn + bộ lọc
│   │
│   ├── (auth)/                     -- Route group auth (layout riêng, centered)
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx        -- Đăng nhập
│   │   └── sign-up/page.tsx        -- Đăng ký
│   │
│   ├── book-room/
│   │   ├── page.tsx                -- Redirect về "/"
│   │   └── success/page.tsx        -- Trang thanh toán thành công (verify + auto-redirect)
│   │
│   ├── hotel/[hotelId]/page.tsx    -- Tạo/sửa khách sạn
│   ├── hotel-details/[hotelId]/page.tsx -- Chi tiết khách sạn + đặt phòng
│   ├── my-bookings/page.tsx        -- Quản lý đặt phòng
│   ├── my-hotels/page.tsx          -- Khách sạn của tôi
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      -- POST: đăng nhập
│       │   ├── register/route.ts   -- POST: đăng ký
│       │   ├── logout/route.ts     -- POST: đăng xuất
│       │   └── me/route.ts         -- GET: thông tin user hiện tại
│       │
│       ├── hotel/
│       │   ├── route.ts            -- POST: tạo khách sạn
│       │   └── [hotelId]/route.ts  -- PATCH: sửa, DELETE: xóa
│       │
│       ├── room/
│       │   ├── route.ts            -- POST: tạo phòng
│       │   └── [roomId]/route.ts   -- PATCH: sửa, DELETE: xóa
│       │
│       ├── booking/[id]/route.ts   -- GET: bookings (overlap check), PATCH: payment done, DELETE
│       ├── create-payment-intent/route.ts -- POST: Stripe Checkout Session + DB booking
│       ├── verify-payment/route.ts        -- POST: verify Stripe payment
│       │
│       └── uploadthing/
│           ├── core.ts             -- UploadThing config (imageUploader, 8MB)
│           ├── route.ts            -- UploadThing API handler
│           └── delete/route.ts     -- POST: xóa file đã upload
│
├── components/
│   ├── Container.tsx               -- Layout wrapper (max-w-[1920px])
│   ├── SearchInput.tsx             -- Input tìm kiếm (debounce 300ms)
│   ├── amenity-item.tsx            -- Hiển thị 1 tiện ích (icon + label)
│   ├── location-filter.tsx         -- Bộ lọc tỉnh/huyện (URL searchParams)
│   ├── login-form.tsx              -- Form đăng nhập
│   ├── signup-form.tsx             -- Form đăng ký
│   ├── theme-provider.tsx          -- next-themes wrapper
│   ├── mode-toggle.tsx             -- Dropdown chọn theme (light/dark/system)
│   │
│   ├── layout/
│   │   ├── Navbar.tsx              -- Navbar sticky: logo, search, theme, auth, NavMenu
│   │   └── nav-menu.tsx            -- Dropdown navigation (Add Hotel, My Hotels, My Bookings)
│   │
│   ├── hotel/
│   │   ├── addHotelForm.tsx        -- Form CRUD khách sạn (react-hook-form + Zod)
│   │   ├── hotel-card.tsx          -- Card tóm tắt khách sạn
│   │   ├── hotel-details-client.tsx-- Trang chi tiết khách sạn (client)
│   │   └── hotel-list.tsx          -- Grid danh sách hotel-card
│   │
│   ├── room/
│   │   ├── add-room-form.tsx       -- Form CRUD phòng
│   │   ├── room-card.tsx           -- Card phòng + date picker + booking + edit/delete
│   │   └── date-range-picker.tsx   -- Bộ chọn ngày (Vietnamese locale)
│   │
│   ├── booking/
│   │   ├── book-room-client.tsx    -- Stripe Elements + RoomCard
│   │   ├── my-booking-client.tsx   -- Card chi tiết booking (dates, price, payment status)
│   │   └── room-payment-form.tsx   -- Stripe PaymentElement + AddressElement form
│   │
│   └── ui/                         -- shadcn/ui primitives (button, input, card, form, select...)
│
├── hooks/
│   ├── useBookRoom.ts              -- Zustand store (persist) cho booking flow
│   ├── useDebouncedValue.ts        -- Debounce hook (default 300ms)
│   └── useLocation.ts              -- Vietnam provinces/districts data
│
├── lib/
│   ├── auth.ts                     -- hashPassword, comparePassword, createSession, deleteSession, getCurrentUser, requireAuth
│   ├── location-utils.ts           -- Server-side location cache (province/district name)
│   ├── prisma.ts                   -- Prisma client singleton (MariaDB adapter)
│   ├── utils.ts                    -- cn() class merger + formatPrice (VND)
│   └── generated/prisma/           -- Auto-generated Prisma client
│
├── prisma/
│   └── schema.prisma               -- Database schema (User, Session, Hotel, Room, Booking)
│
├── public/                         -- Static assets (SVGs, logo, dummy images)
│
├── proxy.ts                        -- Middleware: JWT auth check, route protection
├── next.config.ts                  -- Next.js config (image remotePatterns)
├── components.json                 -- shadcn/ui config
├── biome.json                      -- Biome formatter/linter config
├── postcss.config.mjs              -- PostCSS config
└── package.json
```

---

## Database Schema (Prisma / MariaDB)

### Models

**User** -- Tài khoản người dùng
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | String (cuid) | Khóa chính |
| email | String (unique) | Email đăng nhập |
| name | String? | Tên hiển thị |
| password | String | Bcrypt hash (12 rounds) |
| createdAt | DateTime | Tự động |
| updatedAt | DateTime | Tự động |
| sessions | Session[] | Quan hệ 1-n |

**Session** -- Phiên đăng nhập JWT
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | String (cuid) | Khóa chính |
| userId | String | FK -> User |
| token | String (unique) | JWT token |
| expiresAt | DateTime | 7 ngày |
| createdAt | DateTime | Tự động |

**Hotel** -- Khách sạn
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | String (uuid) | Khóa chính |
| userId | String | FK -> User (chủ khách sạn) |
| title | String (Text) | Fulltext index |
| description | String (LongText) | Mô tả chi tiết |
| image | String | URL từ UploadThing |
| state | String | Mã tỉnh/thành phố (VD: "01" = Hà Nội) |
| city | String | Mã quận/huyện (VD: "001" = Ba Đình) |
| locationDescription | String (LongText) | Mô tả vị trí |
| gym, spa, bar, laundry, restaurant, shopping, freeParking, bikeRental, freeWifi, movieNight, swimmingPool, coffeeShop | Boolean (12 trường) | Tiện ích khách sạn |
| createdAt / updatedAt | DateTime | Tự động |
| rooms / booking | Room[] / Booking[] | Quan hệ |

**Room** -- Phòng
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | String (uuid) | Khóa chính |
| hotelId | String | FK -> Hotel (indexed) |
| title | String | Tên phòng |
| description | String (LongText) | Mô tả |
| bedCount / guestCount / bathroomCount | Int | Số lượng |
| kingBed / queenBed | Int | Số giường lớn/trung |
| image | String | URL UploadThing |
| roomPrice | Int | Giá phòng (VND) |
| breakfastPrice | Int | Giá bữa sáng thêm (VND) |
| roomService, tv, balcony, freeWifi, cityView, oceanView, forestView, mountainView, airCondition, soundProofed | Boolean (10 trường) | Tiện ích phòng |

**Booking** -- Đặt phòng
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | String (uuid) | Khóa chính |
| userId | String | FK -> User |
| userName / userEmail | String | Thông tin người đặt |
| hotelId | String | FK -> Hotel (indexed) |
| roomId | String | FK -> Room (indexed) |
| hotelOwnerId | String | Chủ khách sạn (để lọc) |
| startDate / endDate | DateTime | Ngày nhận/trả phòng |
| breakfastIncluded | Boolean | Có thêm bữa sáng không |
| totalPrice | Int | Tổng tiền (VND) |
| paymentStatus | String | "true" / "false" |
| paymentIntentId | String (unique) | Stripe PaymentIntent ID |
| bookedAt | DateTime | Tự động |

---

## Xác thực

Hệ thống xác thực custom (không dùng OAuth, không dùng NextAuth):

### Luồng đăng ký
1. Người dùng nhập name, email, password, confirmPassword
2. Server hash password bằng bcryptjs (12 rounds)
3. Tạo User trong database
4. Tạo JWT (HS256) với `sub` = userId, `exp` = 7 ngày
5. Lưu Session (token + expiresAt + userId) vào database
6. Set httpOnly cookie `session_token`

### Luồng đăng nhập
1. Người dùng nhập email + password
2. Server so sánh password với bcrypt hash
3. Tạo JWT và Session (như đăng ký)
4. Set cookie

### Kiểm tra xác thực
- **Middleware (proxy.ts)**: chạy trên tất cả route trừ `api/auth`, `api/uploadthing`, `_next/*`. Đọc cookie, verify JWT bằng `jose`. Redirect về `/sign-in` nếu chưa đăng nhập. Redirect về `/` nếu đã đăng nhập nhưng vào `/sign-in` hoặc `/sign-up`.
- **Server Actions / API Routes**: gọi `getCurrentUser()` hoặc `requireAuth()` từ `lib/auth.ts` để lấy user hiện tại hoặc redirect.

### Đăng xuất
- Xóa session khỏi database
- Xóa cookie `session_token`

---

## API Endpoints

### Xác thực
| Method | Route | Auth | Mô tả |
|---|---|---|---|
| POST | /api/auth/register | No | Đăng ký tài khoản |
| POST | /api/auth/login | No | Đăng nhập |
| POST | /api/auth/logout | No | Đăng xuất |
| GET | /api/auth/me | Yes | Thông tin user hiện tại |

### Hotel CRUD
| Method | Route | Auth | Mô tả |
|---|---|---|---|
| POST | /api/hotel | Yes | Tạo khách sạn mới |
| PATCH | /api/hotel/[hotelId] | Yes | Cập nhật khách sạn |
| DELETE | /api/hotel/[hotelId] | Yes | Xóa khách sạn |

### Room CRUD
| Method | Route | Auth | Mô tả |
|---|---|---|---|
| POST | /api/room | Yes | Tạo phòng mới |
| PATCH | /api/room/[roomId] | Yes | Cập nhật phòng |
| DELETE | /api/room/[roomId] | Yes | Xóa phòng |

### Đặt phòng & Thanh toán
| Method | Route | Auth | Mô tả |
|---|---|---|---|
| GET | /api/booking/[roomId] | No | Lấy booking đã thanh toán (overlap check) |
| PATCH | /api/booking/[paymentIntentId] | Yes | Cập nhật paymentStatus = "true" |
| DELETE | /api/booking/[bookingId] | Yes | Xóa booking |
| POST | /api/create-payment-intent | Yes | Tạo Stripe Checkout Session + booking record |
| POST | /api/verify-payment | No | Xác minh thanh toán Stripe |

### Upload
| Method | Route | Auth | Mô tả |
|---|---|---|---|
| GET/POST | /api/uploadthing | Via middleware | Upload ảnh |
| POST | /api/uploadthing/delete | Yes | Xóa ảnh đã upload |

---

## Luồng Đặt Phòng & Thanh Toán

Đây là luồng phức tạp nhất trong hệ thống, với 2 loại tích hợp Stripe song song:

### Luồng chính: Stripe Checkout Session (hosted page)

1. Khách hàng vào `/hotel-details/[hotelId]`
2. Chọn ngày trên DateRangePicker
   - Ngày quá khứ -> disabled
   - Ngày đã có booking (paymentStatus = "true") -> disabled
   - Ngày trước ngày nhận -> disabled
3. Chọn thêm bữa sáng (nếu có)
4. Xem tổng tiền (số ngày * giá phòng + số ngày * giá bữa sáng)
5. Nhấn "Đặt phòng"
   - Gọi `GET /api/booking/[roomId]` lấy danh sách booking đã thanh toán
   - Kiểm tra overlap bằng `hasOverlap()` (3 trường hợp: start trong range, end trong range, range mới bao trùm range cũ)
   - Nếu overlap -> toast error, dừng
6. Gọi `POST /api/create-payment-intent`
   - Tạo Stripe Checkout Session
   - Lưu booking vào DB với `paymentStatus: "false"`
7. Redirect sang Stripe Checkout (hosted page)
8. Khách nhập thẻ (test: 4242 4242 4242 4242)
9. Thanh toán thành công -> redirect về `/book-room/success?session_id=...`
10. Trang success:
    - Gọi `POST /api/verify-payment` -> kiểm tra Stripe Session
    - Cập nhật `paymentStatus: "true"` trong DB
    - Hiển thị thông báo, auto-redirect về `/my-bookings` sau 3 giây
11. Thanh toán thất bại -> redirect về `/hotel-details/[hotelId]`

### Luồng phụ: Stripe Elements (inline payment)

- Dùng trong trường hợp người dùng thanh toán lại từ trang `/my-bookings`
- Sử dụng Zustand store (`useBookRoom`) với persist middleware để giữ `clientSecret` và `bookingData` xuyên các trang
- Hiển thị Stripe PaymentElement + AddressElement trong `RoomPaymentForm`

---

## Kiến trúc Component

### Server Components (RSC)
- `RootLayout` -- Providers, font, navbar, container, toaster
- `Home (page.tsx)` -- Fetch hotels, render `HotelList` + `LocationFilter`
- `HotelDetails (page.tsx)` -- Fetch hotel + bookings + user, render `HotelDetailsClient`
- `HotelPage (page.tsx)` -- Fetch hotel (hoặc null cho "new"), requireAuth, render `AddHotelForm`
- `MyBookingsPage` -- Fetch user's bookings + owner's bookings, render `MyBookingClient`
- `MyHotelsPage` -- Fetch user's hotels, render `HotelList`
- `AuthLayout`, `SignInPage`, `SignUpPage` -- Thin wrappers

### Client Components
- `Navbar` -- Fetch user state on route change, responsive mobile menu
- `NavMenu` -- Dropdown navigation cho authenticated users
- `SearchInput` -- Debounced search (300ms), URL sync, chỉ hiển thị trên "/"
- `LocationFilter` -- Province/district selects, URL searchParams sync
- `LoginForm`, `SignUpForm` -- Form state, Zod validation, API calls
- `HotelCard` -- Conditional rendering (link vs edit view based on pathname)
- `HotelDetailsClient` -- Amenity mapping, room grid
- `AddHotelForm` -- Complex form: image upload, location cascading selects, room management dialog
- `RoomCard` -- Date picker, booking overlap check, Stripe payment, edit/delete
- `AddRoomForm` -- Room form with bed validation, image upload
- `DateRangePicker` -- Calendar with disabled dates, Vietnamese locale
- `MyBookingClient` -- Booking display with payment retry
- `BookRoomClient` -- Stripe Elements wrapper
- `RoomPaymentForm` -- Stripe PaymentElement + AddressElement submission
- `ModeToggle` -- Theme switcher dropdown

### Data Flow Patterns
1. **Server Actions** (`actions/`) -- Direct Prisma queries, called from Server Components
2. **API Routes** (`app/api/`) -- REST endpoints cho mutations, required auth via `getCurrentUser()`
3. **Client-side fetching** -- Components use `fetch`/`axios` to API routes
4. **Zustand (useBookRoom)** -- Persisted store cho Stripe Elements payment flow

---

## Chi tiết UI/UX

### Hệ thống thiết kế
- **Primary color**: Purple (`oklch(0.491 0.27 292.581)`) -- purple shade
- **Theme**: shadcn/ui Radix Maia style
- **CSS**: Tailwind CSS v4 with CSS-driven configuration (`@theme inline` directives)
- **Radius scale**: Base `0.625rem`, scaled từ `sm` (0.6x) đến `4xl` (2.6x)
- **Dark mode**: `.dark` class with inverted color palette
- **Scrollbar**: Hidden globally (`scrollbar-width: none`)
- **Font**: Inter (next/font/google)

### Form UX
- Tất cả trường đều **bắt buộc** (không có trường tùy chọn)
- Tiện ích yêu cầu **ít nhất 1 checkbox** được chọn
- Khi loading: toàn bộ form opacity 80% + pointer-events-none + disabled inputs
- Transition: 300ms
- Image upload: preview URL.createObjectURL, drag-and-drop style zone
- Location: cascading selects (chọn tỉnh -> load huyện)
- Toast notifications cho success/error

### Validation (Zod)
- **Hotel form**: title >= 3 chars, description >= 10 chars, locationDescription >= 10 chars, image required, state + city required, amenities >= 1
- **Room form**: title >= 3 chars, description >= 10 chars, image required, bedCount >= 1, guestCount >= 1, bathroomCount >= 1, roomPrice >= 1, kingBed + queenBed == bedCount, amenities >= 1

---

## Cách cài đặt và chạy

### Yêu cầu
- Node.js 18+
- MariaDB/MySQL database
- Tài khoản Stripe (publishable key + secret key)
- Tài khoản UploadThing

### Các bước

```bash
# 1. Clone repository
git clone <repo-url>
cd 3-st-survey

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env từ mẫu
cp .env.example .env

# 4. Điều chỉnh biến môi trường trong .env
#   DATABASE_URL: MariaDB connection string
#   SESSION_SECRET: Chuỗi bí mật cho JWT
#   UPLOADTHING_TOKEN: Token từ UploadThing
#   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Stripe publishable key (pk_test_...)
#   STRIPE_SECRET_KEY: Stripe secret key (sk_test_...)
#   NEXT_PUBLIC_APP_URL: URL ứng dụng (VD: http://localhost:3000)

# 5. Tạo database schema
npx prisma db push

# 6. (Nếu muốn) Seed dữ liệu
# npx prisma db seed

# 7. Chạy development
npm run dev
```

Mở `http://localhost:3000` trên trình duyệt.

### Build cho production

```bash
npm run build
npm start
```

### Scripts trong package.json

| Script | Command | Mô tả |
|---|---|---|
| `dev` | `next dev` | Chạy dev server (trước đó kill port 3000) |
| `build` | `next build` | Build production |
| `start` | `next start` | Chạy production server |
| `lint` | `eslint` | Lint với ESLint |
| `lint2` | `biome lint --write` | Lint với Biome |
| `format` | `biome format --write` | Format code với Biome |
| `check` | `biome check --write` | Kiểm tra + format với Biome |
| `check2` | `biome check --write --unsafe` | Check với unsafe fixes |
| `postinstall` | `prisma generate` | Tự động generate Prisma client sau npm install |
| `predev` | `npx kill-port 3000` | Kill port 3000 trước khi dev |

### Biến môi trường

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `DATABASE_URL` | Yes | MariaDB connection string (VD: `mysql://user:pass@host:3306/db`) |
| `SESSION_SECRET` | Yes | Chuỗi bí mật để ký JWT (VD: `random-string-at-least-32-chars`) |
| `UPLOADTHING_TOKEN` | Yes | API token từ UploadThing dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (bắt đầu bằng `pk_`) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (bắt đầu bằng `sk_`) |
| `NEXT_PUBLIC_APP_URL` | No | URL ứng dụng (mặc định `http://localhost:3000`) |

---

## Middleware (proxy.ts)

File `proxy.ts` (Next.js middleware) chạy trên tất cả route trừ:
- `api/auth/*` -- cho phép đăng ký/đăng nhập không cần auth
- `api/uploadthing/*` -- UploadThing callback
- `_next/*`, `favicon.ico` -- Static assets

**Public routes**: `/`, `/sign-in`, `/sign-up`, `/hotel-details/*`

**Logic**:
1. Đọc `session_token` cookie
2. Verify JWT bằng `jose`
3. Nếu authenticated + vào `/sign-in` hoặc `/sign-up` -> redirect về `/`
4. Nếu authenticated + vào protected route -> cho phép
5. Nếu không authenticated + vào protected route -> redirect về `/sign-in`

---

## Lưu ý quan trọng

1. **Next.js version**: Dự án sử dụng Next.js 16.2.7 -- đây là phiên bản mới nhất có thể có breaking changes so với tài liệu chuẩn. Đọc hướng dẫn trong `node_modules/next/dist/docs/` trước khi code.
2. **Database relation mode**: `relationMode = "prisma"` -- Prisma xử lý relations trong memory thay vì database foreign keys.
3. **Zod version**: ^4.4.3 -- API có thể khác với Zod 3.x.
4. **Tailwind CSS v4**: Không dùng `tailwind.config.js` -- cấu hình hoàn toàn bằng CSS (`@theme inline`, `@custom-variant`).
5. **Stripe payment**: Booking record được tạo NGAY KHI TẠO Checkout Session (trước khi thanh toán). Nếu người dùng đóng trình duyệt trước khi quay lại trang success, `paymentStatus` sẽ không được cập nhật.
6. **UploadThing callback**: Trong môi trường dev, UploadThing có thể gặp lỗi callback. Đã exclude `/api/uploadthing` khỏi proxy matcher.
7. **Env file**: `.env` file được commit (chứa thông tin dev DB). Đây là cấu hình có chủ ý cho môi trường phát triển.
8. **Không có test**: Dự án chưa có testing framework (không Jest, Vitest, Playwright).

---

## Tài liệu tham khảo

- `HOTEL_CRUD.md` -- Quy trình CRUD khách sạn & phòng (validation, API, upload, location)
- `BOOKING-FLOW.md` -- Chi tiết luồng đặt phòng & thanh toán (Stripe, overlap check, API)
- `prisma/schema.prisma` -- Database schema đầy đủ
