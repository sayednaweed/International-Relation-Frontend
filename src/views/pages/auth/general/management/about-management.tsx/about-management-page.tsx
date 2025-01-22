import DirectorSection from "./sections/director-section";
import ManagerSection from "./sections/manager-section";
import OfficeInfo from "./sections/office-info";
import TechnicalSection from "./sections/technical-section";

export default function AboutManagementPage() {
  return (
    <>
      <TechnicalSection />
      <DirectorSection />
      <ManagerSection />
      <OfficeInfo />
    </>
  );
}
