# Burgon — Restaurant Management System
> Full-stack restaurant management system built with Express + TypeORM + PostgreSQL + Redis + Angular (Nebular UI)
> Structure follows the same pattern as QSIM (Inovant Solutions internal standard)

---

## Project Overview

Burgon is a hands-on system design learning project covering caching, async processing,
idempotency, real-time notifications, WebSockets, and horizontal scaling — built as a
real-world restaurant management system.

### Modules
- Auth & RBAC (JWT + role-based permissions)
- Table & reservation management
- Menu management → **GraphQL** (Apollo Server)
- Order flow with state machine + real-time KDS (Kitchen Display System)
- Billing, split-bill, payment integration (Tap / Stripe)
- Inventory & stock tracking with low-stock alerts
- Staff shift & attendance management
- Notifications (email, push, WhatsApp)

### User Roles
- `customer` — QR-based dine-in ordering
- `waiter` — take and manage orders on floor
- `kitchen` — live KDS view
- `cashier` — billing and payments
- `admin` — full dashboard, reports, config

---

## Tech Stack
- **Backend:** Node.js + Express + TypeORM + TypeDI
- **Database:** PostgreSQL
- **Cache:** Redis
- **Queue:** BullMQ
- **Real-time:** Socket.IO
- **GraphQL:** Apollo Server (menu module only)
- **Frontend:** Angular with Nebular UI
- **Deployment:** AWS EC2 + Nginx + PM2

---

## Project Structure

