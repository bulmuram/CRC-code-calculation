import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10">
      <Link
        className="font-medium text-blue-400 underline hover:no-underline"
        href="/crc-visualize"
      >
        Crc Visualizer
      </Link>
    </div>
  );
}
