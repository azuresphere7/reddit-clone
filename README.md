# Reddit Cloned Social Media Post

[T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Technologies Used

- [Next.js](https://nextjs.org)
- [Clerk](https://clerk.com)
- [Shadcn-UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)
- [PlanetScale](https://planetscale.com)

## How to Run the Project

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) and navigate to `Developers -> API Keys` to copy your keys to the clipboard. Create a file named `.env.local` and add the following:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY='YOUR CLERK PUBLISHABLE KEY'
CLERK_SECRET_KEY='YOUR CLERK SECRET KEY'
```

2. Create an .env file to the root project and paste your `PlanetScale` database URL. Get the Database URL from the `prisma` dropdown selector in `PlanetScale`
```bash
DATABASE_URL='YOUR DATABASE URL'
```

3. Install pnpm

```bash
npm i -g pnpm
```

4. Install the dependencies:

```bash
pnpm install
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.