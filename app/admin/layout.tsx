
export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Hello Root Layout Admin</h1>
      {children}
    </div>
  );
}