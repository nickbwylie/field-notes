import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/"
      ? locationRoute.pathname === "/"
      : locationRoute.pathname.startsWith(path);

  const goTo = (path: string) => {
    setMenuOpen(false);
    nav(path.toLowerCase());
  };

  return (
    <div className="relative flex w-full flex-row items-center justify-between gap-2">
      {/* logo */}
      <div
        className="flex min-w-0 cursor-pointer items-center "
        onClick={() => goTo("/")}
      >
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
          <img src={campfireIcon} alt="" className="h-12 w-12 shrink-0" />
        </span>
        <div className="flex min-w-0 flex-col">
          <div className="text-md truncate font-bold text-black">
            Wylie's Field Notes
          </div>
          <div className=" text-xs font-extralight uppercase leading-3 opacity-50 sm:block">
            A Backcountry Journal
          </div>
        </div>
      </div>

      {/* desktop navigation */}
      <div className="hidden shrink-0 items-center gap-3 sm:flex">
        {Routes.map((currentRoute) => (
          <div
            key={currentRoute.name}
            className={`cursor-pointer rounded-md px-2 py-1 text-sm opacity-50 ${isActive(currentRoute.path) && activeStyle}`}
            onClick={() => goTo(currentRoute.path)}
          >
            {currentRoute.name}
          </div>
        ))}
      </div>

      <div className="hidden shrink-0 items-center sm:flex">
        <Button variant="default" size="sm" className="text-sm">
          Subscribe
        </Button>
      </div>

      {/* mobile hamburger */}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 sm:hidden"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* mobile menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-1 rounded-lg border border-black/10 bg-white p-2 shadow-lg sm:hidden">
          {Routes.map((currentRoute) => (
            <div
              key={currentRoute.name}
              className={`cursor-pointer rounded-md px-3 py-2 text-sm opacity-50 ${isActive(currentRoute.path) && activeStyle}`}
              onClick={() => goTo(currentRoute.path)}
            >
              {currentRoute.name}
            </div>
          ))}
          <Button variant="default" size="sm" className="mt-1 text-sm">
            Subscribe
          </Button>
        </div>
      )}
    </div>
  );
};
