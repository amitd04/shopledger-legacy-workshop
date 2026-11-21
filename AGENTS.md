# Repository Guidelines

## Project Structure

- `server.js` starts the Express app and serves the static POS in `public/`.
- `routes/` contains the products, orders, customers, and reports APIs.
- `lib/` contains pricing, tax, inventory, orders, Khata ledger, reporting, invoice, date, and JSON-store logic.
- `config.js` holds shop and business settings; `data/db.json` is the app’s persisted sample data.
- There is no test directory or test framework in this repository.

## Development Commands

- `npm install` installs the dependencies in `package.json`.
- `npm start` runs the server at `http://localhost:3000` (or the `PORT` environment value).
- `npm test` is only a placeholder and exits with an error; it does not run tests.

For a manual UI check, start the server and open the local address. Order actions write to `data/db.json`; back up that file before exercising flows against the checked-in data.

## Code Style

Follow the existing CommonJS JavaScript style: two-space indentation, semicolons, single-quoted strings, and `var` declarations. Use lower-case filenames such as `orders.js` and camelCase for functions and variables. Keep request handling in `routes/` and reusable business logic in `lib/`.

## Tests and Verification

No automated tests, formatter, or linter are configured. Do not treat a successful `npm test` as verification. For changes, run `node --check` on edited JavaScript files and manually exercise the affected screen or endpoint. Use a disposable copy of `data/db.json` for checks that create orders or settlements.

## Commits and Pull Requests

History uses short, descriptive, mostly lower-case subjects (for example, `support hsn gst slabs and coupon maxDiscount caps`); no strict prefix convention is present. Keep commits focused and describe the user-visible change. Pull requests should explain behavior changed, list verification performed, link a related issue when available, and include screenshots for POS or invoice UI changes.

## Data and Configuration

Do not commit real customer records, credentials, or deployment secrets. Review changes to `config.js` and `data/db.json` carefully; the latter contains customer contact and account-balance fields.
