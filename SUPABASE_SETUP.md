# Supabase Setup Guide (for non-technical staff)

This guide connects the website to a Supabase database so your team can
upload adoptable animal photos and success stories without a developer.

**The website works fine without Supabase.** If you skip this entirely,
the site keeps showing its built-in sample content. Nothing breaks.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up / log in.
2. Click **New Project**.
3. Choose an organization, give the project a name (e.g. "Prakriti Foundation"),
   set a database password (save it somewhere safe), pick a region close to
   India, and click **Create new project**. Wait a minute or two for it to finish.

## 2. Run the two migration files

1. In the left sidebar of your new project, click **SQL Editor**.
2. Click **New query**.
3. Open the file `supabase/migrations/20260910000001_adoption_and_content.sql`
   from this project on your computer, copy its entire contents, paste them
   into the SQL editor, and click **Run**.
4. You should see "Success. No rows returned."

### About the second migration file — READ BEFORE RUNNING

`supabase/migrations/20260910000002_tighten_rls.sql` locks down donor and
member records so they can no longer be read publicly. **Do not run it yet.**
There is an open question about donation receipts (explained in a comment
at the top of that file) that must be checked first by a developer against
this live project. Ask your developer to confirm that generating a donation
receipt in the admin panel actually saves before this file is run. Once
confirmed, come back here, open that file, copy its contents into a new
SQL Editor query, and click **Run** the same way as step 2 above.

## 3. Create your admin login — REQUIRED, read before deploying

The `/admin` dashboard now requires signing in with a real Supabase account.
**Once this change is deployed, `/admin` cannot be opened by anyone until
you complete this step.**

1. In the left sidebar, click **Authentication**, then **Users**.
2. Click **Add user** > **Create new user**.
3. Enter a real email address and a strong password for whoever should have
   dashboard access. Make sure **Auto Confirm User** is checked (or confirm
   the account another way) so it can sign in immediately.
4. Repeat for anyone else who needs access. Share each password with its
   owner through a secure channel, not email or chat.
5. This email and password are what you type into the `/admin` login form.

**If this site already has a working Supabase project in production**, the
person who currently uses the admin dashboard must have a user created for
them here *before* this update ships — otherwise they will be locked out
of `/admin` the moment it goes live.

### Turn off public sign-ups

By default Supabase lets anyone create an account, and any signed-in account
can read the admin data your database policies protect. Turn that off:

1. Click **Authentication** > **Providers** > **Email**.
2. Disable **Enable sign ups**.
3. Save. New admin users can now only be added by you, from the Users page
   in step 3 above.

## 4. Confirm the storage bucket

1. In the left sidebar, click **Storage**.
2. You should see a bucket named **content** with a "Public" label next to it.
   This was created automatically by the first migration.
3. If you don't see it, re-check step 2 ran without errors.

## 5. Copy your project URL and key

1. In the left sidebar, click **Project Settings** (the gear icon), then **API**.
2. Copy the **Project URL**.
3. Copy the **anon public** key (do NOT use the "service_role" key — that one
   must stay secret and never be put in this website).

## 6. Add the keys to Vercel

1. Go to [vercel.com](https://vercel.com) and open this project.
2. Click **Settings** > **Environment Variables**.
3. Add two variables:
   - `VITE_SUPABASE_URL` = the Project URL you copied
   - `VITE_SUPABASE_ANON_KEY` = the anon public key you copied
4. Apply them to all environments (Production, Preview, Development).
5. Redeploy the site (Vercel usually prompts you to do this automatically,
   or go to **Deployments** and click **Redeploy** on the latest one).

## 7. Try it out

1. Visit `your-site-url.com/admin` and log in.
2. Click the **Content** tab.
3. Add an adoptable animal or a success story, including a photo.
4. Visit the homepage and confirm your new entry appears in the
   "Up for Adoption" or "Success Stories" section.

## Troubleshooting

- **Nothing changed on the homepage after adding content** — hard refresh
  the page (Ctrl+Shift+R / Cmd+Shift+R), and double check the environment
  variables in Vercel are spelled exactly as shown above.
- **Upload fails with an error message** — the error will tell you what
  went wrong; share it with your developer.
- **Can't log in to `/admin`** — confirm a user exists under
  **Authentication** > **Users** (step 3), that the email was auto-confirmed,
  and that the environment variables in step 6 are set correctly.
- **Still showing the old sample photos** — that's expected until you add
  at least one row of your own content in the admin Content tab.
