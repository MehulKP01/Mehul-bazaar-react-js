import { Person } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ProfileBox = styled(Box)({
  padding:'5px',
  borderRadius:'50%', // Set the border-radius to 50% for a circular shape
  backgroundColor: '#F9F9F9',
  textAlign: 'center',
  height:'8vh !important',
  width:'8vh !important',
  aspectRatio: 1 / 1,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#F0F0F0',
  },
});
const CustomerDropZone = ({onChange,file}) => {
  const onDrop = useCallback(
    (acceptedFiles) => onChange(acceptedFiles),
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
        "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      },
  });
  return (
    <ProfileBox  {...getRootProps()}  onClick={getRootProps().onClick} sx={{ bgcolor: isDragActive ? "grey.200" : "grey.100" }}>
      <Avatar src={file?null:<Person/>} sx={{width: "100%", height: "100%"}}/>
      <input {...getInputProps()} />
    </ProfileBox>
  );
};
export default CustomerDropZone;