import Hero from "@/components/Hero";
import type { TripFrontmatter } from "@/types/MyTypes";
import { FeaturedPill } from "@/components/FeaturedPill";
import { TripReportGrid } from "@/components/TripReportGrid";
import { getTrips } from "../apiCalls/api";
import { useEffect, useState } from "react";

const Home = () => {
  // lets write some code to fetch hiking trail and display
  const featuredPills = [
    {
      name: "Hiking",
      description: "4 day trips",
    },
    {
      name: "Backpacking",
      description: "4 overnights",
    },
    {
      name: "Lessons Learned",
      description: "3 lessons",
    },
  ];

  const [tripData, setTripData] = useState<TripFrontmatter[]>([]);

  useEffect(() => {
    async function call() {
      setTripData(await getTrips());
    }

    call();
  }, []);

  return (
    <div className="flex w-full flex-col justify-center gap-10 sm:gap-16">
      {tripData.length > 0 && <Hero trip={tripData[0]} />}
      <FeaturedPill tags={featuredPills} />

      <TripReportGrid trips={tripData} />
    </div>
  );
};

export default Home;
