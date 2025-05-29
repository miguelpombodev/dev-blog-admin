import Link from "next/link";
import { FilePlus2, ChartColumnDecreasing, Tag } from "lucide-react";
import LargeButton from "./LargeButton";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black p-6 text-white">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <LargeButton>
          <FilePlus2 width={20} height={20} />
          <Link href="/articles/create" className="w-full">
            Create Article
          </Link>
        </LargeButton>
        <LargeButton>
          <ChartColumnDecreasing width={20} height={20} />
          <Link href="/articles/manage" className="w-full">
            Manage Articles
          </Link>
        </LargeButton>
        <LargeButton>
          <Tag width={20} height={20} />
          <Link href="/tags/create" className="w-full">
            Manage Tags
          </Link>
        </LargeButton>
      </nav>
    </aside>
  );
}
