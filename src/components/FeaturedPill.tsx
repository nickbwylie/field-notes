interface FeaturedPillProps {
  tags: {
    name: string;
    description: string;
  }[];
}

export const FeaturedPill = ({ tags }: FeaturedPillProps) => {
  const pillColor = {
    0: "rgb(47, 107, 70)",
    1: "rgb(30, 79, 138)",
    2: "rgb(180, 83, 9)",
  } as const;
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {tags.map((tag, index) => (
        <div
          key={tag.name}
          className="flex w-full flex-row items-center gap-4 rounded-xl border-2 border-gray-200 p-3 cursor-pointer hover:shadow sm:w-1/3 sm:p-4"
        >
          <div className="">
            <span
              data-dc-tpl="9"
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
                data-dc-tpl="10"
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: pillColor[index % 3],
                }}
              ></span>
            </span>
          </div>
          <div className="flex flex-col grow">
            <span className="text-md text-nowrap font-[600] tracking-widest">
              {tag.name}
            </span>
            <span className="text-gray-500 text-xs">{tag.description}</span>
          </div>
          <div className="flex justify-end opacity-50">→</div>
        </div>
      ))}
    </div>
  );
};
