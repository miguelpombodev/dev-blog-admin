import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-800 p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link href="/articles/create" className="hover:text-secondary">
          Create Article
        </Link>
        <Link href="/articles/manage" className="hover:text-secondary">
          Manage Articles
        </Link>
      </nav>
    </aside>
  );
}
