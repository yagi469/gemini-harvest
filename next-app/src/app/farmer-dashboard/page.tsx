import { redirect } from "next/navigation";

export default async function FarmerDashboardPage() {
  // The middleware handles authentication and role-based access.
  // If this page is reached, it means the user is authenticated and has the 'farmer' role.

  // You might want to fetch user details here if needed for display,
  // but not for authentication/authorization.
  // For example, if you need the user's first name, you might fetch it from a database
  // or use a client-side hook if the data is available on the client.

  return (
    <div>
      <h1>農家ダッシュボード</h1>
      <p>ようこそ、農家さん！</p>
      {/* 農家専用のコンテンツ */}
    </div>
  );
}