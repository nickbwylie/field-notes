import { TripReport } from "@/components/TripReport";
import Home from "@/pages/Home";
import { TripSearch } from "@/pages/TripSearch";
import { Route, Routes } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trips/:slug" element={<TripReport />} />
      <Route path="/trips/" element={<TripSearch />} />
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
};
