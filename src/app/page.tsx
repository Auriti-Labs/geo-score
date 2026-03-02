import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSignals } from "@/components/landing/TrustSignals";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FaqSection } from "@/components/landing/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSignals />
      <HowItWorks />
      <FaqSection />
    </>
  );
}
