# Specification

## Summary
**Goal:** Display two AliExpress-sourced products on the same storefront page with a shared cart/checkout, and provide an embeddable (Shopify-friendly) storefront view.

**Planned changes:**
- Backend: accept an arbitrary AliExpress product URL at runtime, validate it as an AliExpress product-page URL, and return fetched HTML (preserving the existing single-product flow).
- Frontend: update product fetching utilities/hooks to accept a URL parameter, normalize as before, and cache per-URL (with independent loading/error states per product).
- Frontend: render two full product detail sections on the “/” route (images/title/price/description/etc.), each with its own quantity control and Add to Cart action.
- Frontend: ensure cart line items remain distinct between the two products by using a stable per-product identifier derived from the source URL.
- Frontend: add optional per-product display price override configuration so the second product can be shown and calculated as $160.00.
- Frontend: add an embeddable mode (e.g., query param or dedicated route) with minimal chrome suitable for iframe embedding in Shopify, plus brief embed instructions.

**User-visible outcome:** Users can view two products on the main storefront page, add either/both to a shared cart without conflicts, see the second product priced at $160.00 when configured, and embed the storefront in a Shopify page via iframe while still being able to shop and checkout within the embedded view.
