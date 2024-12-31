import { Dialog, DialogContent } from "@mui/material";
import React, { memo } from "react";
import Login from "./Login";

function LoginModel({ loginModel, toggleLoginModel, closeModel }) {
    return (
        <Dialog open={loginModel} onClose={toggleLoginModel}>
            {/* <DialogContent> */}
            <Login onSuccess={closeModel} closeModal={toggleLoginModel} />
            {/* </DialogContent> */}
        </Dialog>
    );
}

export default memo(LoginModel);
