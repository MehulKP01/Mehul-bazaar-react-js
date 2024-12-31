import { enqueueSnackbar } from "notistack";


export const displaySnackBar = (message="" , variant="",vertical="bottom",horizontal="left")=>{
    if(message && variant){
        return enqueueSnackbar(
              message,
              {
                variant: variant,
                anchorOrigin: {
                  vertical: vertical,
                  horizontal: horizontal,
                },
                autoHideDuration: 2000,
              }
            );
    }  
}