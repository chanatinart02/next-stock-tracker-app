# Stock Market App with Next.js, Shadcn, Better Auth, and Inngest

<div align="center">
  <br />
    <a href="https://youtu.be/gu4pafNCXng" target="_blank">
      <img src="https://github.com/adrianhajdin/signalist_stock-tracker-app/raw/main/public/readme/hero.webp" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=next.js&color=black"/>
    <img src="https://img.shields.io/badge/-Better Auth-black?style=for-the-badge&logoColor=white&logo=betterauth&color=black"/>
<img src="https://img.shields.io/badge/-Shadcn-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=black"/>
<img src="https://img.shields.io/badge/-Inngest-black?style=for-the-badge&logoColor=white&logo=inngest&color=black"/><br/>

<img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=00A35C"/>
<img src="https://img.shields.io/badge/-CodeRabbit-black?style=for-the-badge&logoColor=white&logo=coderabbit&color=9146FF"/>
<img src="https://img.shields.io/badge/-TailwindCSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=38B2AC"/>
<img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6"/>

  </div>

</div>

📚 Resources:

- [Figma Design](https://www.figma.com/design/ztlM5BvVLIERfMIznKK58L/Stock-Market-App?node-id=0-1&p=f)
- [Tutorial](https://youtu.be/gu4pafNCXng)

## ✨ Introduction

AI-powered modern stock market app built with Next.js, Shadcn, Better Auth, and Inngest! Track real-time prices, set personalized alerts, explore company insights, and manage watchlists. The admin dashboard allows managing stocks, publishing news, and monitoring user activity, while event-driven workflows power automated alerts, AI-driven daily digests, earnings notifications, and sentiment analysis—perfect for devs who want a dynamic, real-time financial platform.

## ⚙️ Tech Stack

- **Next.js**

- **Shadcn** is an open-source library of fully customizable, accessible React components.

- **TailwindCSS**

- **React hook form** - a library for managing form state and validation in React components.

- **Better Auth** is a framework-agnostic authentication and authorization library for TypeScript. It provides built-in support for email/password login, social sign-on (Google, GitHub, Apple, and more), and multi-factor authentication, simplifying user authentication and account management.

- [trading view widget](https://www.tradingview.com/widget-docs/getting-started/#getting-started) is a widget that displays real-time market data and charts for various stocks, cryptocurrencies, and indices.
- [react-select-country-list](https://www.npmjs.com/package/react-select-country-list) - is a React component that allows users to select a country from a dropdown list.
- [react-country-flag](https://www.npmjs.com/package/react-country-flag) - is a React component that displays a flag for a specific country.

- [Inngest](https://www.inngest.com/docs/getting-started/nextjs-quick-start?ref=docs-home) is a platform for **event-driven** **workflows** and **background job runners**. It allows developers to build reliable, scalable automated processes such as real-time alerts, notifications, and AI-powered workflows.
- **Gemini** - AI for generate welcome emails for new users `lib/inggest/prompts.ts`
- [Finnhub](https://finnhub.io/docs/api) is a real-time financial data API that provides stock, forex, and cryptocurrency market data. It offers developers access to fundamental data, economic indicators, and news, making it useful for building trading apps, dashboards, and financial analysis tools.

- **MongoDB**

- **Nodemailer** is a Node.js library for sending emails easily. It supports various transport methods such as SMTP, OAuth2, and third-party services, making it a reliable tool for handling transactional emails, notifications, and contact forms in applications.

## 🔋 Features

👉 Stock Dashboard: Track real-time stock prices with interactive line and candlestick charts, including historical data, and filter stocks by industry, performance, or market cap.

👉 Automated daily market news summary emails, Personalized using each user's watch list by Finnhub and Generated summary with Gemini

👉 Powerful Search: Quickly find the best stocks with an intelligent search system that helps you navigate through Signalist.

👉 Watchlist & Alerts: Create a personalized watchlist, set alert thresholds for price changes or volume spikes, and receive instant email notifications to stay on top of the market.

👉 Company Insights: Explore detailed financial data such as PE ratio, EPS, revenue, recent news, filings, analyst ratings, and sentiment scores for informed decision-making.

👉 Real-Time Workflows: Powered by Inngest, automate event-driven processes like price updates, alert scheduling, automated reporting, and AI-driven insights.

👉 AI-Powered Alerts & Summaries: Generate personalized market summaries, daily digests, and earnings report notifications, helping users track performance and make data-driven decisions.

👉 Customizable Notifications: Fine-tune alerts and notifications based on user watchlists and preferences for a highly personalized experience.

👉 Analytics & Insights: Gain insights into user behavior, stock trends, and engagement metrics, enabling smarter business and trading decisions.

## Project Structure

The project is structured as follows:

- **components**: Contains reusable UI components from Shadcn and custom components.
- **lib**: Contains utility functions and constants.
- **hooks**: Contains custom hooks such as `useTradingViewWidget.tsx` and `useDebounce.ts`
- `types/global.d.ts`: Global type definitions for the project.
- **script**
  - `test-db.ts`: A script for testing the connection to the database.
- **API Routes**: `src/api`
- **Database**- Contains database models and connections.
- **Actions**: `lib/actions` - Server actions
  - **Auth**: `auth.actions.ts` - Handles user authentication sign-in, sign-up, and sign-out.
  - **User** - `user.actions.ts` - Handles user profile and settings.
- **Middleware**: `middleware` - Protects authenticated routes.

## Auth Workflow

- **Sign Up**: Users can sign up with email and password.
  - ![alt text](/screenshots/signUp-wf.png)
- **Sign In**: Users can sign in with email and password.
  - ![alt text](/screenshots/signIn-wf.png)
