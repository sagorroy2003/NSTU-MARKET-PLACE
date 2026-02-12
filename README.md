# Student Classifieds — University Marketplace

<table border="0">
  <tr>
    <td width="100%" valign="top">
      <h3>🛒 UniBazer - Multi-Vendor Student Marketplace</h3>
      <img src="https://img.shields.io/badge/Status-In%20Progress-yellow?style=for-the-badge&logo=blueprint" />
      <img src="https://img.shields.io/badge/Architecture-MVC-blue?style=for-the-badge" />
      <p align="justify">
        A specialized e-commerce ecosystem designed for university students to trade safely. Unlike standard shops, UniBazer supports multiple independent sellers (vendors) within a single platform, requiring complex logic for product management and user roles.
      </p>
      <h4>✨ Key Multi-Vendor Features:</h4>
      <ul>
        <li><b>Vendor Dashboard:</b> Private interface for students to list products, manage inventory, and track sales.</li>
        <li><b>Role-Based Access:</b> Distinct permissions for Buyers, Vendors, and Platform Administrators.</li>
        <li><b>Unified Cart:</b> Ability for buyers to checkout with items from multiple student vendors simultaneously.</li>
        <li><b>Campus Verification:</b> Secure registration system to ensure a trusted student-only community.</li>
      </ul>
      <h4>🛠️ Planned Tech Stack:</h4>
      <p>
        <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
        <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
        <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
        <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" />
        <img src="https://img.shields.io/badge/Aiven-FF4F00?style=flat-square&logo=aiven&logoColor=white" />
      </p>
      <a href="https://github.com/sagorroy2003/UniBazer"><b>Explore the Repository →</b></a>
    </td>
  </tr>
</table>

## 1. Project Overview

**Student Classifieds** is a web application designed to be the central marketplace for university students. It addresses the inefficiency and clutter of using social media groups for buying and selling used goods by providing a dedicated, secure, and easy-to-navigate platform.

Access is restricted to verified students, creating a trusted community. The core features include user authentication, categorized product listings, a **My Listings** dashboard for sellers, and a flexible, seller-controlled communication model that leverages existing chat apps.

## 2. Problem Statement

Students currently lack a centralized platform for trading used goods. Existing channels (such as social media groups) are:

- **Disorganized:** Finding specific items (textbooks, furniture, electronics, etc.) often requires endless scrolling.
- **Cluttered:** Listings are mixed with announcements, non-commercial posts, and spam.
- **Inefficient:** Communication is ad-hoc, and sellers have no clean way to manage or mark listings as sold.
- **Insecure:** Unverified users can join and scam students.

## 3. Proposed Solution

Build a student-exclusive web application that centralizes peer-to-peer commerce and is:

- **Centralized:** One website for all student marketplace activity.
- **Secure:** University-email-based sign-up and authentication.
- **Organized:** Listings categorized with predefined categories.
- **Efficient:** Seller dashboard plus privacy-first contact options.

## 4. Core Features Breakdown

### 4.1 User Authentication & Profiles

- **Student Verification:** Sign-up allowed only with valid university email addresses (e.g., `name@university.edu`).
- **Secure Authentication:** Password hashing with **bcrypt** and session management with **JWT**.
- **User Profile:** Users can update name and optionally add:
  - Phone number (for WhatsApp)
  - Messenger username
- **My Listings Dashboard:** Sellers can view, edit, delete, or mark listings as sold.

### 4.2 Product Listings & Browsing

- **Create Listing:** Form with title, description, price, location, and images.
- **Categorization:** Each listing belongs to one predefined category.
- **Image Uploads:** Images uploaded to **Cloudinary**; URL stored in database.
- **Homepage Feed:** Shows newest listings first.
- **Category Browsing:** Filter listings by category.
- **Search:** Keyword-based search on title/description.

### 4.3 Buyer-Seller Communication (Seller’s Choice)

No in-app chat is required. Instead, sellers choose which contact methods to expose.

- **Profile Contact Methods (optional):**
  - Email
  - WhatsApp (phone number)
  - Messenger (username)
- **Per-listing controls:**
  - `[ ] Show my email`
  - `[ ] Show my WhatsApp` (enabled only when phone is set in profile)
  - `[ ] Show my Messenger` (enabled only when username is set in profile)
- **Contact Seller button:** Buyers can only see methods enabled for that specific listing, with direct links (`wa.me/...`, `m.me/...`).

## 5. Technology Stack & Deployment (No Credit Card Required)

### 5.1 Core Stack

- **Frontend:** Next.js
- **Backend:** Node.js + Express.js
- **Database:** MySQL

### 5.2 Key Tools & Services

- **ORM (recommended):** Prisma
- **Image Handling:** Cloudinary

### 5.3 Deployment & Hosting Plan

- **Frontend Hosting:** Vercel (Hobby, free)
- **Backend Hosting:** Koyeb (Free Nano)
- **Managed MySQL:** Aiven (Hobby/free)

## 6. System Architecture

The app uses a decoupled client-server architecture:

1. **Client (Vercel):** Next.js frontend in browser sends API requests.
2. **Server (Koyeb):** Node/Express backend processes logic and queries DB.
3. **Database (Aiven):** MySQL stores users, categories, and listings.
4. **Image Pipeline (Cloudinary):** Frontend uploads image, gets URL, sends URL to backend, backend stores URL in DB.

## 7. Database Schema

### Users Table

