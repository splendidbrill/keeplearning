import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <main>
      <h1>Keep Learning</h1>
     </main>
     <footer>
      <p>Copyright 2025 Keep Learning</p>
     </footer>
     <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
     </nav>
    </div>
  );
}
