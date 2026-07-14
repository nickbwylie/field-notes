import { TripReport } from "@/components/TripReport";
import Home from "@/pages/Home";
import { TripSearch } from "@/pages/TripSearch";
import type { Trip } from "@/types/MyTypes";
import { Route, Routes } from "react-router-dom";

export const AppRoutes = () => {
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
    gpxUrl: "/gpx/bell-mountain.gpx",
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trips/:slug" element={<TripReport />} />
      <Route path="/trips/" element={<TripSearch />} />
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
};
