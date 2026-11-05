# Database Design

Status: final. Ready to be implemented as entities in Step 8.

## Global Decisions

| Topic                 | Decision                                                                                          | Reason                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Primary keys          | UUID v4 on all tables (`@PrimaryGeneratedColumn("uuid")`)                                         | Uniform and simple. At single-cafe scale v4 vs v7 performance difference is not measurable; v7 would need an extra dependency and custom generation. Revisit only if tables reach millions of rows; switching later needs no schema change |
| Table identification  | Separate `tables.qr_token` (unique, random)                                                       | QR can be rotated without touching table id or order history                                                                                                                                                                               |
| Money                 | `int` (unsigned), unit = Rial                                                                     | No float errors. Avoid `bigint` (TypeORM returns it as string)                                                                                                                                                                             |
| Deleting products     | Real delete + `is_active` flag                                                                    | Delete = gone forever; `is_active` = temporarily unavailable                                                                                                                                                                               |
| Order history safety  | Snapshot of name, price, options in `order_items`; snapshot of amounts in `orders`                | Past orders never change when prices or settings change                                                                                                                                                                                    |
| Category deactivation | Does NOT modify products. Menu shows a product only if `product.is_active AND category.is_active` | Single source of truth; reactivation restores exact previous state                                                                                                                                                                         |
| Category deletion     | `RESTRICT` when it has products                                                                   | Data integrity                                                                                                                                                                                                                             |
| Table busy state      | Not stored; computed from open orders                                                             | Avoid two sources of truth                                                                                                                                                                                                                 |
| Roles                 | Single enum column on `users` (`admin`, `staff`)                                                  | Few roles, no need for roles/permissions tables                                                                                                                                                                                            |
| Settings              | One row with typed columns                                                                        | Single cafe, typed and validated                                                                                                                                                                                                           |
| Order number          | Daily number (`order_date` + `order_number`), UUID stays the PK                                   | Kitchen-friendly numbers (1, 2, 3, ...) that restart every day                                                                                                                                                                             |
| Order status          | Single enum including `cancelled`                                                                 | One source of truth; "open orders" filter stays simple                                                                                                                                                                                     |
| Column naming         | `snake_case` in DB (mapping in entities decided in Step 8)                                        |                                                                                                                                                                                                                                            |
| Client trust          | Prices, totals, roles are never taken from the client                                             | Server computes everything                                                                                                                                                                                                                 |

Every table has `created_at` and `updated_at` unless noted.

## users

| Column                 | Type                   | Constraints            |
| ---------------------- | ---------------------- | ---------------------- |
| id                     | uuid                   | PK                     |
| full_name              | varchar(100)           | not unique             |
| username               | varchar(50)            | unique                 |
| password               | varchar(255)           | bcrypt hash only       |
| role                   | enum(`admin`, `staff`) | default `staff`        |
| avatar                 | varchar(255)           | nullable (path or URL) |
| is_active              | boolean                | default true           |
| created_at, updated_at | datetime               |                        |

## categories

| Column                 | Type         | Constraints  |
| ---------------------- | ------------ | ------------ |
| id                     | uuid         | PK           |
| name                   | varchar(100) |              |
| slug                   | varchar(120) | unique       |
| description            | varchar(255) | nullable     |
| image                  | varchar(255) | nullable     |
| is_active              | boolean      | default true |
| created_at, updated_at | datetime     |              |

## products

| Column                 | Type         | Constraints                                          |
| ---------------------- | ------------ | ---------------------------------------------------- |
| id                     | uuid         | PK                                                   |
| category_id            | uuid         | FK → categories.id, `ON DELETE RESTRICT`             |
| name                   | varchar(100) |                                                      |
| slug                   | varchar(120) | unique                                               |
| price                  | int unsigned | Rial                                                 |
| description            | varchar(500) | nullable                                             |
| image                  | varchar(255) | nullable                                             |
| is_active              | boolean      | default true (also covers "temporarily unavailable") |
| created_at, updated_at | datetime     |                                                      |

