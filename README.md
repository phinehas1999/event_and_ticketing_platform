This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





1. Design the Database Schema
 - Define tables: users (with role), events, ticket_types, payments, tickets.
 - Model state transitions as enums/fields (event status, payment status, ticket status).
 - Include fields for file URLs (for receipts), references, and relations.
 - Use Drizzle ORM to define and migrate your schema.

2. Set Up Authentication & Role Management
 - Implement authentication (NextAuth.js or similar).
 - On signup, default role = USER.
 - Add logic for admin to promote users to ORGANIZER or ADMIN.
 - Ensure role is included in session/context.

3. Implement Public (Visitor) Pages
 - Landing page, event listing, event details.
 - No reservation or payment for visitors.
 - “Sign up to reserve” CTA.

4. User Flows
 - After login, redirect to /dashboard.
 - Implement event browsing, ticket reservation, payment upload, and dashboard for users.
 - Show pending/approved/rejected payments and tickets.

5. Organizer Flows
 - Organizer dashboard: event stats, ticket sales, pending payments.
 - Event creation/editing, ticket type creation.
 - Submit event for review (status: PENDING).
 - View/manage own events and payments.

6. Admin Flows
 - Admin dashboard: pending events, payments, organizer info.
 - Approve/reject events and payments.
 - On payment approval, issue ticket and update status.
 - On rejection, record reason.

7. File Upload Handling
 - Integrate with Cloudinary/S3 for receipt uploads.
 - Store URLs in DB, show previews in admin/organizer dashboards.

8. Permission & Access Control
 - Middleware to restrict access based on role.
 - Visitors: public only; Users: dashboard, payments; Organizers: own events/payments; Admin: all.

9. State Transition Logic
 - Ensure all transitions (event, payment, ticket) are explicit and verifiable.
 - No automation—actions require user/admin intent.

10. Testing & Failure Handling
 - Test all flows, including edge/failure cases (wrong receipt, event cancellation, payment rejection).

Recommended Build Order:

Database schema (Drizzle + Neon)
Authentication & role logic
Public event browsing
User dashboard & ticket reservation/payment
Organizer dashboard & event creation
Admin dashboard & moderation
File upload integration
Permission middleware
State transition logic
UI polish & error handling