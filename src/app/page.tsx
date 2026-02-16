import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Welcome to your application</h1>
      <p>The development server is now running correctly.</p>
      <Link href="/admin/dashboard">
        Go to the Admin Dashboard
      </Link>
    </div>
  );
}
