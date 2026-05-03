import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import CategoryGrid from "@/components/sections/CategoryGrid";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import "./page.css";

export const metadata: Metadata = {
  title: "Free Worksheets for Kids",
  description:
    "Discover free printable worksheets for kids in math, English, and more. Browse categories, download worksheets, and support easy learning at home or school.",
};

export default function Home() {
  return (
    <main className="home-main">
      <Hero />
      <WhyChooseUs />
      <CategoryGrid />
    </main>
  );
}
