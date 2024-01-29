import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import AuthLayout from "../../../components/Layout/Authenticated";
import MDEditor from "@uiw/react-md-editor";
import { Save, UploadFile } from "@mui/icons-material";
import axiosInstance from "../../../axiosInstance";
import rehypeSanitize from "rehype-sanitize";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SortableList from "../../../components/SortableList";
import { PaginatedList } from "react-paginated-list";

function AddHolywalk() {
  const [loading, setLoading] = useState(true);

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

  const [templeList, setTempleList] = React.useState([]);
  const [selectedTemple, setSelectedTemple] = React.useState([]);
  const [sortableListKey, setSortableListKey] = React.useState("");
  const [templeListKey, setTempleListKey] = React.useState("");
  const [templeFilter, setTempleFilter] = React.useState("");
  const [selectedTempleOrder, setSelectedTempleOrder] = React.useState([]);
  const [selectedTempleIndex, setSelectedTempleIndex] = React.useState([]);
  const [associatedHolyWalks, setAssociatedHolywalks] = React.useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchHolyWalks();
  }, []);

  useEffect(() => {
    setSortableListKey(selectedTemple.length);
  }, [selectedTemple]);

  useEffect(() => {
    console.log(selectedTempleOrder);
  }, [selectedTempleOrder]);

  async function fetchHolyWalks(filterText) {
    let params = {};
    if ("" !== filterText) {
      params = {
        searchtxt: filterText,
      };
    }
    await axiosInstance
      .get("/temples", {
        params,
      })
      .then((res) => {
        setLoading(false);

        const { Items } = res.data;

        Items.forEach((item) => {
          const thisItemEists = selectedTemple.find(
            (item) => item.id === item.id
          );
          if (undefined === thisItemEists) {
            item.isSelected = false;
          } else {
            item.isSelected = true;
          }
        });
        setTempleList(Items);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const onTempleFilterChange = (text) => {
    fetchHolyWalks(text);
  };

  const orderSelectedTemple = (data) => {
    setSelectedTempleOrder(data);
  };

  const handleTempleListItemChange = (e) => {
    const currentSelectedList = [...selectedTemple];
    let selectedValue = e.target.value;
    let newSelection = [];

    if (e.target.checked) {
      const currentSelection = templeList.find(
        (item) => item.id === selectedValue
      );
      if (0 < currentSelectedList.length) {
        const selectedItemExists = currentSelectedList.find(
          (item) => item.id === currentSelection.id
        );
        if (undefined === selectedItemExists) {
          newSelection = currentSelection;
        }
      } else {
        newSelection = currentSelection;
      }

      setSelectedTemple([...selectedTemple, newSelection]);
    } else {
      const itemIndexToRemove = currentSelectedList.findIndex(
        (x) => x.id === selectedValue
      );

      if (-1 !== itemIndexToRemove) {
        currentSelectedList.splice(itemIndexToRemove, 1);
        setSelectedTemple(currentSelectedList);
      }
    }

    //Set Item Selected/Deselected in Source List

    const itemToSetSelected = templeList.findIndex(
      (x) => x.id === selectedValue
    );

    const updatedTempleList = [...templeList];
    updatedTempleList[itemToSetSelected].isSelected = e.target.checked;

    setTempleList(updatedTempleList);
  };

  const onFeaturedFileUpload = (e) => {
    const files = e.target.files; // accessing file
    setFeaturedFile(files); // storing file
  };

  const handleFileBrowseChange = (e) => {
    const files = e.target.files; // accessing file
    setFiles(files); // storing file
  };

  const onHolywalkSelect = (selected) => {
    setAssociatedHolywalks(selected);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    setSubmitInProgress(true);

    // construct form data
    const formData = new FormData(e.currentTarget);

    formData.set("list_type", "holywalk");
    formData.set("name", name);
    formData.set("summary", summary);
    formData.set("coordinates", coordinates);
    formData.set("distance", "" === distance ? 0 : distance);
    formData.set("description", description);
    formData.set("audio", audio);
    formData.set("video", video);
    let associations = [];
    if (0 < selectedTempleOrder.length) {
      selectedTempleOrder.forEach((element) => {
        associations.push(element.id);
      });
    }
    formData.set("associations", associations);

    for (let i = 0; i < featured.length; i++) {
      formData.append("featured", featured[i]);
    }
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // make a POST request with Axios
      const res = await axiosInstance.post("/parikrama", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (201 === res.status) {
        resetFormValues();
        toast.success("New Holywalk added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => {
            navigate("/holywalk");
          },
        });
      } else {
        toast.error("Save failed !! Something went wrong" + res.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => {
            setSubmitInProgress(false);
          },
        });
      }
    } catch (error) {
      toast.error("Save failed !! Something went wrong" + error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        onClose: () => {
          setSubmitInProgress(false);
        },
      });
    }
  };

  function resetFormValues() {
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
                align="center "
                color="text.primary"
                gutterBottom
              >
                Add Holywalk
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

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Associated Holy Walks
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="templeFilter"
                    name="templeFilter"
                    label="Search Temple"
                    onChange={(e) => onTempleFilterChange(e.target.value)}
                  />
                  <FormGroup>
                    {/* {templeList &&
                      templeList.map((item, index) => {
                        return (
                          <FormControlLabel
                            key={item.id}
                            control={<Checkbox />}
                            label={item.name}
                            value={index}
                            onChange={handleTempleListItemChange}
                          />
                        );
                      })} */}
                    <PaginatedList
                      key={templeListKey}
                      list={templeList}
                      itemsPerPage={5}
                      renderList={(list) => (
                        <>
                          {list.map((item, id) => {
                            return (
                              <div style={{ margin: "5px 0" }} key={item.id}>
                                <FormControlLabel
                                  key={item.id}
                                  control={
                                    <Checkbox checked={item.isSelected} />
                                  }
                                  label={item.name}
                                  value={item.id}
                                  onChange={handleTempleListItemChange}
                                />
                              </div>
                            );
                          })}
                        </>
                      )}
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={6}>
                  <SortableList
                    items={selectedTemple}
                    onOrderChange={orderSelectedTemple}
                    key={sortableListKey}
                  />
                </Grid>
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

export default AddHolywalk;
