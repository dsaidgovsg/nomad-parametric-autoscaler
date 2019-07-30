// @flow

import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

type Props = {
  fn: Function
};

const DeleteButtonWithWarning = (props: Props) => {
  const [open, setOpen] = useState(false);

  function triggerFn() {
      setOpen(false);
      props.fn();
  }

  return (
    <div>
      <Fab
        size="small"
        color="primary"
        aria-label="Delete"
        onClick={() => setOpen(true)}
      >
        <DeleteIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Resource?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Doing this will delete the resource and you cant undo it. Unless you
            click refresh to fetch the persisted state which might undo any
            other changes you currently have.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={triggerFn} color="primary">
            Delete
          </Button>
          <Button onClick={() => setOpen(false)} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteButtonWithWarning;
