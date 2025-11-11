import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import Features from "./components/landing/Features";
import Benefits from "./components/landing/Benefits";
import Pricing from "./components/landing/Pricing";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 min-h-screen">
      <Navbar />
      <Hero/>
      <HowItWorks />
      <Features />
      <Benefits />
      <Pricing />
      <Footer />
    </div>
  );
}