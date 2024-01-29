import React, { useEffect, useRef } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  Checkbox,
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
} from "@mui/material";
import AuthLayout from "../../../components/Layout/Authenticated";
import MDEditor from "@uiw/react-md-editor";
import { Save, UploadFile } from "@mui/icons-material";
import axiosInstance from "../../../axiosInstance";
import rehypeSanitize from "rehype-sanitize";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import SingleImageWithAction from "../../../components/SingleImageWithAction";
import { PaginatedList } from "react-paginated-list";
import SortableList from "../../../components/SortableList";

function EditParikrama() {
  const { id } = useParams();
  const navigate = useNavigate();
  const el = useRef(); // accesing input element

  const [details, setItemDetails] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [coordinates, setGeoChords] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [audio, setAudio] = React.useState("");
  const [video, setVideo] = React.useState("");
  const [description, setDescription] = React.useState(
    "**Write Detailed description!!!**"
  );
  const [current_pictures, setCurrentPictures] = React.useState("");
  const [featured, setFeaturedFile] = React.useState("");
  const [files, setFiles] = React.useState(""); // storing the uploaded file
  const [submitInProgres, setSubmitInProgress] = React.useState(false);

  const [templeList, setTempleList] = React.useState([]);
  const [selectedTemple, setSelectedTemple] = React.useState([]);
  const [sortableListKey, setSortableListKey] = React.useState("");
  const [templeListKey, setTempleListKey] = React.useState("");
  const [selectedTempleOrder, setSelectedTempleOrder] = React.useState([]);

  useEffect(() => {
    fetchHolyWalks();
  }, []);

  useEffect(() => {
    console.log("loader ", loading);
  }, [loading]);

  useEffect(() => {
    fetchListData(id);
  }, [id]);

  useEffect(() => {
    buildFormValues();
  }, [details]);

  useEffect(() => {
    setSortableListKey(selectedTemple.length);
    orderSelectedTemple(selectedTemple);
    console.log(selectedTemple);
  }, [selectedTemple]);

  const onTempleFilterChange = (text) => {
    fetchHolyWalks(text);
  };

  const buildFormValues = () => {
    let audioList = "";
    let videoList = "";

    if (details.audio) {
      if (Array.isArray(details.audio)) {
        audioList = details.audio.join("\r\n");
      } else {
        audioList = details.audio;
      }
    }
    if (details.video) {
      if (Array.isArray(details.video)) {
        videoList = details.video.join("\r\n");
      } else {
        videoList = details.video;
      }
    }

    if (undefined !== details.associations && "" !== details.associations) {
      //Preload Saved Associations
      const associatedTemples = details.associations.split(",") || [];
      let currectAssociations = [];

      associatedTemples.forEach((temple, index) => {
        const thisItemEists = templeList.find(
          (item) => item.id.toString() == temple
        );
        if (undefined !== thisItemEists) {
          currectAssociations[index] = thisItemEists;
        }
      });

      const updatedAssociations = [...selectedTemple, ...currectAssociations];

      //Update Selection of Temples in Source List
      const sourceTempleList = [...templeList];
      let currentSelectedOrder = [];

      sourceTempleList.forEach((list) => {
        const thisItemEists = updatedAssociations.find(
          (item) => item.id === list.id
        );
        if (undefined === thisItemEists) {
          list.isSelected = false;
        } else {
          list.isSelected = true;
          currentSelectedOrder.push(list);
        }
      });

      if (currentSelectedOrder.length > 0) {
        const updatedSortOrder = [
          ...selectedTempleOrder,
          ...currentSelectedOrder,
        ];
        setSelectedTempleOrder(updatedSortOrder);
      }

      setSelectedTemple(updatedAssociations);
      setTempleList(sourceTempleList);
    }

    setName(details.name || "");
    setSummary(details.summary || "");
    setGeoChords(details.coordinates || "");
    setDistance(details.distance || 0);
    setAudio(audioList);
    setVideo(videoList);
    setDescription(details.description);
    setCurrentPictures(details.pictures || [""]);
  };

  async function fetchListData(id) {
    await axiosInstance
      .get(`/parikrama/${id}`)
      .then((res) => {
        setItemDetails(res.data.Item);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  }

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
      console.log(newSelection);
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
        const { Items } = res.data;

        Items.forEach((item) => {
          const thisItemEists = selectedTemple.find(
            (itm) => itm.id === item.id
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

  const onFeaturedFileUpload = (e) => {
    const files = e.target.files; // accessing file
    setFeaturedFile(files); // storing file
  };

  const handleFileBrowseChange = (e) => {
    const files = e.target.files; // accessing file
    setFiles(files); // storing file
  };

  const onFeaturedImageDelete = async (index) => {
    try {
      // make a POST request with Axios
      const res = await axiosInstance.put(
        `/parikrama/image/remove/featured/${details.id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (201 === res.status) {
        toast.success(`Featured image has been removed.`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onOpen: () => {
            setLoading(true);
          },
          onClose: () => {
            fetchListData(id);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
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

    console.log(selectedTempleOrder);
    let associations = [];
    if (0 < selectedTempleOrder.length) {
      selectedTempleOrder.forEach((element, index) => {
        associations[index] = element.id;
      });
      console.log(associations.join());
      formData.set("associations", associations.join());
    }

    for (let i = 0; i < featured.length; i++) {
      formData.append("featured", featured[i]);
    }
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // make a POST request with Axios
      const res = await axiosInstance.put(`/parikrama/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (201 === res.status) {
        resetFormValues();
        toast.success("Data updated successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => {
            navigate("/holywalk");
          },
        });
      } else {
        toast.error("Update failed !! Somthing went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => {
            setSubmitInProgress(false);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPhotoDelete = async (index) => {
    const list = [...current_pictures];
    list.splice(index, 1);
    setCurrentPictures(list);

    try {
      // construct form data
      const formData = new FormData();
      formData.set("pictures", JSON.stringify(list));

      // make a POST request with Axios
      const res = await axiosInstance.put(
        `/parikrama/image/remove/regular/${details.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (201 === res.status) {
        toast.success(`Photo has been removed.`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onOpen: () => {
            setLoading(true);
          },
          onClose: () => {
            fetchListData(id);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function resetFormValues() {
    setName("");
    setSummary("");
    setGeoChords("");
    setDistance(0);
    setAudio([]);
    setVideo([]);
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
                Edit Holywalk | {name || ""}
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
                    value={name || ""}
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
                              <div
                                style={{ margin: "5px 0" }}
                                key={`PGLT_${item.id}`}
                              >
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
                    key={sortableListKey}
                    items={selectedTemple}
                    onOrderChange={orderSelectedTemple}
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
                  {"" !== details.featured_photo && (
                    <SingleImageWithAction
                      sourceType="thumb"
                      imagePath={details.featured_photo}
                      onDeleteAction={onFeaturedImageDelete}
                      itemIndex={1}
                      key={1}
                      type="featured"
                    />
                  )}
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
                  <Grid container spacing={2}>
                    {current_pictures &&
                      current_pictures.map((item, index) => {
                        return (
                          <Grid item xs={12} sm={4}>
                            <SingleImageWithAction
                              sourceType="thumb"
                              imagePath={item}
                              onDeleteAction={onPhotoDelete}
                              itemIndex={index}
                              key={index}
                              type="photo"
                            />
                          </Grid>
                        );
                      })}
                  </Grid>

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

export default EditParikrama;
