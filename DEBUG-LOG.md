# DEBUG-LOG

Real bugs found while building 10X Shop. Each entry follows the same format:
symptom → reproduction → tool → root cause → fix → what I learned.

> Replace every `<sha>` with the commit hash from `git log --oneline` (or a GitHub commit link).

---

## 1. Log out on `/checkout` lands on the Log in page

**Symptom.** After clicking **Log out** while on the checkout page, the user ends up on
**Log in** instead of the catalog.

**Reproduction.**
1. Add a product to the cart and press **Proceed to checkout**.
2. Log in (any username, password of 6+ characters) – the checkout form opens.
3. Click **Log out** in the header. Expected: `/`. Actual: `/login`.

**Tool.** An automated behaviour test (Vitest + Testing Library, run during development and
not part of the repository). The assertion "heading *Catalog* is visible" failed and the test
output showed the *Log in* heading instead. Then I read how React Router applies navigation.

**Root cause.** `logout()` is an ordinary (urgent) state update, while React Router applies the
location change inside a React transition. For one render the app was still on `/checkout`
with a guest user, so `ProtectedRoute` rendered `<Navigate to="/login">`. That redirect ran
after `navigate('/')` and won.

**Fix.** In `Header`, `logout()` and `navigate('/')` are called together inside
`startTransition`, so both updates are rendered at the same time and `ProtectedRoute` never
sees a guest on `/checkout`.
Commit: `<sha>` – `feat(layout): add Header with NavLink navigation and Footer`
(the fix is part of this commit; later Header commits keep it).

**What I learned.** Two state updates that depend on each other can be rendered at different
times. A guard component reacts to every intermediate render, not only to the final one.

---

## 2. Horizontal scroll on the Checkout page at 320px

**Symptom.** At a 320px viewport the checkout page scrolls sideways (document width 349px).

**Reproduction.** Put an item in the cart, open `/checkout` after logging in, set the viewport
to 320px wide (DevTools device toolbar).

**Tool.** A scripted audit in headless Chromium that compares `document.documentElement.scrollWidth`
with `window.innerWidth` and lists elements whose `getBoundingClientRect().right` is larger than
the viewport. The only culprit was the form card (333px wide in a 288px container).

**Root cause.** The page wrapper was a CSS grid without an explicit column on small screens.
An implicit `auto` column cannot shrink below the minimum width of its content (the inputs
inside the `<fieldset>`), so the column grew wider than its container. The cart page used the
same pattern.

**Fix.** `grid-cols-1` for small screens and `lg:grid-cols-[minmax(0,1fr)_24rem]` for large
ones, so the column is allowed to shrink to `0`.
Commit: `<sha>` – `feat(pages): build the Checkout page with validation, processing state and confirmation`
(same fix in `feat(pages): build the Cart page with items, summary and empty state`).

**What I learned.** `1fr` means `minmax(auto, 1fr)`; to let a grid track shrink use
`minmax(0, 1fr)` or `grid-cols-1`. Check every page at 320px, not only at 375px.

---

## 3. `npm run lint` and `npm run build` fail with "Missing script"

**Symptom.** Running `npm install`, `npm run typecheck`, `npm run lint` and `npm run build` in
the repository folder printed `npm error Missing script: "lint"` and `Missing script: "build"`.

**Reproduction.** Extract the project into a sub-folder (`10x-shop/`) of the repository and run
the npm commands in the repository root.

**Tool.** The terminal output (`npm error Missing script`) and the VS Code Explorer, which showed
`package.json` inside `10x-shop/` and not in the root.

**Root cause.** npm reads the `package.json` of the current folder. The root folder had no
`package.json`, so it had no scripts.

**Fix.** Moved the contents of `10x-shop/` to the repository root before making the commits, so
`package.json`, `src/` and `PLAN.md` sit at the top level. No code change.
Commit: none (repository layout fixed before the first project commit).

**What I learned.** `npm` works relative to the folder you run it in; also, a project that is
deployed must have `package.json` at the repository root.

