import "@/styles/globals.css";
import ClientLayout from "./clientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-neutral-900 text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
