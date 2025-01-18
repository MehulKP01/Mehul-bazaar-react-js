import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import { api } from "../../src/utils/axiosInstance";
import { displaySnackBar } from "../../src/common/snackBar";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Refund = (props) => {
  const { orderId } = props;
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    note: "",
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleRefundChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const submitRefundRequest = async () => {
    try {
      const { data } = await api.post("/order/return", {
        orderId: orderId?._id,
        type: "order",
        note: formData.note,
      });
      if (data?.status) {
        displaySnackBar(data?.message, "success");
        setOpen(false);
      } else {
        displaySnackBar(data?.message, "error");
        setOpen(false);
      }
    } catch (e) {
      console.log("return", e);
    }
  };

  return (
    <>
      <Button size="small" variant="outlined" onClick={handleClickOpen}>
        Refund
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          id="customized-dialog-title"
          s
        >
          Refund Request
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" mb={3}>
                We are Sorry to know that you want a refund. let us know what's
                wrong
              </Typography>
              <TextField
                fullWidth
                label="Reason"
                id="reason"
                placeholder="Reason"
                variant="outlined"
                value={formData.reason}
                onChange={handleRefundChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" mb={3}>
                Tell us the detailed refund reason <span style={{color:"red"}}>*</span>
              </Typography>
              <TextField
                fullWidth
                rows={3}
                multiline
                id="note"
                label="Note"
                placeholder="Note"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.note}
                onChange={handleRefundChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="outlined"
            autoFocus
            onClick={submitRefundRequest}
          >
            Send Request
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default Refund;
