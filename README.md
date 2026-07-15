# Mahalla

Hyperlocal neighborhood marketplace connecting residents with local service providers and sellers in Fergana, Uzbekistan.

## Problem Statement

In Fergana, Uzbekistan, finding trustworthy local service providers (like home cooks, tutors, or cleaners) is highly fragmented. Residents rely on unstructured Telegram groups or word-of-mouth recommendations, leading to unsafe transactions, lack of price transparency, and zero accountability. There is no unified, trusted hyperlocal platform dedicated to connecting neighbors with local micro-businesses in the region.

## Solution Overview

Mahalla is a marketplace where neighbors post listings (services/goods), find nearby providers, and order directly within their own district (mahalla).

## Disclosure

Core architecture (marketplace, listings, orders, AI-powered moderation via Gemma 4 31B) was originally developed for the H0 Hackathon. For Technoviz Summer of Code, we added multi-user identity — replacing a single hardcoded demo account with per-visitor cookie-based sessions, so each user now has their own profile, orders, and provider status.

## Features

- **Browse Local Services & Products**: Find services by category (Food, Laundry, Delivery, Moving, Cleaning, and others) with local distance estimation.
- **AI-Powered Listing Moderation & Price Suggestions**: Listings are checked for safety via the Gemma API, and sellers get dynamic, area-aware price guidelines.
- **Dynamic Per-Visitor Profiles** *(new for TSOC)*: Automatic unique session generation via persistent cookies, maintaining individual profiles, ratings, and order history.
- **Interactive Order Management**: Track pending, confirmed, active, and completed orders with state progression.
- **Multi-Language Interface**: Full localization support in English, Russian, and Uzbek.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime & UI**: React 19 & Tailwind CSS v4
- **Database**: AWS DynamoDB (single-table design)
- **AI Integration**: Google Gemma 4 (31B) via Google AI Studio API
- **UI Components**: Base UI (`@base-ui/react`), Sonner, Lucide React
- **Data Fetching**: SWR (stale-while-revalidate)
- **Package Manager**: pnpm 10.x

## Installation

```bash
git clone https://github.com/Jasurcyb/Mahallla.git
cd Mahallla
pnpm install
pnpm dev
```

Requires a `.env` file with AWS credentials (DynamoDB) and a Gemma/Google AI Studio API key.

## Usage

1. Visit the app — a unique session is created automatically via a cookie.
2. Browse listings or post your own.
3. Edit your profile to set your name, phone number, and city.
4. Enable provider mode to offer services.

## Live Demo

https://mahallla.vercel.app/

## Screenshots

![Landing](landing.png)
![Browse Services](browse.png)
![Service Detail](detail.png)
![Order Flow](orderspage.png)
![Profile](profile.png)

## Team

- Jasurcyb — full-stack development


## Future Scope

- Full OTP-based authentication
- In-app messaging between residents
- Expansion beyond Fergana

## License

MIT
