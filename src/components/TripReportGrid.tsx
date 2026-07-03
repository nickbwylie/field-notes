import type { TripFrontmatter } from "../types/MyTypes";
import { TripCard } from "./TripCard";
import { Separator } from "./ui/separator";

interface TripReportGridProps {
  trips: TripFrontmatter[];
}

export const TripReportGrid = ({ trips }: TripReportGridProps) => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2 ">
        <div className="text-2xl font-semibold">Recent trip reports</div>
        <div className="w-full flex flex-row justify-between">
          <div className="text-sm opacity-60">
            Field-tested routes, gear notes, and lessons learned on the trail.
          </div>
          <div className="uppercase text-sm font-semibold text-green-800 tracking-widest">
            View all →
          </div>
        </div>

        <Separator orientation="horizontal" className="h-0.5" />
      </div>
      {/* card grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {trips.map((trip) => (
          <TripCard key={trip.title} trip={trip} />
        ))}
      </div>
    </div>
  );
};
