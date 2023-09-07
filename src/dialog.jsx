import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

function AlertDialog({ open, onClose, title, content, onConfirm }) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      className="flex flex-col items-center"
    >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider>{content}</DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-1">
          <span>Відмінити</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleConfirm}>
          <span>Підтвердити</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default AlertDialog;
