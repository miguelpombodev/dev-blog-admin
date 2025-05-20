import { IInfoSquare } from "@/interfaces/components/infoSquare.interface";

export default function InfoSquare({ title, content }: IInfoSquare) {
  return (
    <span className="py-4 px-2 flex flex-col rounded-[10] bg-white min-w-[200] gap-4 shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)]">
      <h3 className="font-light text-sm">{title}</h3>
      <span className="flex items-center font-bold text-2xl">
        <p>{content}</p>
      </span>
    </span>
  );
}
