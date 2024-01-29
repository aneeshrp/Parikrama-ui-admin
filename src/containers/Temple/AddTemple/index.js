import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AuthLayout from "../../../components/Layout/Authenticated";
import MDEditor from "@uiw/react-md-editor";
import { Save, UploadFile } from "@mui/icons-material";
import axiosInstance from "../../../axiosInstance";
import rehypeSanitize from "rehype-sanitize";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddTemple() {
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState("");
  const [holywalks, setHolywalk] = React.useState([]);
  const [name, setName] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [coordinates, setGeoChords] = React.useState("");
  const [distance, setDistance] = React.useState(0);
  const [audio, setAudio] = React.useState("");
  const [video, setVideo] = React.useState("");
  const [description, setDescription] = React.useState(
    "**Write Detailed description!!!**"
  );
  const [featured, setFeaturedFile] = React.useState("");
  const [files, setFiles] = React.useState(""); // storing the uploaded file
  const el = useRef(); // accesing input element
  const [submitInProgres, setSubmitInProgress] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchHolyWalks();
  }, []);

  async function fetchHolyWalks() {
    await axiosInstance
      .get("/parikrama")
      .then((res) => {
        setLoading(false);
        setHolywalk(res.data.Items);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const onHolywalkCHange = (event) => {
    setParent(event.target.value);
  };

  const onFeaturedFileUpload = (e) => {
    const files = e.target.files; // accessing file
    console.log(files);
    setFeaturedFile(files); // storing file
  };

  const handleFileBrowseChange = (e) => {
    const files = e.target.files; // accessing file
    setFiles(files); // storing file
  };

  const onFormSubmit = async (e) => {
    //console.log("featured, ", featured);
    e.preventDefault();

    setSubmitInProgress(true);

    // construct form data
    const formData = new FormData(e.currentTarget);
    let parent_id = new Array(parent);

    formData.set("list_type", "temple");
    formData.set("parent_id", parent_id || []);
    formData.set("name", name);
    formData.set("summary", summary);
    formData.set("coordinates", coordinates);
    formData.set("distance", "" === distance ? 0 : distance);
    formData.set("description", description);
    formData.set("audio", audio);
    formData.set("video", video);

    for (let i = 0; i < featured.length; i++) {
      formData.append("featured", featured[i]);
    }
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      console.log([...formData.entries()]);
      // make a POST request with Axios
      const res = await axiosInstance.post("/temples", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (201 === res.status) {
        resetFormValues();
        toast.success("Success Notification !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => {
            navigate("/holyplaces");
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function resetFormValues() {
    setHolywalk("");
    setParent("");
    setName("");
    setSummary("");
    setGeoChords("");
    setDistance(0);
    setAudio("");
    setVideo("");
    setDescription("**Write Detailed description!!!**");
    setFeaturedFile("");
    setFiles([]);
    setSubmitInProgress(false);
  }

  return (
    <AuthLayout>
      <Container>
        {loading ? (
          <LinearProgress />
        ) : (
          <>
            <form onSubmit={onFormSubmit} encType="multipart/form-data">
              <Typography
                component="h2"
                variant="h4"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Add Temple
              </Typography>
              <Divider />
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ marginTop: "30px" }}
                  >
                    General Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Associated Holywalk
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={parent}
                      label="holywalk"
                      onChange={onHolywalkCHange}
                    >
                      <MenuItem key="menuitem-1" value={""}>
                        None
                      </MenuItem>
                      {holywalks.length &&
                        holywalks.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item.id}>
                              {item.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </Grid>{" "}
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
                    required
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
                {/* <Grid item xs={12}>
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
            </Grid> */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Related Audios
                  </Typography>
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
                  <Typography variant="h6" gutterBottom>
                    Related Videos
                  </Typography>
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
                  <Typography variant="h6" gutterBottom>
                    Photos
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" component="label">
                    Upload Featured Photo
                    <input
                      ref={el}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={onFeaturedFileUpload}
                    />
                  </Button>
                  {"" !== featured && (
                    <Chip
                      avatar={<Avatar>{"1"}</Avatar>}
                      label="file selected"
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <MultiFileUpload setUploadedFiles={setUploadedFiles} /> */}
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadFile />}
                  >
                    Upload Additional Photos
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
                      label="Files selected"
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Other Information
                  </Typography>
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
                    disabled={submitInProgres}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={submitInProgres}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        )}
      </Container>
    </AuthLayout>
  );
}

export default AddTemple;
