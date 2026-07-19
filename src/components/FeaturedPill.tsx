interface FeaturedPillProps {
  tags: {
    name: string;
    count: number;
  }[];
  onTagClick?: (tag: string) => void;
}

/** Three big featured cards, one per tag, computed from real trip data. */
export const FeaturedPill = ({ tags, onTagClick }: FeaturedPillProps) => {
  const pillColor = {
    0: "rgb(47, 107, 70)",
    1: "rgb(30, 79, 138)",
    2: "rgb(180, 83, 9)",
  } as const;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {tags.slice(0, 3).map((tag, index) => (
        <div
          key={tag.name}
          onClick={() => onTagClick?.(tag.name)}
          className="flex w-full flex-row items-center gap-4 rounded-xl border-2 border-gray-200 p-3 cursor-pointer hover:shadow sm:w-1/3 sm:p-4"
        >
          <div className="">
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "#f5f4f1",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: pillColor[(index % 3) as 0 | 1 | 2],
                }}
              ></span>
            </span>
          </div>
          <div className="flex flex-col grow">
            <span className="text-md text-nowrap font-[600] capitalize tracking-widest">
              {tag.name.replaceAll("-", " ")}
            </span>
            <span className="text-gray-500 text-xs">
              {tag.count} {tag.count === 1 ? "trip" : "trips"}
            </span>
          </div>
          <div className="flex justify-end opacity-50">→</div>
        </div>
      ))}
    </div>
  );
};
