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
  };
  return (
    <div className="flex flex-row gap-4">
      {tags.map((tag, index) => (
        <div
          key={tag.name}
          className="w-1/3 flex flex-row items-center cursor-pointer hover:shadow gap-4 p-4 border-2 border-gray-200 rounded-xl "
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
                  background: pillColor[index],
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
