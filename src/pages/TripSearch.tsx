import { getAllTrips } from "@/apiCalls/api";
import { TripCard, TripCardSkeleton } from "@/components/TripCard";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TripFrontmatter } from "@/types/MyTypes";

import { ListFilter, Search, SearchX, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

// const tripData: TripFrontmatter[] = [
//   {
//     id: 21341234,
//     title: "Bell Mountain Wilderness Overnight",
//     type: "Backpacking",
//     created_at: "2025-10-12",
//     region: "St. Francois Mtns, MO",
//     location_area: "Bell Mountain Wilderness",
//     location_state: "MO",
//     location_lat: "37.7126",
//     location_lng: "-90.8861",
//     tags: ["glades", "rhyolite", "solitude", "wilderness"],
//     excerpt:
//       "A two-day loop through ancient rhyolite glades to a bald summit and a quiet backcountry camp under the oaks — some of the oldest rock in North America, and the closest Missouri gets to standing on top of something.",
//     hero_image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Sh6WggQoIQh0B7N_9jgVVERVGkIuNY42_a_mgKqciQ&s=10",
//     gpx_url: "",
//     featured: true,
//     distance_mi: 9.8,
//     elevation_gain_ft: 1470,
//     nights: 1,
//     difficulty: "Moderate",
//     route_shape: "Loop",
//     high_point_ft: 1702,
//     reading_time_min: 10,
//   },
//   {
//     id: 21341235,
//     title: "Ozark Trail — Taum Sauk Section",
//     type: "Backpacking",
//     created_at: "2025-04-18",
//     region: "Iron County, MO",
//     location_area: "Ozark Trail, Taum Sauk Section",
//     location_state: "MO",
//     location_lat: "37.5806",
//     location_lng: "-90.7139",
//     tags: ["ozark-trail", "point-to-point", "creek-camp"],
//     excerpt:
//       "A rugged point-to-point through the high country toward Johnson's Shut-Ins, with a creekside camp at the midpoint.",
//     hero_image:
//       "https://tentwhirl.blog/wp-content/uploads/2017/07/cropped-img_1745.jpg",
//     gpx_url: "",
//     featured: false,
//     distance_mi: 12.8,
//     elevation_gain_ft: 2100,
//     nights: 1,
//     difficulty: "Strenuous",
//     route_shape: "Point-to-Point",
//     high_point_ft: null,
//     reading_time_min: 12,
//   },
//   {
//     id: 21341236,
//     title: "Pickle Springs Natural Area",
//     type: "Hiking",
//     created_at: "2025-03-22",
//     region: "Ste. Genevieve Co., MO",
//     location_area: "Pickle Springs Natural Area",
//     location_state: "MO",
//     location_lat: "37.7856",
//     location_lng: "-90.3061",
//     tags: ["sandstone", "box-canyon", "family-friendly"],
//     excerpt:
//       "A short, otherworldly loop through a sandstone box canyon of hoodoos, slot passages, and a cold spring.",
//     hero_image:
//       "https://www.mymoinfo.com/wp-content/uploads/2021/06/picklesprings2ktjj.jpg",
//     gpx_url: "/gpx/pickle-springs.gpx",
//     featured: false,
//     distance_mi: 2.0,
//     elevation_gain_ft: 250,
//     nights: 0,
//     difficulty: "Easy",
//     route_shape: "Loop",
//     high_point_ft: null,
//     reading_time_min: 2,
//   },
//   {
//     id: 21341237,
//     title: "Hawn State Park — Whispering Pine Trail",
//     type: "Backpacking",
//     created_at: "2025-05-10",
//     region: "Ste. Genevieve Co., MO",
//     location_area: "Hawn State Park",
//     location_state: "MO",
//     location_lat: "37.8217",
//     location_lng: "-90.2362",
//     tags: ["pine-woods", "sandstone", "creek-crossings", "backpacking"],
//     excerpt:
//       "A classic Missouri backpacking loop through piney ridges, sandstone canyons, and clear Ozark streams — probably one of the best short overnight routes close to St. Louis.",
//     hero_image:
//       "https://mostateparks.com/sites/g/files/zuston361/files/media/image/2024/08/hawn-47_34128448142_o.jpg",
//     gpx_url: "",
//     featured: false,
//     distance_mi: 9.5,
//     elevation_gain_ft: 950,
//     nights: 1,
//     difficulty: "Moderate",
//     route_shape: "Loop",
//     high_point_ft: null,
//     reading_time_min: 10,
//   },
//   {
//     id: 21341238,
//     title: "Castlewood State Park — River Scene Trail",
//     type: "Hiking",
//     created_at: "2025-06-07",
//     region: "St. Louis Co., MO",
//     location_area: "Castlewood State Park",
//     location_state: "MO",
//     location_lat: "38.5473",
//     location_lng: "-90.544",
//     tags: ["overlook", "meramec-river", "stairs", "near-stl"],
//     excerpt:
//       "A quick local hike with a surprisingly good payoff: steep wooden stairs, wooded blufftop trail, and big views over the Meramec River valley.",
//     hero_image:
//       "https://mostateparks.com/sites/g/files/zuston361/files/media/image/2024/08/castlewood3_15472506405_o.jpg",
//     gpx_url: "",
//     featured: false,
//     distance_mi: 3.25,
//     elevation_gain_ft: 315,
//     nights: 0,
//     difficulty: "Moderate",
//     route_shape: "Loop",
//     high_point_ft: null,
//     reading_time_min: 3,
//   },
//   {
//     id: 21341239,
//     title: "Hercules Glades Wilderness Overnight",
//     type: "Backpacking",
//     created_at: "2025-11-08",
//     region: "Taney County, MO",
//     location_area: "Hercules-Glades Wilderness",
//     location_state: "MO",
//     location_lat: "36.6894",
//     location_lng: "-92.9263",
//     tags: ["limestone-glades", "waterfalls", "creek-camp", "wilderness"],
//     excerpt:
//       "An Ozark wilderness route through open limestone glades, dry ridges, and pockets of creek-bottom forest, with small waterfalls tucked into Long Creek.",
//     hero_image:
//       "https://www.fs.usda.gov/sites/nfs/files/styles/thumbnail/public/legacy-media/marktwain/Hercules%20Glade.jpg?h=52d3fcb6",
//     gpx_url: "",
//     featured: false,
//     distance_mi: 12.4,
//     elevation_gain_ft: 1350,
//     nights: 1,
//     difficulty: "Strenuous",
//     route_shape: "Loop",
//     high_point_ft: null,
//     reading_time_min: 12,
//   },
//   {
//     id: 21341240,
//     title: "Elephant Rocks Braille Trail",
//     type: "Hiking",
//     created_at: "2025-02-15",
//     region: "Iron County, MO",
//     location_area: "Elephant Rocks State Park",
//     location_state: "MO",
//     location_lat: "37.6531",
//     location_lng: "-90.6889",
//     tags: ["granite", "geology", "accessible", "short-hike"],
//     excerpt:
//       "A short paved loop through massive pink granite boulders that look almost unreal for Missouri — easy mileage, but one of the most distinctive landscapes in the state.",
//     hero_image:
//       "https://mostateparks.com/sites/g/files/zuston361/files/media/image/2024/08/elephantrocks5_15657375208_o.jpg",
//     gpx_url: "",
//     featured: false,
//     distance_mi: 0.9,
//     elevation_gain_ft: 80,
//     nights: 0,
//     difficulty: "Easy",
//     route_shape: "Loop",
//     high_point_ft: null,
//     reading_time_min: 1,
//   },
//   {
//     id: 21341241,
//     title: "Devil's Backbone Wilderness",
//     type: "Backpacking",
//     created_at: "2025-12-06",
//     region: "Ozark County, MO",
//     location_area: "Devil's Backbone Wilderness",
//     location_state: "MO",
//     location_lat: "36.7367",
//     location_lng: "-92.1528",
//     tags: ["ridge-walk", "solitude", "north-fork", "wilderness"],
//     excerpt:
//       "A rougher, quieter Ozark backpacking route following narrow ridges above deep hollows, with primitive camping and a more remote feel than most Missouri trails.",
//     hero_image:
//       "https://www.fs.usda.gov/sites/nfs/files/styles/thumbnail/public/r09/marktwain/image/Devil%27sBB.jpg?h=f006e93d",
//     gpx_url: "",
//     featured: false,
//     distance_mi: 13.0,
//     elevation_gain_ft: 1300,
//     nights: 1,
//     difficulty: "Strenuous",
//     route_shape: "Loop",
//     high_point_ft: 1020,
//     reading_time_min: 12,
//   },
// ];

export const TripSearch = () => {
  const [search, setSearch] = useState("");
  const [tripData, setTripData] = useState<TripFrontmatter[] | null>();
  const [tab, setTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  // Selected tags live in the URL (?tags=a,b) so filtered views are shareable.
  const selectedTags = useMemo(
    () => (searchParams.get("tags") ?? "").split(",").filter(Boolean),
    [searchParams],
  );

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    if (next.length === 0) {
      searchParams.delete("tags");
    } else {
      searchParams.set("tags", next.join(","));
    }
    setSearchParams(searchParams, { replace: true });
  };

  const clearTags = () => {
    searchParams.delete("tags");
    setSearchParams(searchParams, { replace: true });
  };

  // Every tag in the catalog, with trip counts, most common first.
  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const trip of tripData ?? []) {
      for (const tag of trip.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [tripData]);

  const trips = useMemo(() => {
    if (!tripData || tripData.length === 0) return [];

    return tripData.filter(
      (val) =>
        val.title.toLowerCase().startsWith(search.toLowerCase()) &&
        (tab !== "all" ? val.type.toLowerCase() === tab : true) &&
        selectedTags.every((t) => (val.tags ?? []).includes(t)),
    );
  }, [search, tab, tripData, selectedTags]);
  useEffect(() => {
    async function getTrips() {
      setTripData(await getAllTrips());
    }

    getTrips();
  }, []);

  console.log("ttrip search", tripData);
  return (
    <div className="w-full flex flex-col">
      <div className="text-3xl md:text-4xl font-semibold">Trip Reports</div>
      <div className="text-md opacity-60 mt-2 md:max-w-1/2">
        Every route I've documented from hiking days trips in Missouri to
        overnight backpacking in Grand Teton National Park.
      </div>
      <div className="w-full flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center mt-4">
        <InputGroup className="max-w-md flex items-center">
          <InputGroupInput
            placeholder="Search by trip title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          {/* <InputGroupAddon align="inline-end">12 results</InputGroupAddon> */}
        </InputGroup>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger
              value="all"
              className="p-2"
              onClick={() => setTab("all")}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="hiking"
              className="p-2"
              onClick={() => setTab("hiking")}
            >
              Hiking
            </TabsTrigger>
            <TabsTrigger
              value="backpacking"
              className="p-2"
              onClick={() => setTab("backpacking")}
            >
              Backpacking
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger
            className={`flex w-fit items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition ${
              filterOpen || selectedTags.length > 0
                ? "border-green-800 text-green-800"
                : "border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            <ListFilter className="h-4 w-4" />
            Filter
            {selectedTags.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-800 text-xs text-white">
                {selectedTags.length}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-3">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const active = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition ${
                      active
                        ? "border-green-800 bg-green-800 text-white"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span className="capitalize">
                      {tag.name.replaceAll("-", " ")}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={clearTags}
                className="mt-3 text-sm text-stone-500 transition hover:text-stone-800"
              >
                Clear all
              </button>
            )}
          </PopoverContent>
        </Popover>
        <div className="flex grow justify-start text-sm text-gray-500 sm:justify-end">{`${trips.length} results`}</div>
      </div>
      {selectedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="flex items-center gap-1.5 rounded-full bg-green-800 px-3 py-1 text-sm text-white transition hover:bg-green-700"
            >
              <span className="capitalize">{tag.replaceAll("-", " ")}</span>
              <X className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      )}
      <Separator orientation="horizontal" className="my-4" />

      {tripData == null ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((val) => (
            <TripCardSkeleton key={val} />
          ))}
        </div>
      ) : trips.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.title} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center">
          <SearchX className="h-8 w-8 text-stone-400" />
          <div className="text-lg font-semibold">No trips match</div>
          <div className="max-w-sm text-sm text-stone-500">
            {search || selectedTags.length > 0 || tab !== "all"
              ? "Try removing a filter or clearing your search — the trip you're after might be hiding behind one."
              : "No trip reports yet. Check back soon."}
          </div>
          {(search || selectedTags.length > 0) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                clearTags();
              }}
              className="mt-1 rounded-lg border border-stone-300 px-4 py-1.5 text-sm text-stone-700 transition hover:bg-stone-100"
            >
              Clear search and filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
