# Backend setup: accounts, orders and the admin page

Customer sign-in, the "My orders" list and the admin page (`/#/admin`) run on
**Supabase (free tier)** with **Google sign-in**. Until these steps are done,
the site still works for browsing and building a basket, and the sign-in
button says sign-in isn't switched on yet.

Allow about 20 minutes. Everything here is free.

> **On the app being renamed to Bobobay (28 Sep 2026):** the site's visible
> name, page title and social-preview text now all say "Bobobay". The
> **Supabase project**, its **Project URL**, the **Vercel project** and the
> **Google Cloud project** underneath weren't renamed — they still say
> "freshley" internally, and that's fine, nothing there is customer-facing.
> Two things still say "Freshley" and need your own action, not code:
> - The **Google sign-in screen** (OAuth consent screen app name) — rename it
>   in Google Cloud Console → **APIs & Services** → **OAuth consent screen**
>   → **Edit app** → **App name**, if you want it to match. A name-only edit
>   doesn't reset your publish status.
> - `public/og-image.jpg`, the picture shown when the site is shared on
>   WhatsApp/Facebook/X — it has "Freshley" drawn into the image itself, plus
>   an old "100% organic" claim the site's own wording rules don't allow.
>   Needs a redesign, not a text edit — ask for a new one when you're ready.

## Status

| Step | Done |
|---|---|
| 1. Supabase project created (Mumbai) | ✅ 23 Sep 2026 |
| 2. Tables + 42 products loaded | ✅ |
| 3. `.env` filled in, site connected | ✅ |
| 4. Google sign-in switched on | ✅ |
| 5. Admin account added | ✅ |
| 6. Live on Vercel (https://freshley.vercel.app) | ✅ sign-in confirmed working |
| 7. Custom domain bobobay.com | ✅ DNS live, Vercel serving the site — finish step 7 below |
| 8. Google app published (so **any** customer can sign in) | ☐ see step 8 |

## 1. Create the Supabase project

1. Sign up at <https://supabase.com> and click **New project**.
2. Name it `freshley`, choose the region **Mumbai (ap-south-1)**, and set a
   database password. Save the password somewhere safe; the site doesn't need it.
3. Wait for the project to finish setting up (about 2 minutes).

## 2. Create the tables

1. In Supabase, open **SQL Editor** → **New query**.
2. Paste all of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
   It ends with a result of **1 row**: that's the ID of the hourly order job
   it just scheduled, which means it worked. (If Supabase warns about
   "destructive operations", click **Run this query**. It only replaces old
   versions of the security rules.)
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

1. Open the site, click **Log in / Sign up** and sign in with Google.
   **This must happen first:** Supabase only knows an email after it has signed
   in once. Run step 2 before that and it quietly adds nobody. You can close
   the details form with ×, because admins don't need customer details.
2. In Supabase **SQL Editor**, run (with your own Google email):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'your-google-email@gmail.com';
   ```

3. Reload the site (F5). The navbar now shows an **Admin** button, and
   `/#/admin` opens the staff page. Admin access is checked when the page
   loads, so an already-open tab won't notice until you reload it.

Add other staff the same way. Remove someone with
`delete from public.admins where user_id = (select id from auth.users where email = '…');`

To see who has signed in and who is an admin:

```sql
select u.email, (a.user_id is not null) as is_admin
from auth.users u
left join public.admins a on a.user_id = u.id;
```

Don't edit emails in Supabase's user list to "move" admin access. Each Google
account is its own user. Add the new person and remove the old one with the
two statements above.

## 6. Go live (Vercel)

1. In Vercel → **freshley** → **Settings** → **Environment Variables** → **Add**.
2. **Type: choose Config**, not Secret. These values aren't secret (every
   visitor's browser receives them), and with Config you can open them later
   to check for typos.
3. The quickest way: copy the two `VITE_…` lines from `.env` and paste them into
   the **Key** box. Vercel splits them into two variables. Or add them one by one:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | the Project URL from `.env` |
   | `VITE_SUPABASE_ANON_KEY` | the long `eyJ…` key from `.env` |

4. **Environments:** tick **Production** (plus Preview and Development). Save.
5. **Redeploy:** **Deployments** → top one → **⋯** → **Redeploy** (untick
   "Use existing build cache"). Variables only reach the site when it's rebuilt.
6. In Supabase → **Authentication** → **URL Configuration**, set **Site URL**
   to `https://freshley.vercel.app` and add it under **Redirect URLs** (keep the
   localhost ones for testing). If you later buy a domain, add it here too.

## 7. Custom domain: bobobay.com

`bobobay.com` already resolves to this Vercel project and serves the site
correctly over HTTPS — the DNS/Vercel side is done. Two follow-ups:

1. Supabase → **Authentication** → **URL Configuration**: change **Site
   URL** to `https://bobobay.com`, and add `https://bobobay.com` (and
   `https://www.bobobay.com` if that also resolves) under **Redirect
   URLs**. Keep `https://freshley.vercel.app` and the localhost ones there
   too — extra entries don't hurt, and it keeps the old link working.
2. Vercel → your project → **Settings** → **Environment Variables** → add
   `SITE_URL` = `https://bobobay.com` (**Production**, type Config), then
   redeploy without build cache. This makes sure WhatsApp/Facebook/X link
   previews point at `bobobay.com`, not the old `.vercel.app` address.

Vercel → **Settings** → **Domains** is also where you'd set `bobobay.com` as
the **primary** domain if you want `freshley.vercel.app` to redirect to it
instead of also serving the site directly — optional, up to you.

## 8. Let every customer sign in (publish the Google app)

A new Google app starts in **Testing** mode: only emails listed as testers can
sign in, and everyone else gets "access denied".

1. **Google Cloud Console** → **APIs & Services** → **OAuth consent screen**
   (or **Google Auth Platform** → **Audience**).
2. **Publishing status** → **Publish app** → **Confirm**. It should now say
   **In production**.

The site only asks Google for name and email, so there's no review. Customers
will still see "Google hasn't verified this app" (**Advanced** → **Go to …**).
To remove that notice, request verification (free) once you have your own
domain and a real privacy-policy page.

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

## Troubleshooting

| What you see | Cause | Fix |
|---|---|---|
| "Sign-in isn't switched on yet" on the live site | The Vercel build has no keys | Check step 6 (names spelled exactly, **Production** ticked, type **Config**), then redeploy without build cache |
| After Google, the page goes to `localhost` and can't connect | Supabase doesn't know the live address | Step 6.6: set Site URL and Redirect URLs |
| "Access blocked" / "access denied" from Google for customers | Google app still in Testing | Step 7: publish the app |
| "redirect_uri_mismatch" from Google | Callback address in Google Cloud is wrong | It must be exactly `https://<project-ref>.supabase.co/auth/v1/callback` |
| An admin gets the customer details form | Their account isn't in `admins` | Run the "who is an admin" query in step 5; re-add them, then reload |
| Typing `VITE_…=…` in the terminal does nothing useful | Those lines belong in the `.env` **file**, not PowerShell | Open `.env` in VS Code, paste there, save |

## Free-tier limits worth knowing

- A free project **pauses after 7 days with no visits**. Restore it with one
  click from the Supabase dashboard. Once customers use the site daily, this
  won't happen.
- 500 MB database and 50,000 monthly sign-ins, far beyond what launch needs.
