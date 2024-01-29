import React, { useRef } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AuthLayout from "../../Layout/Authenticated";
import MultiFileUpload from "../../MultiFileUpload";
import MDEditor from "@uiw/react-md-editor";
import { Save, UploadFile } from "@mui/icons-material";
import { create } from "@mui/material/styles/createTransitions";
import useFileUpload from "react-use-file-upload";
import axiosInstance from "../../../axiosInstance";
import rehypeSanitize from "rehype-sanitize";

function AddHolywalk() {
  const [name, setName] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [coordinates, setGeoChords] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [audio, setAudio] = React.useState("");
  const [video, setVideo] = React.useState("");
  const [description, setDescription] = React.useState("**Hello world!!!**");
  const [files, setFiles] = React.useState(""); // storing the uploaded file
  // storing the recived file from backend
  const [data, getFile] = React.useState({ name: "", path: "" });
  const [progress, setProgess] = React.useState(0); // progess bar
  const el = useRef(); // accesing input element

  const setUploadedFiles = (files) => {
    setFiles(files);
  };

  const handleFileBrowseChange = (e) => {
    setProgess(0);
    const files = e.target.files; // accessing file
    console.log(files);
    setFiles(files); // storing file
  };

  const onFormSubmit = async (e) => {
    console.log("Form Submitted");
    // prevent the page from reloading
    e.preventDefault();

    // construct form data
    const formData = new FormData(e.currentTarget);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    console.log(summary);
    formData.set("list_type", "holywalk");
    formData.set("parent_id", 0);
    formData.set("name", name);
    formData.set("summary", summary);
    formData.set("coordinates", coordinates);
    formData.set("description", description);
    formData.set("audio", audio);
    formData.set("video", video);
    formData.set("featured", "");

    try {
      // make a POST request with Axios
      const res = await axiosInstance.post("/parikrama", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout>
      <Container>
        <form onSubmit={onFormSubmit} encType="multipart/form-data">
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Holywalks
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                required
                id="title"
                name="title"
                label="Title"
                value={name}
                fullWidth
                autoComplete="item title"
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="summart"
                name="summary"
                label="Summary"
                fullWidth
                value={summary}
                autoComplete="item summary"
                onChange={(e) => setSummary(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="coordiates"
                name="coordinates"
                label="Geo Coordinates"
                fullWidth
                value={coordinates}
                autoComplete="item coordinates"
                onChange={(e) => setGeoChords(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="distance"
                name="distance"
                label="Distance"
                value={distance}
                fullWidth
                onChange={(e) => setDistance(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="audio"
                name="audio"
                label="Audio"
                multiline
                minRows={4}
                fullWidth
                autoComplete="item audio"
                helperText="One link per line"
                value={audio}
                onChange={(e) => setAudio(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="video"
                name="video"
                label="Video"
                multiline
                minRows={4}
                fullWidth
                autoComplete="item video"
                helperText="One link per line"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <MultiFileUpload setUploadedFiles={setUploadedFiles} /> */}
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFile />}
              >
                Upload
                <input
                  hidden
                  ref={el}
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={handleFileBrowseChange}
                />
              </Button>
              {files.length > 0 && (
                <Chip
                  avatar={<Avatar>{files.length}</Avatar>}
                  label="Files Uploaded"
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <MDEditor
                value={description}
                onChange={setDescription}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
              />
            </Grid>
            <Grid container justifyContent="flex-end">
              <Button
                type="submit"
                sx={{ marginTop: "30px" }}
                variant="contained"
                endIcon={<Save />}
              >
                Save
              </Button>{" "}
            </Grid>
          </Grid>
        </form>
      </Container>
    </AuthLayout>
  );
}

export default AddHolywalk;