## product_options

Options belong to one product (one-to-many).

| Column                 | Type                             | Constraints                           |
| ---------------------- | -------------------------------- | ------------------------------------- |
| id                     | uuid                             | PK                                    |
| product_id             | uuid                             | FK → products.id, `ON DELETE CASCADE` |
| name                   | varchar(100)                     | e.g. "Large", "Almond milk"           |
| type                   | enum(`size`, `addon`, `removal`) |                                       |
| price_delta            | int                              | default 0 (0 for removals)            |
| is_active              | boolean                          | default true                          |
| created_at, updated_at | datetime                         |                                       |

## tables

| Column                 | Type         | Constraints               |
| ---------------------- | ------------ | ------------------------- |
| id                     | uuid         | PK                        |
| number                 | int unsigned | unique                    |
| qr_token               | varchar(64)  | unique, random (`crypto`) |
| is_active              | boolean      | default true              |
| created_at, updated_at | datetime     |                           |

Tables are deactivated, not deleted, once they have orders.

## orders

| Column                 | Type                                                            | Constraints                                            |
| ---------------------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| id                     | uuid                                                            | PK                                                     |
| order_date             | date                                                            | business date, Asia/Tehran                             |
| order_number           | int unsigned                                                    | daily number, starts at 1 each day                     |
| table_id               | uuid                                                            | FK → tables.id, `ON DELETE RESTRICT`                   |
| status                 | enum(`pending`, `preparing`, `ready`, `delivered`, `cancelled`) | default `pending`                                      |
| subtotal               | int unsigned                                                    | sum of items (incl. options)                           |
| tax_amount             | int unsigned                                                    | snapshot at order time                                 |
| service_amount         | int unsigned                                                    | snapshot at order time                                 |
| total_amount           | int unsigned                                                    | `subtotal + tax_amount + service_amount`               |
| description            | varchar(500)                                                    | nullable, customer note                                |
| cancel_reason          | varchar(255)                                                    | nullable, required when status is `cancelled` by staff |
| created_at, updated_at | datetime                                                        |                                                        |

Constraint: `UNIQUE(order_date, order_number)`.

All amounts are computed on the server in a single function, rounded once.

### Order number generation

- Done inside the order-creation transaction: `MAX(order_number) + 1` for today's `order_date`.
- If the unique constraint is violated (two simultaneous orders), retry once.
- "Today" is computed in the cafe's timezone (Asia/Tehran), not UTC.
- Assumption: the business day ends at midnight. Confirm with the client; if the cafe works past midnight, the day boundary must come from `settings`.

### Order status transitions

| From                     | To                                                 |
| ------------------------ | -------------------------------------------------- |
| `pending`                | `preparing`, `cancelled` (customer or staff)       |
| `preparing`              | `ready`, `cancelled` (staff only, with reason)     |
| `ready`                  | `delivered`, `cancelled` (staff only, with reason) |
| `delivered`, `cancelled` | none (final)                                       |

- No backward transitions (KISS). If needed later, add a separate admin-only endpoint.
- The transition map lives in code, not in the database.
- **Open order** = `pending`, `preparing` or `ready`.

## order_items

| Column                 | Type         | Constraints                                      |
| ---------------------- | ------------ | ------------------------------------------------ |
| id                     | uuid         | PK                                               |
| order_id               | uuid         | FK → orders.id, `ON DELETE CASCADE`              |
| product_id             | uuid         | nullable, FK → products.id, `ON DELETE SET NULL` |
| product_name           | varchar(100) | snapshot                                         |
| unit_price             | int unsigned | snapshot (base price, without options)           |
| quantity               | int unsigned | min 1                                            |
| note                   | varchar(255) | nullable                                         |
| selected_options       | json         | snapshot list of `{name, type, priceDelta}`      |
| created_at, updated_at | datetime     |                                                  |

Client sends only `productId`, `quantity`, `optionIds`, `note`. Server reads prices from DB and writes the snapshot.

## settings

Single row, created by seed. The service always reads/updates that row.

