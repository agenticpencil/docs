import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import ApiDemo from "@/components/ApiDemo";
import Features from "@/components/Features";
import Analysis from "@/components/Analysis";
import DataSources from "@/components/DataSources";
import Comparison from "@/components/Comparison";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function Home() {
  return (
    <>
      <SchemaMarkup />
      <Nav />
      <Hero />
      <Statement />
      <ApiDemo />
      <Features />
      <Analysis />
      <DataSources />
      <Comparison />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}
