# MSW (Mock Service Worker) Fix

## Problem Identified

**Error in Browser Console:**
```
Failed to load resource: the server responded with a status of 404 (Not Found) (areas, line 0)
Failed to load resource: the server responded with a status of 404 (Not Found) (parking-spaces, line 0)
AxiosError
```

**Root Cause:**
1. **Incorrect import path** in `src/mocks/browser.ts`
2. **Top-level await issue** in production builds

---

## Fixes Applied

### Fix 1: Correct Import Path

**File:** `src/mocks/browser.ts`

**Before:**
```typescript
import { handlers } from './handlers';
```

**After:**
```typescript
import { handlers } from './handlers/index';
```

**Reason:** The `handlers` is a directory, not a file. Must explicitly reference `index.ts`.

---

### Fix 2: Proper Async Initialization

**File:** `src/main.tsx`

**Before:**
```typescript
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}
```

**After:**
```typescript
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

**Changes:**
1. Wrapped MSW initialization in `enableMocking()` function
2. Explicitly set `serviceWorker.url` to `/mockServiceWorker.js`
3. Use `.then()` instead of top-level `await` for better compatibility
4. Return `Promise.resolve()` for production builds

---

## Verification

### Build Status
```bash
npm run build
```
**Result:** ✅ SUCCESS (7.93s)

### What Should Happen Now

When you run `npm run dev` and open the app:

1. **Browser Console** should show:
   ```
   [MSW] Mocking enabled.
   ```

2. **No 404 errors** for `/api/areas` or `/api/parking-spaces`

3. **Dashboard, Areas, Map pages** should load data correctly

---

## Testing Instructions

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Open Browser
Navigate to: http://localhost:5173

### Step 3: Open DevTools Console
**Expected Output:**
```
[MSW] Mocking enabled.
```

### Step 4: Check Network Tab
**Expected Requests:**
- `/api/parking-spaces` → 200 OK (from MSW)
- `/api/areas` → 200 OK (from MSW)

**Response should be JSON**, not HTML 404 page.

### Step 5: Test Pages
- ✅ Dashboard shows statistics
- ✅ Areas page shows 15 Budapest locations
- ✅ Map page displays markers
- ✅ Admin page shows charts

---

## MSW Architecture

### File Structure
```
src/mocks/
├── browser.ts              # MSW worker setup
├── handlers/
│   ├── index.ts           # Combines all handlers
│   ├── parkingSpaces.ts   # /api/parking-spaces endpoint
│   └── areas.ts           # /api/areas endpoint
└── data/
    └── parkingLocations.ts # Mock data (15 locations)
```

### Handler Flow
```
Browser Request (/api/areas)
  ↓
MSW Intercept (via Service Worker)
  ↓
Handler Match (handlers/areas.ts)
  ↓
Return Mock Data (parkingLocations)
  ↓
TanStack Query Cache
  ↓
Component Renders
```

---

## Common Issues & Solutions

### Issue 1: MSW Not Starting
**Symptom:** No `[MSW] Mocking enabled.` message

**Solution:**
```bash
# Regenerate MSW service worker
npx msw init public/ --save
```

### Issue 2: Still Getting 404s
**Symptom:** Requests bypass MSW

**Check:**
1. Is `mockServiceWorker.js` in `public/` directory?
2. Is browser cache cleared? (Hard refresh: Cmd+Shift+R)
3. Are handlers registered correctly?

**Debug:**
```typescript
// Add to src/mocks/browser.ts
export const worker = setupWorker(...handlers);
console.log('MSW Handlers:', handlers);
```

### Issue 3: Production Build Fails
**Symptom:** Build error with top-level await

**Solution:** Use `.then()` pattern (already applied in Fix 2)

---

## Mock Data Details

### Endpoints
| Endpoint | Method | Response |
|----------|--------|----------|
| `/api/parking-spaces` | GET | Array of 50 parking spaces |
| `/api/areas` | GET | Array of 15 parking areas |

### Mock Scenarios
Control via `VITE_MOCK_SCENARIO` env var:

```bash
# Normal (default) - 50 spaces, 15 areas
npm run dev

# Empty state - Empty arrays
VITE_MOCK_SCENARIO=empty npm run dev

# Error state - 500 server errors
VITE_MOCK_SCENARIO=error npm run dev
```

### Sample Data
**Parking Spaces:** 50 items with:
- `id`, `status` (occupied/free)
- `areaId`, `areaName`
- `updatedAt` timestamp

**Parking Areas:** 15 Budapest locations with:
- Name (e.g., "Tesco Fogarasi", "Arena Plaza")
- GPS coordinates (lat/lng)
- Address
- Capacity and occupancy
- Status (active/inactive)

---

## Next Steps

### If Issues Persist

1. **Clear all caches:**
   ```bash
   rm -rf node_modules/.vite
   rm -rf dist
   npm run build
   ```

2. **Verify MSW service worker:**
   ```bash
   ls -la public/mockServiceWorker.js
   ```
   Should exist and be ~8KB

3. **Check browser DevTools:**
   - Application → Service Workers
   - Should see `mockServiceWorker.js` registered

4. **Test with curl (won't work - MSW is browser-only):**
   MSW intercepts requests in the browser via Service Worker.
   Server-side requests will return 404 (expected).

---

## Production Build Note

In production, MSW is **disabled** (only runs in `DEV` mode).

Production apps should:
1. Replace MSW with real backend API
2. Update `src/hooks/useAreas.ts` and `src/hooks/useParkingSpaces.ts`
3. Set API base URL via environment variable

---

## Summary

✅ **Import path fixed** (`./handlers/index`)  
✅ **Async initialization improved** (`.then()` pattern)  
✅ **Build verified** (succeeds in 7.93s)  
✅ **Service Worker configuration** explicit  

**Status:** MSW should now work correctly in development mode.

---

*Fix Applied: January 29, 2026*  
*Build Verified: ✅ SUCCESS*  
*Ready for Testing*
