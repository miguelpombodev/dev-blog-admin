"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
};

export default function Modal({
  isOpen,
  onClose,
  isSuccess,
  message,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            className={isSuccess ? "text-green-600" : "text-red-600"}
          >
            {isSuccess ? "Success" : "Error"}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
