import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router";
import campfireIcon from "../assets/campfire-icon.svg"; // adjust path

export type Route = "Home" | "Trips" | "About";

export const Header = () => {
  const activeStyle = "bg-[#f5f4f1] text-black opacity-100 ";

  const Routes: { name: Route; path: string }[] = [
    { name: "Home", path: "/" },
    { name: "Trips", path: "/trips/" },
  ];
  const locationRoute = useLocation();
  const nav = useNavigate();

  const isActive = (path: string) =>
    path === "/"
      ? locationRoute.pathname === "/"
      : locationRoute.pathname.startsWith(path);

  return (
    <div className="flex w-full flex-row items-center justify-between gap-2">
      {/* logo */}
      <div
        className="flex min-w-0 cursor-pointer items-center gap-3"
        onClick={() => nav("/")}
      >
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ">
          <img src={campfireIcon} alt="" className="h-12 w-12 shrink-0" />
        </span>
        <div className="flex min-w-0 flex-col">
          <div className="text-md truncate font-bold text-black">
            Wylie's Field Notes
          </div>
          <div className="hidden text-xs font-extralight uppercase leading-3 opacity-50 sm:block">
            A Backcountry Journal
          </div>
        </div>
      </div>

      {/* navigation */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {Routes.map((currentRoute) => (
          <div
            key={currentRoute.name}
            className={`cursor-pointer rounded-md px-2 py-1 text-sm opacity-50 ${isActive(currentRoute.path) && activeStyle}`}
            onClick={() => nav(`${currentRoute.path.toLowerCase()}`)}
          >
            {currentRoute.name}
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center">
        <Button variant="default" size="sm" className="text-sm">
          Subscribe
        </Button>
      </div>
    </div>
  );
};
