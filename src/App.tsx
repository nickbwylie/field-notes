import { useRef } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import type { Trip, TripFrontmatter } from "./types/MyTypes";
import { FeaturedPill } from "./components/FeaturedPill";
import { TripReportGrid } from "./components/TripReportGrid";
import { Header } from "./components/Header";
import { TripReport } from "./components/TripReport";
import Hero from "./components/Hero";
import { AppRoutes } from "./routing/AppRoutes";

function App() {
  const ref = useRef<HTMLDivElement | null>(null);

  const tripData: TripFrontmatter[] = [
    {
      slug: "bell-mountain",
      title: "Bell Mountain Wilderness Overnight",
      type: "Backpacking",
      date: "2025-10-12",
      region: "St. Francois Mtns, MO",
      location: {
        area: "Bell Mountain Wilderness",
        state: "MO",
        lat: 37.7126,
        lng: -90.8861,
      },
      tags: ["glades", "rhyolite", "solitude", "wilderness"],
      excerpt:
        "A two-day loop through ancient rhyolite glades to a bald summit and a quiet backcountry camp under the oaks — some of the oldest rock in North America, and the closest Missouri gets to standing on top of something.",
      heroImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Sh6WggQoIQh0B7N_9jgVVERVGkIuNY42_a_mgKqciQ&s=10",
      //gpxUrl: '/gpx/bell-mountain.gpx',
      featured: true,
      stats: {
        distanceMi: 9.8,
        elevationGainFt: 1470,
        nights: 1,
        difficulty: "Moderate",
        routeShape: "Loop",
        highPointFt: 1702,
      },
    },
    {
      slug: "ozark-trail-taum-sauk",
      title: "Ozark Trail — Taum Sauk Section",
      type: "Backpacking",
      date: "2025-04-18",
      region: "Iron County, MO",
      location: {
        area: "Ozark Trail, Taum Sauk Section",
        state: "MO",
        lat: 37.5806,
        lng: -90.7139,
      },
      tags: ["ozark-trail", "point-to-point", "creek-camp"],
      excerpt:
        "A rugged point-to-point through the high country toward Johnson’s Shut-Ins, with a creekside camp at the midpoint.",
      heroImage:
        "https://tentwhirl.blog/wp-content/uploads/2017/07/cropped-img_1745.jpg",
      //gpxUrl: "/gpx/ot-taum-sauk.gpx",
      stats: {
        distanceMi: 12.8,
        elevationGainFt: 2100,
        nights: 1,
        difficulty: "Strenuous",
        routeShape: "Point-to-Point",
      },
    },
    {
      slug: "pickle-springs",
      title: "Pickle Springs Natural Area",
      type: "Hiking",
      date: "2025-03-22",
      region: "Ste. Genevieve Co., MO",
      location: {
        area: "Pickle Springs Natural Area",
        state: "MO",
        lat: 37.7856,
        lng: -90.3061,
      },
      tags: ["sandstone", "box-canyon", "family-friendly"],
      excerpt:
        "A short, otherworldly loop through a sandstone box canyon of hoodoos, slot passages, and a cold spring.",
      heroImage:
        "https://www.mymoinfo.com/wp-content/uploads/2021/06/picklesprings2ktjj.jpg",
      gpxUrl: "/gpx/pickle-springs.gpx",
      stats: {
        distanceMi: 2.0,
        elevationGainFt: 250,
        nights: 0,
        difficulty: "Easy",
        routeShape: "Loop",
      },
    },
  ];
  const bellMountain: Trip = {
    // --- frontmatter ---
    slug: "bell-mountain",
    title: "Bell Mountain Wilderness Overnight",
    type: "Backpacking",
    date: "2025-10-12",
    region: "St. Francois Mtns, MO",
    location: {
      area: "Bell Mountain Wilderness",
      state: "MO",
      lat: 37.7126,
      lng: -90.8861,
    },
    tags: ["glades", "rhyolite", "solitude", "wilderness"],
    excerpt:
      "A two-day loop through ancient rhyolite glades to a bald summit and a quiet backcountry camp under the oaks.",
    heroImage: "/photos/bell-mountain/hero.jpg",
    gpxUrl: "src/assets/bell-mountain.gpx",
    featured: true,
    stats: {
      distanceMi: 9.8,
      elevationGainFt: 1470,
      nights: 1,
      difficulty: "Strenuous",
      routeShape: "Loop",
      highPointFt: 1702,
    },

    // --- rendered body (MDX → HTML) ---
    bodyHtml: `
    <p>The St. Francois Mountains don’t look like much from the highway — low, rounded, forested. But the rock underneath is roughly 1.5 billion years old, some of the oldest exposed in North America, and Bell Mountain sits right in the heart of it.</p><br />
    <p>From the Highway A trailhead the trail climbs steadily for the first ninety minutes through oak-hickory forest, dry and quiet, the canopy just starting to turn. There’s no water on the climb, so I carried three liters up.</p></br>
    <p>The payoff is the glades. Around mile three the forest opens onto bald igneous barrens — pink rhyolite, reindeer lichen, stunted cedars — and the sky just expands.</p><br />
    <p>I made camp at a dispersed site below the summit, filtered water from Ottery Creek at dusk, and watched the temperature fall fast once the sun was gone.</p>
    
  `,

    // --- structured sections ---
    routeNotes: [
      {
        label: "WATER",
        body: "Ottery Creek (mile 5.6) is the only reliable source and it’s seasonal. Filter everything; carry 3L up the dry climb.",
      },
      {
        label: "NAVIGATION",
        body: "The loop is blazed but faint across the glades — cairns help. Download the GPX, since cell service is gone past the trailhead.",
      },
      {
        label: "CAMP",
        body: "Dispersed backcountry camping, no permit (Mark Twain NF). The best sites sit just below the summit glade on the south side.",
      },
      {
        label: "BAIL-OUT",
        body: "No quick exits once you’re committed to the loop. Turn around at the summit if weather builds — the glades are fully exposed.",
      },
    ],

    gallery: [
      {
        src: "https://tentwhirl.blog/wp-content/uploads/2017/07/cropped-img_1745.jpg",
        caption: "Trailhead kiosk, first light",
        alt: "Wooden trail kiosk at dawn",
      },
      {
        src: "https://tentwhirl.blog/wp-content/uploads/2017/07/cropped-img_1745.jpg",
        caption: "The long climb through oak-hickory",
        alt: "Forested trail climbing a ridge",
      },
      {
        src: "https://tentwhirl.blog/wp-content/uploads/2017/07/cropped-img_1745.jpg",
        caption: "First glade — lichen on pink rhyolite",
        alt: "Open rocky glade with lichen",
      },
      {
        src: "https://tentwhirl.blog/wp-content/uploads/2017/07/cropped-img_1745.jpg",
        caption: "Summit bald, layered ridgelines",
        alt: "Ridgelines fading into blue distance",
      },
      {
        src: "https://tentwhirl.blog/wp-content/uploads/2017/07/cropped-img_1745.jpg",
        caption: "Ottery Creek water source at dusk",
        alt: "Small creek in low evening light",
      },
      {
        src: "https://tentwhirl.blog/wp-content/uploads/2017/07/cropped-img_1745.jpg",
        caption: "Camp below the summit",
        alt: "Solo tent under oak trees",
      },
    ],
    lessonsLearned: [
      "Three liters was right for the dry climb, but I could have cached one at the creek for the return and saved my knees on the descent.",
      "October light goes fast. I should have had camp set a full hour earlier instead of filtering water in the dark.",
      "Permethrin on the gaiters and pants was worth it — even in fall the glades had ticks.",
    ],

    wouldDoDifferently: [
      "Start at first light — the summit glade at sunrise would beat the dusk view I settled for.",
      "Leave the second fuel canister. One was plenty for a single night.",
      "Bring the lighter trail runners. The mid boots were overkill for these miles.",
    ],

    readingTimeMin: 6,
  };

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
          paddingLeft: 12,
          paddingRight: 12,
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
