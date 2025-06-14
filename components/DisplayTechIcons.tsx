import { cn, getTechLogos } from "@/app/lib/utils";
import Image from "next/image";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techicons = await getTechLogos(techStack);

  return (
    <div className="flex flex-row">
      {techicons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={index}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt="tech"
            className="size-5"
            height={100}
            width={100}
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