```sql
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NULL,
    messenger_username VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table

```sql
CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);
```

### Products Table

```sql
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255),
    image_url VARCHAR(255),
    is_sold BOOLEAN DEFAULT FALSE,
    show_email BOOLEAN DEFAULT TRUE,
    show_whatsapp BOOLEAN DEFAULT FALSE,
    show_messenger BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);
```

## 8. Development Roadmap (Next Steps)

1. **Create accounts:**
   - GitHub
   - Vercel (with GitHub)
   - Koyeb (with GitHub)
   - Cloudinary
   - Aiven
2. **Collect secrets:**
   - Aiven MySQL connection URL
   - Cloudinary API key/secret
3. **Local development:**
   - Set up backend with `.env`
   - Build and test backend API
   - Build frontend and integrate with local API
4. **Deploy backend (Koyeb):**
   - Push backend repo
   - Configure env vars (DB URL, Cloudinary keys)
5. **Deploy frontend (Vercel):**
   - Push frontend repo
   - Set API base URL env var to Koyeb endpoint
6. **Test end-to-end:**
   - Signup/login
   - Create/edit/sell listings
   - Category/search behavior
   - Contact method visibility rules
   
codex/create-student-classifieds-project-documentation

## 9. MVP Acceptance Criteria (Merge-Ready Checklist)

Use this checklist before merging feature work into main:

### Authentication & Access

- [ ] Only university email domains are accepted at sign-up.
- [ ] Passwords are hashed with bcrypt (never stored in plain text).
- [ ] JWT-based authentication protects private routes.
- [ ] Unauthorized users cannot access profile or My Listings endpoints.

### Listings & Discovery

- [ ] Sellers can create listings with required fields (title, price, category).
- [ ] Listings appear on the homepage sorted by newest first.
- [ ] Category filtering works and returns only matching listings.
- [ ] Search returns items matching title/description keywords.
- [ ] Sellers can edit, delete, and mark their own listings as sold.

### Contact Privacy Model

- [ ] Contact method toggles are per listing (not global only).
- [ ] WhatsApp toggle is enabled only when phone number exists in profile.
- [ ] Messenger toggle is enabled only when username exists in profile.
- [ ] Product page reveals only the contact methods enabled for that listing.

### Data & Deployment

- [ ] Database schema includes all required tables and constraints.
- [ ] Image upload flow stores Cloudinary URLs in the Products record.
- [ ] Environment variables are configured on Koyeb/Vercel.
- [ ] End-to-end smoke test passes on deployed frontend + backend.

## 10. Step-by-Step Build Plan (Feature Delivery)

This section converts the MVP into practical development slices so the team can build and validate one feature set at a time.

### Step 1 — Project Bootstrap

- Create two apps in one repo (or two repos):
  - `frontend/` with Next.js
  - `backend/` with Express + Prisma
- Add a shared `.env.example` for required variables.
- Set up formatting/linting and basic CI (lint + build).

**Definition of done**
- Frontend runs locally.
- Backend runs locally.
- Both pass lint/build checks.

### Step 2 — Database & Prisma Foundation

- Initialize MySQL schema using Prisma models for `User`, `Category`, `Product`.
- Add migration files and seed script for default categories.
- Verify constraints:
  - Unique email
  - Product belongs to valid user + category

**Definition of done**
- `prisma migrate` completes successfully.
- Seed inserts category records.

### Step 3 — Authentication Feature

- Implement signup with university-domain email validation.
- Hash passwords with bcrypt.
- Implement login endpoint returning JWT.
- Add auth middleware for protected routes.

**Definition of done**
- Non-university emails are rejected.
- Private routes fail without valid JWT.

### Step 4 — User Profile + Contact Methods

- Build profile read/update endpoints.
- Support optional `phone_number` and `messenger_username`.
- Build frontend profile page with validation.

**Definition of done**
- User can save optional contact fields.
- Updated fields are reflected in API and UI.

### Step 5 — Create Listing Feature

- Add create-listing API with title, description, price, category, location, image URL.
- Integrate Cloudinary upload from frontend.
- Add per-listing contact visibility toggles.

**Definition of done**
- Seller can publish listing with image.
- Invalid category or missing required fields are rejected.

### Step 6 — Browse, Filter, Search

- Build homepage feed ordered by newest.
- Add category filter endpoint/query.
- Add keyword search over title/description.

**Definition of done**
- Feed is sorted by `created_at DESC`.
- Category and search behavior match acceptance criteria.

### Step 7 — My Listings Dashboard

- Build seller dashboard endpoints/UI:
  - list own products
  - edit
  - delete
  - mark as sold
- Add ownership checks so only creator can mutate listing.

**Definition of done**
- Seller can fully manage own listings.
- Cross-user edits/deletes are blocked.

### Step 8 — Product Detail Contact Reveal Rules

- On product detail, show only methods enabled for that listing.
- Enforce prerequisites:
  - WhatsApp shown only if toggle is true **and** phone exists
  - Messenger shown only if toggle is true **and** username exists
- Generate direct links (`mailto:`, `wa.me`, `m.me`).

**Definition of done**
- Buyer sees only seller-approved methods.
- Hidden methods are never leaked by API.

### Step 9 — Hardening, Testing, and Deployment

- Add API tests for auth, listing permissions, and contact visibility.
- Add frontend smoke flows: signup/login/create listing/filter/search.
- Deploy backend (Koyeb) and frontend (Vercel).
- Configure production environment variables.

**Definition of done**
- MVP acceptance checklist is fully checked.
- Deployed app passes end-to-end smoke test.