| Column                 | Type             | Constraints              |
| ---------------------- | ---------------- | ------------------------ |
| id                     | uuid             | PK                       |
| cafe_name              | varchar(100)     |                          |
| logo                   | varchar(255)     | nullable                 |
| opening_time           | time             |                          |
| closing_time           | time             |                          |
| tax_percent            | tinyint unsigned | whole percent, default 0 |
| service_percent        | tinyint unsigned | whole percent, default 0 |
| created_at, updated_at | datetime         |                          |

## service_requests

Created by customers through `qr_token` (no login).

| Column                 | Type                        | Constraints                          |
| ---------------------- | --------------------------- | ------------------------------------ |
| id                     | uuid                        | PK                                   |
| table_id               | uuid                        | FK → tables.id, `ON DELETE RESTRICT` |
| type                   | enum(`waiter`, `bill`)      |                                      |
| status                 | enum(`pending`, `resolved`) | default `pending`                    |
| resolved_at            | datetime                    | nullable                             |
| created_at, updated_at | datetime                    |                                      |

## Relationships

```
categories 1 ── N products 1 ── N product_options
tables     1 ── N orders   1 ── N order_items ── (nullable) products
tables     1 ── N service_requests
```

## Indexes

Principle: data volume is small (a single cafe), so add only indexes that serve a real, frequent query.

**Already indexed automatically (no extra work):**

- All primary keys
- All `UNIQUE` columns: `users.username`, `categories.slug`, `products.slug`, `tables.number`, `tables.qr_token`
- All foreign key columns (InnoDB creates an index for each FK): `products.category_id`, `product_options.product_id`, `orders.table_id`, `order_items.order_id`, `order_items.product_id`, `service_requests.table_id`
- `UNIQUE(order_date, order_number)` on `orders`; its leftmost column also serves date filters and "today's orders"

**Added explicitly:**

| Table            | Index                  | Serves                                     |
| ---------------- | ---------------------- | ------------------------------------------ |
| orders           | `(status, created_at)` | Live team panel: open orders, newest first |
| service_requests | `(status, created_at)` | Pending waiter/bill requests               |

**Deliberately NOT added:**

| Candidate                                    | Why not                                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `products.is_active`, `categories.is_active` | Boolean has very low selectivity and tables have tens of rows; a full scan is as fast. `category_id` FK index already serves the menu join |
| `orders.order_date` alone                    | Redundant: the leftmost column of `UNIQUE(order_date, order_number)` already covers it                                                     |
| `tables.qr_token` extra index                | Already created by the unique constraint                                                                                                   |

Revisit with `EXPLAIN` if a query becomes slow after real data exists.

## Business Rules To Enforce In Services (not in DB)

- **Menu:** a product is visible only if `product.is_active` and `category.is_active`.
- **Placing an order:** product and its category must both be active; options must belong to that product and be active. Prices are read from the DB, never from the client.
- **Advancing status (one "next step" endpoint):**
  - Client sends the order id and the `expectedStatus` it sees.
  - Update atomically: `UPDATE orders SET status = :next WHERE id = :id AND status = :expected`.
  - Zero affected rows → `409 Conflict` (prevents double clicks skipping a stage).
- **Customer cancel:** allowed only while `pending`, via conditional update `... WHERE id = :id AND status = 'pending'`. Zero affected rows → "no longer cancellable". Authorized by `orderId` (UUID) together with the table's `qr_token`.
- **Staff cancel:** allowed from `pending`, `preparing`, `ready`; `cancel_reason` is required; not allowed after `delivered`.
- **Deleting a product:** rejected if it appears in any open order; the check and delete run in one transaction with locking. Closed orders are safe because of the snapshot and `SET NULL`.
- **Deleting a category:** rejected while it has products (`RESTRICT`, mapped to `ConflictError` in Step 9).

## Decided Later (Step 8)

- Whether a `BaseEntity` (id, created_at, updated_at) genuinely reduces repetition
- Column name mapping (`snake_case`) in entities
