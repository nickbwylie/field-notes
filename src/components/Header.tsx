import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router";

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
    <div
      style={{
        width: "100%",
        display: "flex",
        // justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      {/* logo */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          width: "33.3%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <span
            data-dc-tpl="9"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "#2f6b46",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              data-dc-tpl="10"
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "2px solid rgb(255, 255, 255)",
              }}
            ></span>
          </span>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <div className="text-md text-black font-bold flex justify-start">
              Wylie's Field Notes
            </div>
            <div className="text-xs opacity-50 font-extralight uppercase flex justify-start leading-3">
              A Backcountry Journal
            </div>
          </div>
        </div>
      </div>

      {/* navigation */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 18,
          alignItems: "center",
          width: "33.3%",
          justifyContent: "center",
        }}
      >
        {Routes.map((currentRoute) => (
          <div
            className={`text-sm cursor-pointer flex justify-start px-2 py-1 rounded-md opacity-50 ${isActive(currentRoute.path) && activeStyle}`}
            onClick={() => nav(`${currentRoute.path.toLowerCase()}`)}
          >
            {currentRoute.name}
          </div>
        ))}
      </div>
      <div
        style={{
          width: "33.3%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Button variant="default" size="sm" className="text-sm">
          Subscribe
        </Button>
      </div>
    </div>
  );
};
