# Backend setup: accounts, orders and the admin page

Customer sign-in, the "My orders" list and the admin page (`/#/admin`) run on
**Supabase (free tier)** with **Google sign-in**. Until these steps are done,
the site still works for browsing and building a basket, and the sign-in
button says sign-in isn't switched on yet.

Allow about 20 minutes. Everything here is free.

## 1. Create the Supabase project

1. Sign up at <https://supabase.com> and click **New project**.
2. Name it `freshley`, choose the region **Mumbai (ap-south-1)**, and set a
   database password. Save the password somewhere safe; the site doesn't need it.
3. Wait for the project to finish setting up (about 2 minutes).

## 2. Create the tables

1. In Supabase, open **SQL Editor** → **New query**.
2. Paste all of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
   You should see "Success. No rows returned".
3. Open a new query, paste [`supabase/seed-products.sql`](supabase/seed-products.sql)
   and click **Run**. This loads the 42 vegetables and greens.

## 3. Connect the site

1. In Supabase, open **Project Settings** → **API** (or **API Keys**).
2. Copy the **Project URL** and the **anon / public** key.
3. In the project folder, copy `.env.example` to `.env` and paste both values.
   `.env` is already in `.gitignore`, so it won't be committed.
4. Stop and restart `npm run dev`. Vite only reads `.env` at startup.

> Never paste the **service_role** key into `.env` or anywhere on the site. It
> bypasses all security rules.

## 4. Turn on Google sign-in

**In Google Cloud** (<https://console.cloud.google.com>):

1. Create a project called `Freshley`.
2. Go to **APIs & Services** → **OAuth consent screen**: choose **External**,
   set the app name to `Freshley`, and add your support email. Save.
3. Go to **Credentials** → **Create credentials** → **OAuth client ID**, and choose
   **Web application**.
4. Under **Authorized redirect URIs**, add:
   `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
   (It's your Project URL from step 3 followed by `/auth/v1/callback`.)
5. Click **Create**, then copy the **Client ID** and **Client secret**.

**In Supabase:**

6. Go to **Authentication** → **Sign In / Providers** → **Google**. Turn it on,
   paste the Client ID and secret, and save.
7. Go to **Authentication** → **URL Configuration**:
   - **Site URL**: your live address, e.g. `https://freshley.in`
   - **Redirect URLs**: add `http://localhost:5173`, `http://localhost:4173`
     and your live address.

## 5. Make yourself an admin

1. Open the site, click **Log in / Sign up**, sign in with Google, and fill in
   your details.
2. In Supabase **SQL Editor**, run (with your own Google email):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'your-google-email@gmail.com';
   ```

3. Reload the site. Your dashboard now shows an **Admin** button, and
   `/#/admin` opens the staff page.

Add other staff the same way. Remove someone with
`delete from public.admins where user_id = (select id from auth.users where email = '…');`

## 6. Go live (Vercel)

In Vercel → your project → **Settings** → **Environment Variables**, add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values as `.env`,
then redeploy.

## How orders work

- A customer's **subscription** holds their basket and delivery day.
- The database creates the **order** for their next delivery automatically,
  and keeps it matched to the subscription until **12 pm the day before**
  (India time). After that the order is locked, and the packing list won't change.
- An hourly job (`pg_cron`, included free) creates the following week's order
  once the current one locks.
- On the admin **Orders** tab, pick a date to see that day's packing list and
  item totals. Move each basket through Scheduled → Packed → Delivered, or
  mark it Skipped.

## Free-tier limits worth knowing

- A free project **pauses after 7 days with no visits**. Restore it with one
  click from the Supabase dashboard. Once customers use the site daily, this
  won't happen.
- 500 MB database and 50,000 monthly sign-ins, far beyond what launch needs.
