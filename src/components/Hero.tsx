import type { TripFrontmatter } from "../types/MyTypes";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { dateToString } from "@/util/date";
import Buffalo from "../assets/buffalo.png";

interface HeroProps {
  trip: TripFrontmatter;
}

const Hero = ({ trip }: HeroProps) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        rowGap: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          columnGap: 12,
        }}
      >
        <span className="uppercase text-green-800 text-xs text-nowrap font-[600] tracking-widest">
          latest trip report
        </span>
        <Separator />
      </div>
      <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-full md:w-1/2 flex flex-col">
          <img
            src={Buffalo}
            alt={trip.title}
            style={{
              maxWidth: "100%",
              borderRadius: 25,
              objectFit: "cover",
            }}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              columnGap: 8,
              alignItems: "center",
            }}
            className="text-sm opacity-40 uppercase"
          >
            <div>{dateToString(trip.date)}</div>
            {/* <div></div> */}
            <div>{trip.region}</div>
          </span>
          <div className="text-5xl font-semibold mt-2">{trip.title}</div>
          <div className="text-md opacity-60 mt-4">{trip.excerpt}</div>
          <div
            style={{ width: "100%", display: "flex", columnGap: 32 }}
            className="mt-4"
          >
            <div className="text-md opacity-60">{trip.stats.distanceMi} mi</div>
            <div className="text-md opacity-60">
              {trip.stats.elevationGainFt} ft
            </div>
            <div className="text-md opacity-60">{trip.stats.nights} nights</div>
            <div className="text-md  text-red-700">{trip.stats.difficulty}</div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              columnGap: 16,
              justifyContent: "flex-start",
            }}
            className="mt-4"
          >
            <Button className="cursor-pointer">Read trip report →</Button>
            <Button variant="outline" className="cursor-pointer">
              All trips
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
