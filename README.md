# 💻 Chameleon URL

Marketing campaigns url shortener SAAS

## Run locally
- You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)
- Create a `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

- You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```
   
## 👨‍💻 Maintainers/Contributors

* David Costa - [scostadavid@proton.me](mailto:scostadavid@proton.me)
