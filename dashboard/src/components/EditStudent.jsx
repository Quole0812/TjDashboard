import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function EditStudent({name, id}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit Student
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Editing Student</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`What would you like to change ${name}'s name to?`}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Full Name"
            type="name"
            fullWidth
            variant="standard"
          />
          <DialogContentText>
           {`What would you like to change ${name}'s grade level to?`}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="grade"
            name="grade"
            label="Grade"
            type="number"
            slotProps={{
                input: {
                  min: 1,
                  max: 3,
                  step: 1,
                },
              }}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Edit Student</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
