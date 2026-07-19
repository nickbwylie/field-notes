import Hero from "@/components/Hero";
import { WhereIveBeen } from "@/components/WhereIveBeen";
import type { TripFrontmatter } from "@/types/MyTypes";
import { TripReportGrid } from "@/components/TripReportGrid";
import { getTrips } from "../apiCalls/api";
import { useEffect, useState } from "react";

const Home = () => {
  const [tripData, setTripData] = useState<TripFrontmatter[]>([]);

  useEffect(() => {
    async function call() {
      setTripData(await getTrips());
    }

    call();
  }, []);

  const heroTrip = tripData && tripData.find((trip) => trip.id === 5);

  return (
    <div className="flex w-full flex-col justify-center gap-10 sm:gap-16">
      <Hero trip={heroTrip} />
      <WhereIveBeen trips={tripData} />
      <TripReportGrid trips={tripData} />
    </div>
  );
};

export default Home;
