# 📝 Angular Blogging App (Signal-Driven, Standalone Architecture)

A **modern Angular 21 blogging application** built with **signals**, **standalone components**, **interface-based dependency injection**, and **clean feature-oriented architecture** — without NgRx or NgModules.

This project demonstrates how to build a **scalable, testable, and maintainable Angular application** using the latest Angular paradigms.

---

## 🚀 Tech Stack

- **Angular 21**
- **Signals & Effects**
- **Standalone Components & Lazy Routes**
- **Spartan UI** (for all UI components)
- **RxJS** (minimal usage, HTTP only)
- **Tailwind CSS**
- **TypeScript**
- **Angular 21 Native Test Suite (Vite)**

---

## ✨ Key Features

- 🔐 Authentication (Login / Signup)
- 📰 Blog listing, blog detail & comments
- 🖼️ Photo albums & photo gallery
- 🌗 Theme handling
- 📱 Responsive & accessible UI
- 🧪 Test infrastructure with mocks & test data


---

## 🧠 Architectural Highlights

### ✅ What This Project Emphasizes

- **Signal-based state management**  
  Services manage state using Angular signals instead of external libraries.

- **Interface-driven design**  
  Every service depends on an interface, not a concrete implementation.

- **InjectionTokens everywhere**  
  Enables loose coupling and easy mocking.

- **Standalone-only architecture**  
  No `NgModule`s — fully aligned with Angular’s future direction.

- **Feature isolation**  
  Each feature owns its:
  - routes
  - interfaces
  - services
  - tokens
  - UI components

- **Lazy loading by default**  
  All features are route-lazy-loaded.

- **Test-friendly structure**  
  Dedicated mocks and test data for services and state.

---

## ❌ What’s Intentionally NOT Used

- ❌ NgRx / NgRx Signals  
- ❌ `stores/` folder  
- ❌ `FormBuilder` (uses `FormRecord` instead)
- ❌ NgModules
- ❌ Global shared state containers

> The goal is **clarity, simplicity, and Angular-native solutions**.

---

## 📁 Project Structure

```text
app-blogging/
├── src/
│   ├── app/
│   │   ├── core/               # App-wide services, guards, models
│   │   ├── features/           # Feature-based architecture
│   │   │   ├── auth/           # Authentication
│   │   │   ├── blogs/          # Blogging
│   │   │   └── photos/         # Albums & photos
│   │   ├── shared/             # Reusable UI components
│   │   ├── testing/            # Mocks & test data
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── styles.css
│   └── main.ts
├── angular.json
├── package.json
└── tailwind.config.js
```
## 🔁 State Management Strategy

- API services handle **HTTP communication**
- State services:
  - Store data using `signal()`
  - Expose **read-only signals**
  - Bridge **RxJS → Signals** when required
- No manual subscription cleanup for HTTP calls
- Long-lived streams use Angular-native cleanup via `takeUntilDestroyed`

---

## 🧪 Testing Strategy

- Interface-based service mocks
- Centralized test data
- Component and service spec files included
- Designed for **70%+ code coverage**
- Easy dependency swapping via `InjectionTokens`

---

## ♿ Accessibility & UX

- ARIA attributes where applicable
- Keyboard-friendly navigation
- Mobile-first **Tailwind CSS** layout
- Clean, semantic HTML structure

---

## 🛠️ Getting Started

### Install dependencies
```bash
npm install
```
### Run the application
```bash
ng serve
```
### Run tests
```bash
ng test --watch=false
```
## 🎯 Project Goals

This repository is intended to:

- Showcase **modern Angular (v21+) patterns**
- Serve as a **reference architecture** for real-world applications
- Demonstrate **senior-level Angular design decisions**
- Avoid unnecessary complexity while staying scalable
