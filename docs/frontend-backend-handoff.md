# BCN Frontend/Backend Handoff Specification

This document details the exact integration constraints, boundaries, and assumptions built into the BCN Frontend.

## 1. Frontend Architecture
- **Framework:** Next.js 16 (App Router) + React 19.
- **State & Data Fetching:** TanStack Query (`@tanstack/react-query`).
- **Styling:** Tailwind CSS + custom BCN Design System.
- **Routing:** Exclusively Client-Side Routing for authenticated views (`/dashboard`, etc).

## 2. API Client
- **Location:** `src/lib/api/client.ts`
- **Behavior:** Singleton Axios instance handling interceptors.
- **Error Interception:** Captures `401 Unauthorized` globally and emits `bcn:unauthorized` to trigger forced frontend logouts.
- **Multipart Data:** The client intentionally avoids setting the `Content-Type` boundary for `FormData` payloads, allowing the browser to inject the boundary dynamically to prevent backend parsing crashes.

## 3. Authentication
- **Authority:** Supabase Auth is the absolute authority for session state. 
- **Tokens:** The frontend extracts the Supabase JWT (`session.access_token`) on every request and injects it as `Authorization: Bearer <token>`.
- **Backend Responsibility:** The FastAPI backend MUST use Supabase JWT validation to verify requests.

## 4. Business Context
- The frontend tracks the `activeBusinessId` via React Context (`BusinessProvider`).
- Almost all endpoints depend on `?business_id=XYZ` or an equivalent path parameter.
- **Caching:** TanStack Query strictly segregates cache keys by `businessId`.

## 5. API Services Overview

The frontend expects these endpoints to be available. If one is missing or behaves differently, backend engineers must communicate the mismatch.

| Service Domain | Base Path | Methods Expected |
| :--- | :--- | :--- |
| **Business** | `/api/v1/businesses` | GET, POST, PUT, DELETE |
| **Dashboard** | `/api/v1/dashboard/{businessId}`| GET |
| **Compliance** | `/api/v1/compliance` | GET |
| **Analysis** | `/api/v1/compliance/analyze` | POST |
| **Regulations**| `/api/v1/regulations` | GET |
| **Documents** | `/api/v1/documents` | GET, POST (multipart) |
| **Search** | `/api/v1/search` | GET |
| **Assistant** | `/api/v1/assistant` | POST |

## 6. Request & Response Formats
- **Standard Requests:** JSON (`application/json`).
- **Standard Responses:** JSON. The frontend anticipates flat Data Transfer Objects (DTOs) conforming to the TypeScript types defined in `src/types/api.ts`.
- **Snake_case vs CamelCase:** Currently, the frontend attempts to map `snake_case` from the backend to `camelCase` internally where defined in the types. Verify payload shapes match.

## 7. Error Handling
The frontend categorizes responses by HTTP status:
- **401/403:** Authorization failure (Redirects to Login).
- **404:** Resource not found (Renders `not-found.tsx`).
- **422:** Unprocessable Entity / Validation Error (Maps to form validation errors).
- **5xx:** Server Error (Renders global `error.tsx` boundary).

## 8. Mock Mode
- A fallback mock service architecture exists when `NEXT_PUBLIC_API_MODE=true`.
- The frontend *never* invents data when `MOCK_MODE=false`.

## 9. Environment Variables
To connect the frontend to the backend in production, DevOps must set:
- `NEXT_PUBLIC_API_URL` -> The FastAPI origin.
- `NEXT_PUBLIC_SUPABASE_URL` -> The Supabase instance.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> The public anonymous key.

## 10. Backend Dependencies (Pending)
1. **CORS:** FastAPI must configure CORS to explicitly permit the deployed frontend domain.
2. **Google OAuth Config:** Supabase must be configured to allow the frontend's redirect callback URLs.
