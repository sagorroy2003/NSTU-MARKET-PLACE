# Student Classifieds — University Marketplace

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

=======
main
