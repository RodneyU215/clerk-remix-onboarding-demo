import { type MetaFunction } from '@remix-run/node';
import { UserButton } from '@clerk/remix';

export const meta: MetaFunction = () => {
  return [
    { title: 'Clerk + Remix Demo App' },
    {
      name: 'description',
      content: 'Welcome to a Clerk + Remix demo!',
    },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Index route</h1>
      <p>You are signed in!</p>
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}
