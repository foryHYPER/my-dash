Write utility functions to create Supabase clients
To access Supabase from your Next.js app, you need 2 types of Supabase clients:

Client Component client - To access Supabase from Client Components, which run in the browser.
Server Component client - To access Supabase from Server Components, Server Actions, and Route Handlers, which run only on the server.
Create a utils/supabase folder with a file for each type of client. Then copy the utility functions for each client type.


What does the `cookies` object do?
The cookies object lets the Supabase client know how to access the cookies, so it can read and write the user session data. To make @supabase/ssr framework-agnostic, the cookies methods aren't hard-coded. These utility functions adapt @supabase/ssr's cookie handling for Next.js.

The set and remove methods for the server client need error handlers, because Next.js throws an error if cookies are set from Server Components. You can safely ignore this error because you'll set up middleware in the next step to write refreshed cookies to storage.

The cookie is named sb-<project_ref>-auth-token by default.


Do I need to create a new client for every route?
Yes! Creating a Supabase client is lightweight.

On the server, it basically configures a fetch call. You need to reconfigure the fetch call anew for every request to your server, because you need the cookies from the request.
On the client, createBrowserClient already uses a singleton pattern, so you only ever create one instance, no matter how many times you call your createClient function.

Hook up middleware
Create a middleware.ts file at the root of your project, or inside the ./src folder if you are using one.

Since Server Components can't write cookies, you need middleware to refresh expired Auth tokens and store them.

The middleware is responsible for:

Refreshing the Auth token (by calling supabase.auth.getUser).
Passing the refreshed Auth token to Server Components, so they don't attempt to refresh the same token themselves. This is accomplished with request.cookies.set.
Passing the refreshed Auth token to the browser, so it replaces the old token. This is accomplished with response.cookies.set.
Copy the middleware code for your app.

Add a matcher so the middleware doesn't run on routes that don't access Supabase.

Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.

Always use supabase.auth.getUser() to protect pages and user data.

Never trust supabase.auth.getSession() inside server code such as middleware. It isn't guaranteed to revalidate the Auth token.

It's safe to trust getUser() because it sends a request to the Supabase Auth server every time to revalidate the Auth token.