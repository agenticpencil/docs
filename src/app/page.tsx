import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import ApiDemo from "@/components/ApiDemo";
import Features from "@/components/Features";
import Analysis from "@/components/Analysis";
import DataSources from "@/components/DataSources";
import Comparison from "@/components/Comparison";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Statement />
      <ApiDemo />
      <Features />
      <Analysis />
      <DataSources />
      <Comparison />
      <FinalCta />
      <Footer />
    </>
  );
}
