import { Github } from "lucide-react";

export default function Home() {
  return (
    <section className="flex items-center justify-center">
      <a
        href={`${process.env.APP_URL}/auth/github`}
        className="flex gap-2 px-4 py-2 bg-black text-white rounded-[10] border-1 border-white font-bold"
      >
        <Github width={20} height={20} />
        Login with GitHub
      </a>
    </section>
  );
}
