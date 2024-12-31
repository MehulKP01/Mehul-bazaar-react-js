import React, { useState } from "react";
import {
    Button,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';

import DeleteIcon from '@mui/icons-material/Delete';
import { setDeleteAddress } from "../../../src/redux/action.js";
import { useDispatch } from "react-redux";
import { displaySnackBar } from "common/snackBar.js";

const DeleteAddress = (addId) => {

    const dispatch = useDispatch()
    const [onDelete, setOnDelete] = useState(false)

    const deleteAddress = async () => {
        const data = await dispatch(setDeleteAddress(addId.addId))
        if (data?.status) {
            displaySnackBar(data?.message,"success","top","right")
        }
    }
    const openConformations = () => {
        setOnDelete(true)
    }
    const handleDeleteClose = () => {
        setOnDelete(false)
    }
    return (
        <>
            <Tooltip title="Delete" placement="top" arrow>
                <DeleteIcon fontSize="small" color="primary" onClick={() => openConformations()} />
            </Tooltip>
            <Dialog
                open={onDelete}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete selected address
                    </Typography >
                </DialogContent>
                <DialogActions sx={{ alignItems: "center" }}>
                    <Button onClick={handleDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        deleteAddress()
                        setOnDelete(false)
                    }} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default DeleteAddress;