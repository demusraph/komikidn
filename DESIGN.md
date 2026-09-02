# 🛍️ DESIGN.md: Shopify Design System for Komik Clean Reader

> Applied from `awesome-design-md` (Shopify specification) — combining Shopify's high-end cinematic dark canvas for reader & media immersion with the signature Aloe Mint (`#c1fbd4`), Pistachio (`#d4f9e0`), and pill button geometry.

---

## 1. Visual Theme & Atmosphere
* **Canvas Polarity:** Deep Cinematic Night (`#000000` / `#0a0a0a`) with elevated surfaces (`#111822` / `#1e2c31`) and crisp hairline borders (`rgba(255,255,255,0.08)`).
* **Hero & Accent Signature:** Shopify **Aloe Mint (`#c1fbd4`)** & **Pistachio (`#d4f9e0`)** used for badges, active states, and primary pill CTAs.
* **Component Geometry:** **100% Pill Shapes (`rounded-full` / 9999px)** for all buttons, search inputs, badges, and navigation toggles. Rounded rectangles (`rounded-2xl` / 16px) reserved exclusively for product/comic cards.
* **Typographic DNA:** Thin-cut Display headings (weight 300–400) with air tracking, paired with ultra-clean Inter body text (weights 420–550) and `font-feature-settings: "ss03"`.

---

## 2. Color Palette & Functional Roles

| Token Name | Hex Value | Role in Komik Reader |
| :--- | :--- | :--- |
| `canvas-night` | `#000000` | Main application background & reader canvas |
| `canvas-night-elevated` | `#0a0e17` | Card background & floating panel surface |
| `surface-elevated-dark` | `#131b26` | Card container & navbar background |
| `surface-hover` | `#1b2636` | Interactive hover surface |
| `aloe-10` (Shopify Mint) | `#c1fbd4` | Primary brand accent, active tags, featured pills |
| `pistachio-10` | `#d4f9e0` | Secondary highlight, reading progress pill |
| `ink-dark` | `#000000` | Text on aloe mint pills & bright badges |
| `on-dark` | `#ffffff` | Primary text on dark surfaces |
| `shade-30` | `#d4d4d8` | Subtitle / high-contrast secondary text |
| `shade-40` | `#a1a1aa` | Muted metadata text & icons |
| `shade-50` | `#71717a` | Placeholder text |
| `shade-70` | `#27272a` | Pressed button state & dark pill background |
| `hairline-dark` | `rgba(255,255,255,0.08)` | 1px subtle borders on cards & dividers |

---

## 3. Typography Scale & Weights

* **Display XXL (Hero):** 36px–48px / Weight 300 / Line-height 1.1 / Tracking 0.5px
* **Heading XL (Detail Titles):** 24px–30px / Weight 400 / Line-height 1.2
* **Heading LG (Section Titles):** 20px–24px / Weight 500 / Line-height 1.3
* **Body Strong (Card Titles):** 15px / Weight 550 / Line-height 1.4
* **Body Regular (Synopsis):** 14px / Weight 420 / Line-height 1.6
* **Caption / Timestamp:** 12px / Weight 500 / Line-height 1.4
* **Eyebrow Cap (Badges):** 11px / Weight 600 / Tracking 0.72px / Uppercase

---

## 4. Shopify Component Hierarchy

### 4.1 Buttons
* **`button-aloe-pill`**: `bg-[#c1fbd4] text-[#000000] font-semibold rounded-full px-6 py-2.5 hover:bg-[#aef7c5] shadow-lg shadow-[#c1fbd4]/10`
* **`button-outline-on-dark`**: `bg-transparent border border-white/20 text-white rounded-full px-5 py-2 hover:border-white hover:bg-white/5`
* **`button-dark-pill`**: `bg-[#1e2c31] text-white rounded-full px-5 py-2 border border-white/10 hover:bg-[#283b42]`

### 4.2 Cards
* **`card-photo-frame`**: Cover comic container with `rounded-2xl`, 1px `border-white/10`, and subtle top sheen `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`.
* **`card-comic`**: Elevated container `#0a0e17` with hairline border, smooth hover translation, and bottom metadata row.

### 4.3 Tags & Badges
* **`pill-tag-aloe`**: `bg-[#c1fbd4]/15 text-[#c1fbd4] border border-[#c1fbd4]/30 rounded-full px-3 py-0.5 text-xs font-semibold`
* **`pill-tag-dark`**: `bg-white/10 text-white/90 border border-white/15 rounded-full px-3 py-0.5 text-xs font-medium`

---

## 5. Do's and Don'ts
* ✅ **DO**: Use rounded pills (`rounded-full`) for ALL buttons, inputs, tags, and pagination controls.
* ✅ **DO**: Pair pure black (`#000000`) and elevated dark navy/teal (`#131b26`) with Shopify Aloe Mint (`#c1fbd4`).
* ✅ **DO**: Keep display headlines thin (weight 300–400) for high-end editorial elegance.
* ❌ **DON'T**: Use heavy generic square buttons with `rounded-md` or `rounded-lg`.
* ❌ **DON'T**: Remove or hide any comic content, chapters, metadata, or navigation features.
