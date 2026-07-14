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
        style={{
          width: "100%",
          paddingBottom: 16,
        }}
        className="border-b-gray-200 border-b"
      >
        <div
          style={{
            display: "flex",
            position: "sticky",
            justifySelf: "center",
            width: "100%",
            maxWidth: 1200,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 24,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Header />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 64,
          marginLeft: "auto",
          marginRight: "auto",
          rowGap: 64,
          display: "flex",
          flexDirection: "column",
          paddingBottom: 64,
          justifyContent: "center",
        }}
      >
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
