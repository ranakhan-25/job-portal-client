import Hero from "@/components/home/Hero-section";
import Testimonials from "@/components/home/Testimonials";
import LandingPage from "@/components/home/LandingPage";


export default function Home() {
  return (
    <div>
      <Hero />
      <LandingPage/>
      <Testimonials/>
    </div>
  );
}
