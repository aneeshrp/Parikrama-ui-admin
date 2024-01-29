import React, { useEffect, useRef } from "react";
import axios from "axios";
import useFileUpload from "react-use-file-upload";
import { Box, Grid, Paper, Typography, Button, Divider } from "@mui/material";
import ImageListBox from "../ImageListBox";
import { PlaylistRemove, UploadFile } from "@mui/icons-material";

const MultiFileUpload = (props) => {
  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();

  const deleteFIle = (item) => {
    removeFile(item);
  };
  const inputRef = useRef();

  useEffect(() => {
    props.setUploadedFiles(files);
  }, [files]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Typography
              component={"div"}
              variant="h6"
              sx={{ marginBottom: "30px" }}
            >
              Upload Files
            </Typography>
            <Divider />
            {/* Provide a drop zone and an alternative button inside it to upload files. */}
            <Box
              sx={{
                height: 300,
                backgroundColor: "#D3D3D3",
                "&:hover": {
                  backgroundColor: "primary.main",
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              <div
                onDragEnter={handleDragDropEvent}
                onDragOver={handleDragDropEvent}
                onDrop={(e) => {
                  handleDragDropEvent(e);
                  setFiles(e, "a");
                }}
              >
                <Typography component={"div"} paragraph={true}>
                  Drag and drop files here
                </Typography>
              </div>
            </Box>
            <Button
              variant="contained"
              endIcon={<UploadFile />}
              onClick={() => inputRef.current.click()}
            >
              Or select files to upload
            </Button>

            {/* Hide the crappy looking default HTML input */}
            <input
              ref={inputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                setFiles(e, "a");
                inputRef.current.value = null;
              }}
            />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={6} lg={6}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: 240,
            }}
          >
            <Typography
              component={"div"}
              variant="h6"
              sx={{ marginBottom: "30px" }}
            >
              Uploaded Files
            </Typography>
            {files.length > 0 && (
              <>
                <ImageListBox files={files} removeItem={deleteFIle} />
                <Button
                  color="error"
                  variant="contained"
                  endIcon={<PlaylistRemove />}
                  onClick={() => clearAllFiles()}
                >
                  Clear All
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MultiFileUpload;
