import type { TripFrontmatter } from "@/types/MyTypes";

export const difficultyColorToClass = (
  difficulty: TripFrontmatter["difficulty"],
) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-50 text-green-800 border border-green-300";
    case "Moderate":
      return "bg-yellow-50 text-yellow-800 border border-yellow-300";
    case "Strenuous":
      return "bg-red-50 text-red-800 border border-red-300";
    default:
      return "bg-gray-50 text-gray-800 border border-gray-300";
  }
};
