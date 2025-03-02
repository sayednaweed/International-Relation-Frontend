import Auth from "./news/auth";

import NewSection from "./news/news-section";
import SliderSection from "./news/slider";

export default function HomePage() {
  return (
    <div>
      <SliderSection />
      <NewSection />
      <Auth />
    </div>
  );
}
