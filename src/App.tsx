import { useRef } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { Header } from "./components/Header";
import { AppRoutes } from "./routing/AppRoutes";

function App() {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        ref={ref}
        className="sticky top-0 z-40 w-full border-b border-b-gray-200 bg-white pb-4"
      >
        <div className="mx-auto flex w-full max-w-[1200px] px-3 pt-4 sm:pt-6">
          <Header />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 pb-10 pt-8 sm:gap-16 sm:px-6 sm:pb-16 sm:pt-16">
        <AppRoutes />
        {/* hero section
        <Hero trip={tripData[0]} />
        <FeaturedPill tags={featuredPills} />
        <TripReportGrid trips={tripData} /> */}
        {/* <TripReport trip={bellMountain} /> */}
        {/* a couple of trips by different tags hiking, backpacking, lesson learned */}
      </div>
    </>
  );
}

export default App;
