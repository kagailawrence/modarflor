"use client";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";

export default function ServiceImageClient({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      width={500}
      height={350}
      className="w-full md:w-[500px] h-[350px] object-cover rounded border mb-4 md:mb-0"
    />
  );
}
