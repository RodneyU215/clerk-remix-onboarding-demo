import type {
  LoaderFunction,
  LoaderFunctionArgs,
} from '@remix-run/node';
import { redirect } from '@remix-run/node';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import { getAuth, rootAuthLoader } from '@clerk/remix/ssr.server';

import { ClerkApp, ClerkErrorBoundary, useUser } from '@clerk/remix';

type Metadata = {
  hasCompletedOnboarding?: boolean;
};

const onboardingLoader: (
  args: unknown
) => Promise<NonNullable<unknown>> = async (args) => {
  const { request } = args as LoaderFunctionArgs;
  const url = new URL(request.url);
  const { userId, sessionClaims } = await getAuth(
    args as LoaderFunctionArgs
  );
  if (['/sign-in', '/sign-up'].includes(url.pathname)) {
    if (userId) {
      return redirect('/');
    }
    return {};
  }

  if (!userId) {
    return redirect('/sign-in');
  }

  const metadata = sessionClaims.metadata as Metadata | undefined;
  if (!metadata || !metadata.hasCompletedOnboarding) {
    if (url.pathname !== '/onboarding') {
      return redirect('/onboarding');
    }
    return {};
  }

  if (url.pathname === '/onboarding') {
    return redirect('/');
  }

  return {};
};

export const loader: LoaderFunction = (args) =>
  rootAuthLoader(args, onboardingLoader);

export const ErrorBoundary = ClerkErrorBoundary();

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App);
