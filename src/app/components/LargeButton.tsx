import { ILargeButtonProps } from "@/interfaces/components/largeButton.interface";

export default function LargeButton({ children }: ILargeButtonProps) {
  return (
    <span className="flex items-center p-2 bg-secondary font-bold text-center rounded-[10] hover:brightness-92">
      {children}
    </span>
  );
}
