import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from "@material-tailwind/react";

function AlertDialog({ open, onClose, title, content, onConfirm }) {
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleConfirm = () => {
    onConfirm();
    onClose();
    setOpenAlert(true);
  };

  return (
    <div className="absolute z-10 w-11/12 top-5">
      <Dialog
        open={open}
        handler={onClose}
        className="flex flex-col items-center -top-52"
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
      <Alert
        color="green"
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        animate={{
          mount: { y: 0 },
          unmount: { y: -100 },
        }}
      >
        Успішно!
      </Alert>
    </div>
  );
}

export default AlertDialog;