```
burgon/
├── CLAUDE.md
├── README.md
│
├── api/                              # Express backend (port 3000)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── .env.example
│   │
│   ├── emailTemplates/               # Handlebars HTML email templates
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── order-confirmed.html
│   │   ├── bill-receipt.html
│   │   ├── low-stock-alert.html
│   │   └── shift-reminder.html
│   │
│   └── src/
│       ├── app.ts                    # Entry point — runs all loaders
│       ├── data-source.ts            # TypeORM AppDataSource
│       │
│       ├── config/                   # App-level config
│       │   ├── config.ts             # env vars
│       │   ├── redis.ts              # Redis client
│       │   ├── socket.ts             # Socket.IO server init
│       │   └── param.ts              # Shared constants
│       │
│       ├── loaders/                  # Bootstrap modules (run in order from app.ts)
│       │   ├── winstonLoader.ts      # Logger init
│       │   ├── iocLoader.ts          # TypeDI container wiring
│       │   ├── typeormLoader.ts      # DB connection
│       │   ├── expressLoader.ts      # Main express app setup + routing
│       │   ├── graphqlLoader.ts      # Apollo Server setup (menu GraphQL)
│       │   ├── socketLoader.ts       # Socket.IO init + KDS room setup
│       │   └── bullmqLoader.ts       # BullMQ workers init
│       │
│       ├── controllers/              # Route handlers (admin/internal API)
│       │   ├── AuthController.ts
│       │   ├── TableController.ts
│       │   ├── ReservationController.ts
│       │   ├── OrderController.ts
│       │   ├── BillingController.ts
│       │   ├── InventoryController.ts
│       │   ├── StaffController.ts
│       │   ├── ShiftController.ts
│       │   └── ReportController.ts
│       │
│       ├── services/                 # Business logic layer
│       │   ├── AuthService.ts
│       │   ├── TableService.ts
│       │   ├── ReservationService.ts
│       │   ├── OrderService.ts
│       │   ├── BillingService.ts
│       │   ├── InventoryService.ts
│       │   ├── StaffService.ts
│       │   ├── ShiftService.ts
│       │   ├── NotificationService.ts
│       │   ├── EmailService.ts
│       │   └── ReportService.ts
│       │
│       ├── models/                   # TypeORM entities
│       │   ├── User.ts
│       │   ├── Role.ts
│       │   ├── AuthItem.ts           # RBAC permission items
│       │   ├── AuthAssignment.ts     # RBAC user-role mapping
│       │   ├── Table.ts
│       │   ├── Reservation.ts
│       │   ├── MenuCategory.ts
│       │   ├── MenuItem.ts
│       │   ├── MenuItemVariant.ts
│       │   ├── MenuItemModifier.ts
│       │   ├── Order.ts
│       │   ├── OrderItem.ts
│       │   ├── OrderStatusLog.ts     # State machine audit log
│       │   ├── Bill.ts
│       │   ├── BillItem.ts
│       │   ├── Payment.ts
│       │   ├── PaymentWebhook.ts     # Idempotency — raw webhook log
│       │   ├── InventoryItem.ts
│       │   ├── InventoryLog.ts       # Stock change audit
│       │   ├── Staff.ts
│       │   ├── Shift.ts
│       │   └── Attendance.ts
│       │
│       ├── graphql/                  # Menu module — GraphQL only
│       │   ├── schema/
│       │   │   └── menu.graphql      # Type definitions
│       │   ├── resolvers/
│       │   │   ├── MenuCategoryResolver.ts
│       │   │   ├── MenuItemResolver.ts
│       │   │   └── MenuModifierResolver.ts
│       │   └── dataloaders/
│       │       └── MenuDataLoader.ts # Solves N+1 query problem
│       │
│        ├── microservices/            # Public-facing APIs (customer-facing)
│       │   └── v1/
│       │       ├── customer/                          # Customer website API (port 3001)
│       │       │   ├── customerServiceLoader.ts       # Express app on port 3001
│       │       │   └── controllers/
│       │       │       ├── CustomerAuthController.ts  # Register, login, OTP verify
│       │       │       ├── CustomerMenuController.ts  # Browse menu (Redis cached)
│       │       │       ├── CustomerOrderController.ts # Place order, track order status
│       │       │       ├── CustomerTableController.ts # QR scan → get table info
│       │       │       └── CustomerBillController.ts  # View bill, initiate payment
│       │       └── kds/
│       │           ├── kdsServiceLoader.ts            # Express app on port 3002
│       │           └── controllers/
│       │               └── KdsController.ts           # Kitchen display — order queue
│       │
│       ├── middlewares/              # Express middleware / guards
│       │   ├── CheckJwtMiddleware.ts          # Staff/admin JWT auth
│       │   ├── CheckCustomerJwtMiddleware.ts  # Customer JWT auth
│       │   ├── CheckPermissionMiddleware.ts   # RBAC role guard
│       │   ├── RedisRateLimiterMiddleware.ts  # Rate limiting via Redis
│       │   ├── IdempotencyMiddleware.ts       # Payment idempotency key check
│       │   ├── ApiLoggerMiddleware.ts         # Request logger
│       │   └── ErrorHandlerMiddleware.ts      # Global error handler
│       │
│       ├── helpers/                  # Integrations and reusable utilities
│       │   ├── ApiHelper.ts          # sendSuccessResponse / sendErrorResponse / pagination
│       │   ├── MailHelper.ts         # Nodemailer + Handlebars
│       │   ├── RedisHelper.ts        # get/set/del with TTL wrappers
│       │   ├── QrHelper.ts           # QR code generation per table
│       │   ├── S3Helper.ts           # Cloudinary / S3 image uploads
│       │   ├── WhatsAppHelper.ts     # WhatsApp notification
│       │   └── Payments/
│       │       ├── TapHelper.ts      # Tap payment gateway
│       │       └── StripeHelper.ts   # Stripe payment gateway
│       │
│       ├── interfaces/               # TypeScript contracts
│       │   ├── IControllerInterface.ts
│       │   ├── ICrudInterface.ts
│       │   └── IServiceInterface.ts
│       │
│       ├── lib/                      # Cross-cutting framework code
│       │   ├── env/
│       │   │   ├── index.ts          # sendSuccessResponse / sendErrorResponse
│       │   │   ├── OrderEnum.ts      # Order state machine enum
│       │   │   ├── RoleEnum.ts       # User role enum
│       │   │   ├── PaymentEnum.ts    # Payment status enum
│       │   │   └── utils.ts
│       │   └── logger/
│       │       ├── Logger.ts
│       │       └── index.ts
│       │
│       ├── queue/                    # BullMQ job definitions and workers
│       │   ├── jobs/
│       │   │   ├── EmailJob.ts       # Send receipt / alert emails
│       │   │   ├── LowStockJob.ts    # Inventory threshold check
│       │   │   └── NotifyJob.ts      # Push / WhatsApp notifications
│       │   └── workers/
│       │       ├── EmailWorker.ts
│       │       ├── LowStockWorker.ts
│       │       └── NotifyWorker.ts
│       │
│       ├── socket/                   # Socket.IO event handlers
│       │   ├── kdsHandler.ts         # Kitchen order events (new order, status change)
│       │   └── orderHandler.ts       # Customer order tracking events
│       │
│       └── migrations/               # TypeORM migration files
│           └── (auto-generated)
│
└── web/                              # Angular frontend
    ├── package.json
    └── src/
        └── app/
            ├── core/                 # Guards, interceptors, auth service
            ├── shared/               # Nebular UI module, shared components
            └── modules/
                ├── auth/
                ├── customer/         # QR ordering portal (mobile-first)
                ├── waiter/
                ├── kitchen/          # KDS live view (Socket.IO)
                ├── cashier/
                └── admin/            # Dashboard, reports, config
```

---

## Code Style Rules — ALWAYS FOLLOW THESE

### TypeScript / Node.js
- Use `let` over `const` for all variables
- Use `for...of` loops — never `.map()` or `.filter()`
- Use `async/await` only — never `.then()` chains
- Use descriptive variable names reflecting data context (e.g. `orderDetails`, `menuItemList`)
- Include section divider comments: `// ---- Fetch order ----`
- Prefer minimal, targeted changes — never large rewrites
- Never use `any` type — always type explicitly

