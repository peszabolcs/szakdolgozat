# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

ParkVision is a smart parking management system frontend MVP built with React 18 + Vite + TypeScript. The project follows a **sprint-based organization** where each sprint has dedicated documentation, code, and infrastructure configurations under `sprints/XX/`.

**Current Sprint:** Sprint 2 - MVP Implementation (Frontend with mock data)

---

## Essential Commands

### Development

```bash
# Start dev server with MSW mock API (port 5173)
npm run dev

# Switch mock scenarios:
VITE_MOCK_SCENARIO=empty npm run dev    # Test empty states
VITE_MOCK_SCENARIO=error npm run dev    # Test error handling
VITE_MOCK_SCENARIO=normal npm run dev   # Default: 50 parking spaces
```

### Testing

```bash
# Run all tests once
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Visual test UI
npm run test:ui

# Coverage report (outputs to sprints/02/reports/coverage/)
npm run test:coverage

# Run single test file
npm test src/components/EmptyState.test.tsx
```

### Build & Quality

```bash
# TypeScript check + production build
npm run build

# Lint (zero warnings policy)
npm run lint

# Preview production build
npm run preview

# Full CI locally (lint + test + coverage + build)
npm run ci-local
```

### Infrastructure (Terraform)

```bash
cd sprints/02/infra/terraform

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Preview infrastructure changes
terraform plan -out=plan.out

# Requires VERCEL_API_TOKEN env var
```

---

## Architecture Overview

### Project Structure

```
/
├── sprints/
│   ├── 01/                    # Sprint 1: Research & Architecture
│   └── 02/                    # Sprint 2: MVP Implementation (ACTIVE)
│       ├── docs/              # Spec v0.2, User Stories, ADRs, DoR/DoD
│       ├── wireframes/        # UI screen descriptions
│       ├── tests/acceptance/  # Gherkin feature files
│       ├── infra/terraform/   # IaC configuration
│       └── reports/coverage/  # Test coverage reports
├── src/                       # Main frontend source code
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Route pages (Dashboard, Spaces, Areas)
│   ├── hooks/                 # TanStack Query custom hooks
│   ├── mocks/                 # MSW mock API handlers
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
└── .github/workflows/         # CI/CD pipelines
```

### Technology Stack

- **Framework:** React 18.2 with TypeScript 5.0
- **Build Tool:** Vite 4.3 (fast HMR, ES modules)
- **UI Library:** Material-UI (MUI) 5.14
- **Data Fetching:** TanStack Query 4.29 (automatic caching, retry logic)
- **HTTP Client:** Axios 1.4
- **Routing:** React Router DOM 6.14
- **Mock API:** MSW 1.2 (Mock Service Worker)
- **Testing:** Vitest 1.0 + React Testing Library
- **IaC:** Terraform 1.5 (Vercel deployment)

### Data Flow Pattern

```
User Action
  ↓
Page Component (e.g., DashboardPage.tsx)
  ↓
Custom Hook (e.g., useParkingSpaces)
  ↓
TanStack Query (automatic caching, retry: 1)
  ↓
Axios HTTP Client
  ↓
MSW Intercept (in dev/test)
  ↓
Mock Handler (returns data based on VITE_MOCK_SCENARIO)
  ↓
Component Re-render
```

### MSW Mock API Scenarios

Mock handlers support three scenarios controlled by `VITE_MOCK_SCENARIO`:

- **`normal`** (default): Returns 50 parking spaces with realistic data
- **`empty`**: Returns empty array to test empty states
- **`error`**: Returns 500 Internal Server Error to test error handling

Mock data generators in `src/mocks/handlers/`:
- `parkingSpaces.ts` - Generates 50 parking spaces with occupied/free status
- `areas.ts` - Provides 5 parking areas (Zone A-E) with capacity data

### State Management Pattern

**Loading/Error/Empty/Success States:**

Every page follows this pattern:

```typescript
const { data, isLoading, isError, error, refetch } = useParkingSpaces();

if (isLoading) return <Typography>Loading...</Typography>;
if (isError) return <ErrorBanner message={error.message} onRetry={refetch} />;
if (!data?.length) return <EmptyState title="..." message="..." />;
return <MainContent data={data} />;
```