---

## 4. Accessibility audit: heading order, touch targets and contrast

**Symptom.** An automated audit reported three groups of problems on the mobile layout (375px):
product-card and cart-item titles were `h3` directly under the page `h1`; header links, text
buttons and add-to-cart buttons were 32–36px tall and the quantity buttons 40px (the spec asks
for at least 44px); grey `text-neutral-500` labels on the cream background.

**Reproduction.** Open `/`, `/cart` or `/products/:id` at 375px and inspect the elements, or run
axe-core on the page.

**Tool.** axe-core injected into headless Chromium (rules `heading-order`), a script measuring
`getBoundingClientRect()` of every link/button/input, and a manual contrast calculation:
axe cannot compute contrast on the dotted background image, and the ratio of `neutral-500` on
`#f4f0e6` is about 4.2:1 (WCAG AA needs 4.5:1).

**Root cause.** Heading levels were chosen by size instead of structure, the compact button
paddings were designed for a mouse, and one grey was too light for small text.

**Fix.** Titles became `h2`; `min-h-11` (44px) on buttons, header links and text buttons
(`md:min-h-9` keeps the desktop header compact); steppers are `size-11`; labels use
`neutral-600` (about 6.9:1).
Commits: `<sha>` – `fix(a11y): 44px touch targets and visible focus outline in shared controls`,
`<sha>` – `fix(a11y): 44px Header touch targets and a readable cart link name`,
`<sha>` – `fix(a11y): 44px targets for text buttons and h2 for cart item titles`,
`<sha>` – `fix(a11y): raise text contrast on product details to WCAG AA`,
`<sha>` – `fix(a11y): use h2 for product card titles to keep heading order`.

**What I learned.** Automated tools miss some problems (contrast over images), so calculate those
by hand; heading levels describe structure, not font size.

A later run of the same audit found two more cases that were fixed the same way: the
"Write a review" title was an `h3` directly under the page `h1`, and the compact 36px buttons
started at 768px (tablets are touch devices), so they now start at 1024px.
Commits: `<sha>` – `feat(reviews): add ReviewForm with validation`,
`<sha>` – `fix(a11y): keep 44px touch targets on tablets, compact buttons only from 1024px`.

The audit also found the product links in the order details table, which were 20px tall because a
table cell is not "text in a paragraph". Commit: `<sha>` –
`feat(pages): add Order details page with timeline, items table and Reorder`.

One warning was a **false alarm**: right after a page change axe reported low contrast on the
header "Cart" link. The link was in the middle of its `transition-colors` animation (dark text on
a fading green background). Measuring again after the animation finished showed no problem, so
nothing was changed. Lesson: wait for animations to end before trusting a contrast measurement.

---

## 5. Choosing a category brought the old search text back

**Symptom.** On the catalog, after typing a search and then choosing a category, the URL sometimes
jumped back to `?q=...` a moment later and the category filter was lost.

**Reproduction.** Open `/?q=item&page=2`, choose a category in the dropdown, then choose
"All categories" again within a second or so.

**Tool.** An automated behaviour test (`window.location.search` was `?q=item` while `''` was
expected) and then reading the effect that writes the search text into the URL.

**Root cause.** The effect that copies the debounced search text into the URL listed
`setSearchParams` in its dependencies. That function changes every time the URL changes, so after
each URL change the effect ran again with the still-old debounced text (`item`) and wrote it
back.

**Fix.** The effect now depends only on `debouncedText`; the newest `sort` and `setSearchParams`
are read from a ref. A ref also remembers the last value pushed to the URL, so the input and the
URL stay in sync after Back / Forward without a loop.
Commit: `<sha>` – `feat(catalog): search, category, sort and pagination driven by URL params`.

**What I learned.** An effect that writes state should run because of the change it reacts to,
not because one of its helper functions got a new identity. Debounced values can be stale for a
moment, so any other trigger must not read them.
