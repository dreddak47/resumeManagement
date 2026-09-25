import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { VibeScroll } from "@/components/sections/vibe-scroll";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Research } from "@/components/sections/research";
import { Interests } from "@/components/sections/interests";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <VibeScroll />
        <About />
        <Experience />
        <Projects />
        <Research />
        <Interests />
      </main>
      <Footer />
    </div>
  );
}