**TanStack Query Configuration (App.tsx):**

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
});
```

### Component Architecture

**Layout System:**
- `Layout.tsx` - Persistent sidebar (240px) + AppBar + main content area
- Uses Material-UI Drawer (variant="permanent") for navigation
- React Router `<Outlet />` for nested routes

**Shared Components:**
- `StatCard.tsx` - Dashboard statistics display (value + icon + color)
- `EmptyState.tsx` - Consistent empty state UI with optional CTA button
- `ErrorBanner.tsx` - Error notification with retry functionality (MUI Alert)

**Page Components:**
- `DashboardPage.tsx` - Displays occupancy statistics (total, occupied, free, %)
- `ParkingSpacesPage.tsx` - Table of parking spaces with status filtering
- `AreasPage.tsx` - Grid of area cards with capacity progress bars

### TypeScript Type System

Core domain types (src/types/index.ts):

```typescript
interface ParkingSpace {
  id: string;
  status: 'occupied' | 'free';
  areaId: string;
  areaName: string;
  updatedAt: string; // ISO 8601 timestamp
}

interface Area {
  id: string;
  name: string;
  description: string;
  capacity: number;
  occupied: number;
  status: 'active' | 'inactive';
}

interface DashboardStats {
  total: number;
  occupied: number;
  free: number;
  occupancyRate: number; // 0-100 percentage
}
```

---

## Testing Architecture

### Coverage Target: ≥60%

**Current Coverage: ~34%** (Components: 55%, Hooks: 96%, Utils: 100%)

### Test Files Structure

```
src/
├── components/*.test.tsx     # Component unit tests
├── pages/*.test.tsx          # Page integration tests
├── hooks/*.test.tsx          # Hook tests with MSW
└── utils/*.test.ts           # Pure function tests
```

### Testing Patterns

**Component Tests:**

```typescript
describe('EmptyState', () => {
  it('renders title and message', () => {
    render(<EmptyState title="No Data" message="Add items" />);
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });
});
```

**Hook Tests with TanStack Query:**

```typescript
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

it('fetches data successfully', async () => {
  const { result } = renderHook(() => useParkingSpaces(), {
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

**MSW Test Setup (src/test/setup.ts):**

MSW server is automatically started for all tests:

```typescript
export const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Override handlers in specific tests:

```typescript
it('handles API errors', async () => {
  server.use(
    rest.get('/api/parking-spaces', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ message: 'Error' }));
    })
  );
  // ... test error handling
});
```

---

## Configuration Files

### vite.config.ts

- **Dev server:** `0.0.0.0:5173` (accessible from network)
- **Build output:** `dist/` with source maps
- **Test environment:** jsdom (browser simulation)
- **Coverage directory:** `sprints/02/reports/coverage`
- **Coverage format:** text, json, html, cobertura, lcov

### tsconfig.json

- **Target:** ES2020
- **Module:** ESNext with bundler resolution
- **JSX:** react-jsx (automatic React 17+ transform)
- **Strict mode:** Enabled (all strict type checks)
- **Linting:** noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch

### MSW Configuration

Worker directory: `public/` (configured in package.json)

Initialize MSW worker:
```bash
npx msw init public/ --save
```

---

## CI/CD Pipelines

### GitHub Actions Workflows

**1. Test & Coverage (test.yml)**
- Runs on: push to main, PRs to main
- Steps: Setup Node → Install → Lint → Type check → Test with coverage → Upload artifacts
- Enforces: Zero ESLint warnings, 60% coverage threshold

**2. Build (build.yml)**
- Runs on: push to main, PRs to main
- Steps: Setup Node → Install → Build → Upload dist artifacts
- Verifies: Production build succeeds

**3. Terraform (terraform.yml)**
- Runs on: changes to `sprints/02/infra/terraform/**`
- Working directory: `sprints/02/infra/terraform`
- Steps: Format check → Init → Validate → Plan → Upload plan artifact → Comment on PR
- Requires: `VERCEL_API_TOKEN` secret in GitHub repository settings

---

## Sprint Deliverables

Each sprint has a dedicated directory under `sprints/XX/` with standardized structure:

### Sprint 02 (Active) Deliverables:

**Documentation (sprints/02/docs/):**
- `spec/product_spec_v0.2.md` - Product specification with scope, NFRs, acceptance criteria
- `stories/user_stories.md` - 5 INVEST-compliant user stories with Given-When-Then AC
- `adr/0001-*.md` - Architecture Decision Record: Frontend platform choice
- `adr/0002-*.md` - Architecture Decision Record: IaC strategy
- `process/dor_dod.md` - Definition of Ready and Definition of Done
- `traceability.md` - Story → AC → Test → Code → CI mapping

**Wireframes (sprints/02/wireframes/):**
- 5 screen descriptions (ASCII art + specifications)
- Covers normal, empty, and error states for each screen

**Acceptance Tests (sprints/02/tests/acceptance/):**
- Gherkin feature files for critical acceptance criteria
- `empty_state.feature` - US-01 empty state scenarios
- `error_handling.feature` - US-05 error handling scenarios

**Infrastructure (sprints/02/infra/terraform/):**
- Terraform configuration for Vercel deployment
- `main.tf`, `providers.tf`, `variables.tf`, `outputs.tf`
- CI validates and plans on every PR

**AI Usage Log (sprints/02/ai/):**
- `ai_log.jsonl` - JSONL format log of AI tool usage
- Documents: tool, task, decision, impact, human_validation

---

## Architecture Decision Records (ADRs)

**ADR-0001: Frontend Platform & Deployment**
- Decision: React 18 + Vite + TypeScript + Vercel
- Alternatives considered: CRA, Next.js, Vue, Netlify
- Rationale: Fast HMR, modern tooling, zero-config deployment
- Trade-offs: SPA limitations (SEO), vendor lock-in (mitigated by static build)

**ADR-0002: IaC Strategy - Terraform**
- Decision: Terraform validate + plan (apply in Sprint 3)
- Alternatives considered: Pulumi, CloudFormation, Ansible
- Rationale: Vendor-agnostic, declarative, industry standard
- Trade-offs: State file management, learning curve

---

## Development Workflow

### Adding a New Feature

1. **Create User Story** in `sprints/02/docs/stories/user_stories.md`
   - Follow INVEST principles
   - Write Given-When-Then acceptance criteria

2. **Create Wireframe** in `sprints/02/wireframes/`
   - Describe normal, empty, and error states
   - Reference User Story ID

3. **Implement Component/Page**
   - Follow existing patterns (Layout → Page → Hook → Component)
   - Use Material-UI components
   - Handle loading/error/empty/success states

4. **Write Tests**
   - Component unit tests
   - Integration tests for pages
   - Use MSW for API mocking

5. **Update Traceability** in `sprints/02/docs/traceability.md`
   - Map Story → AC → Test → Code → CI

6. **Verify Coverage**
   - Run `npm run test:coverage`
   - Ensure ≥60% coverage maintained

### Debugging Tips

**MSW not intercepting requests:**
- Check `public/mockServiceWorker.js` exists (run `npx msw init public/`)
- Verify MSW starts in `src/main.tsx` before rendering app
- Use `onUnhandledRequest: 'warn'` in browser.ts to debug

**Tests timing out:**
- Increase waitFor timeout: `await waitFor(() => {...}, { timeout: 5000 })`
- Check MSW server is running in test setup
- Verify TanStack Query wrapper in tests has `retry: false`

**Build errors:**
- Run `npx tsc --noEmit` to see TypeScript errors in isolation
- Check for circular dependencies
- Verify all imports use correct paths (case-sensitive)

---

## Known Limitations & Future Work

**Current Limitations (Sprint 2 MVP):**
- Mock data only (no real backend integration)
- No authentication/authorization
- Pagination limited to first 20 items
- Table sorting limited to "Updated" column
- No real-time updates (polling/WebSocket)

**Planned for Sprint 3:**
- Backend API integration (replace MSW with real endpoints)
- E2E tests with Playwright
- Full pagination and column sorting
- Terraform apply automation in CI
- Lighthouse CI for performance monitoring

---

## Important Files

**Entry Points:**
- `src/main.tsx` - Application entry point (initializes MSW in dev)
- `src/App.tsx` - Root component (providers, routing, theme)
- `index.html` - HTML template

**Configuration:**
- `vite.config.ts` - Vite build and test configuration
- `tsconfig.json` - TypeScript compiler options
- `package.json` - Dependencies and scripts
- `.eslintrc.cjs` - ESLint rules (zero warnings policy)

**Documentation:**
- `README.md` - Quick start guide and project overview
- `SPRINT_02_SUMMARY.md` - Sprint 2 deliverables checklist
- `sprints/02/docs/traceability.md` - Full traceability matrix

---

## Troubleshooting

**Port 5173 already in use:**
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9
# Or use different port
vite --port 5174
```

**MSW worker not found:**
```bash
npx msw init public/ --save
```

**Coverage reports not generating:**
```bash
# Ensure reports directory exists
mkdir -p sprints/02/reports
npm run test:coverage
```

**Terraform plan fails:**
```bash
# Ensure VERCEL_API_TOKEN is set
export VERCEL_API_TOKEN="your_token_here"
cd sprints/02/infra/terraform
terraform plan
```
