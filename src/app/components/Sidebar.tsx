import Link from "next/link";
import { FilePlus2, ChartColumnDecreasing } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black p-6 text-white">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <span className="flex items-center p-2 bg-secondary font-bold text-center rounded-[10] hover:brightness-92">
          <FilePlus2 width={20} height={20} />
          <Link href="/articles/create" className="w-full">
            Create Article
          </Link>
        </span>
        <span className="flex items-center p-2 bg-secondary font-bold text-center rounded-[10] hover:brightness-92">
          <ChartColumnDecreasing width={20} height={20} />
          <Link href="/articles/manage" className="w-full">
            Manage Articles
          </Link>
        </span>
      </nav>
    </aside>
  );
}
