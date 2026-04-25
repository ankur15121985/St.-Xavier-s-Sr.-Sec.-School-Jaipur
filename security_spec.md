# Security Specification - St. Xavier's School Portal

## 1. Data Invariants
- Only authorized administrators can perform write operations (create, update, delete) on any collection.
- Public users have read-only access to all collections except the `admins` collection.
- The `admins` collection is protected: only existing admins can read/write to it.
- Every written document must match the schema defined in `firebase-blueprint.json`.
- Document IDs must be valid strings and not excessively large.

## 2. The "Dirty Dozen" Payloads (Targeting logic bypass)

1. **Mass Delete Attempt**: Anonymous user trying to delete a notice.
2. **Identity Spoofing**: Logged-in non-admin user trying to create a staff member.
3. **Ghost Field Poisoning**: Admin trying to add an unauthorized `isVerified` field to a Notice.
4. **ID Injection**: Trying to create a document with a 1MB junk string ID.
5. **Schema Violation**: Creating an event without the required `title` field.
6. **Type Mismatch**: Updating `order_index` in `MenuItem` with a string "high" instead of a number.
7. **Admin Self-Promotion**: Logged-in user trying to add their own email to the `/admins/` collection.
8. **PII Exposure**: Trying to read the `/admins/` collection as a guest.
9. **Resource Exhaustion**: Creating a Notice with a 1MB total content string.
10. **Stale Data Write**: Updating a document without a modern `updatedAt` timestamp.
11. **Relational Orphan**: Creating a Notice without checking if the user is authenticated in the session.
12. **Status Skipping**: Modifying a read-only system field if one existed (e.g., `id`).

## 3. Test Runner Concept (Validation logic)
The following behaviors will be enforced in `firestore.rules`:
- `allow read: if true` for public data.
- `allow write: if isAdmin()`.
- `isValidNotice(data)` etc. helpers for every schema.
- `affectedKeys().hasOnly(...)` for updates.