### Database / TypeORM
- Always include `is_deleted = 0` conditions in all queries
- Use `LEFT JOIN` only when joining tables — never INNER JOIN
- Always use migrations — never `synchronize: true`
- Add indexes on all foreign keys and frequently queried columns
- Descriptive column names matching business context

### API Responses — always use this exact shape
```ts
// Success
sendSuccessResponse(res, 200, 'Order fetched', data)

// Error
sendErrorResponse(res, 400, 'Table not available')
```

### API Design
- Validate all request bodies with class-validator DTOs
- All routes go through auth middleware except public ones
- Use proper HTTP status codes

### Angular / Frontend
- Use Nebular UI components only — never Angular Material
- `ngClass`-driven active/inactive navigation with icons before text
- Use `ng-select` for dropdowns and time selection
- Never use native selects or time pickers
- Never mutate original templates

### Gender
- Store as `'M'` / `'F'`

---

## Customer Microservice Rules (port 3001)
- ALL customer website API calls go through `microservices/v1/customer/` — never through the internal `controllers/`
- Customer controllers are THIN — they only handle auth, validation, and call the shared service
- Never duplicate business logic in customer controllers — always reuse `src/services/`
- Protected by `CheckCustomerJwtMiddleware` only — no RBAC/permission check needed
- All menu responses must go through Redis cache first (`RedisHelper.get`) before hitting DB
- Customer never gets access to internal fields (cost price, staff notes, admin flags)

```
CustomerMenuController   → calls → MenuService     (same service admin uses)
CustomerOrderController  → calls → OrderService    (same service waiter uses)
CustomerBillController   → calls → BillingService  (same service cashier uses)
CustomerTableController  → calls → TableService    (same service admin uses)
```

### Customer API Endpoints (port 3001)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/customer/auth/register | Customer register |
| POST | /v1/customer/auth/login | Customer login |
| POST | /v1/customer/auth/verify-otp | OTP verification |
| GET | /v1/customer/table/:qrCode | Get table info from QR scan |
| GET | /v1/customer/menu | Get full menu (Redis cached) |
| GET | /v1/customer/menu/:categoryId | Get items by category |
| POST | /v1/customer/order | Place new order |
| GET | /v1/customer/order/:id | Track order status |
| GET | /v1/customer/bill/:tableId | View current bill |
| POST | /v1/customer/bill/:id/pay | Initiate payment |

---

## Order State Machine
```
PENDING → CONFIRMED → PREPARING → READY → SERVED → COMPLETED
                                              ↓
                                           CANCELLED (from any state except COMPLETED)
```
Every state change is logged to `OrderStatusLog` table with timestamp and changed_by.

---

## System Design Concepts Per Phase

| Phase | Focus | SD Concept |
|-------|-------|-----------|
| 1 | Auth + Tables | REST design, DB schema, JWT, RBAC, indexing |
| 2 | Menu (GraphQL) | GraphQL schema, resolvers, DataLoader, N+1 problem, Redis cache |
| 3 | Orders + KDS | State machine, ACID transactions, WebSockets, race conditions |
| 4 | Billing + Inventory | Idempotency, BullMQ, async jobs, webhook handling, retry logic |
| 5 | Staff + Deploy | Rate limiting, horizontal scaling, Nginx, PM2 cluster, DB replication |

---

## Environment Variables (api/.env)
```
PORT=3000
CUSTOMER_PORT=3001
KDS_PORT=3002

DB_HOST=localhost
DB_PORT=5432
DB_NAME=burgon_db
DB_USER=postgres
DB_PASSWORD=

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

TAP_SECRET_KEY=
STRIPE_SECRET_KEY=
```

---

## Git Rules — ALWAYS FOLLOW THESE
- After completing every task or feature, automatically commit the changes
- Use clear, descriptive commit messages in this format:
  ```
  feat(module): what was built
  fix(module): what was fixed
  chore: what was set up
  ```
- Examples:
  ```
  chore: scaffold base project structure and loaders
  feat(auth): add JWT middleware and user entity
  feat(table): add table CRUD endpoints
  fix(order): resolve duplicate webhook idempotency issue
  ```
- Never commit `node_modules/`, `.env`, or build files
- Always commit after: scaffold, new entity, new controller, new service, migration, bug fix
- Do NOT push automatically — only commit. Nabeel will push manually.

---

## Current Phase
**Phase 1 — Foundation & Auth**
- [ ] Scaffold api/ and web/ folders
- [ ] TypeORM DataSource + PostgreSQL connection
- [ ] Winston logger + loaders pattern (winstonLoader, typeormLoader, expressLoader)
- [ ] JWT auth with refresh tokens
- [ ] Role-based middleware (CheckJwtMiddleware, CheckPermissionMiddleware)
- [ ] User model + AuthItem + AuthAssignment (RBAC)
- [ ] Table model + CRUD (TableController + TableService)
- [ ] Reservation model + CRUD
- [ ] sendSuccessResponse / sendErrorResponse helpers in lib/env/index.ts
