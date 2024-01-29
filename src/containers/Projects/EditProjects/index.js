import React, { useEffect } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import AuthLayout from "../../../components/Layout/Authenticated";
import MDEditor from "@uiw/react-md-editor";
import { Save } from "@mui/icons-material";
import axiosInstance from "../../../axiosInstance";
import rehypeSanitize from "rehype-sanitize";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setItemDetails] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [description, setDescription] = React.useState(
    "**Write Detailed description!!!**"
  );
  const [submitInProgres, setSubmitInProgress] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    fetchListData(id);
  }, [id]);

  async function fetchListData(id) {
    await axiosInstance
      .get(`/pages/${id}`)
      .then((res) => {
        setItemDetails(res.data.Item);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  }

  useEffect(() => {
    setTitle(details.title || "");
    setSummary(details.summary || "");
    setDescription(details.description);
  }, [details]);

  const onFormSubmit = async (e) => {
    e.preventDefault();

    setSubmitInProgress(true);

    // construct form data
    const formData = new FormData(e.currentTarget);
    formData.set("name", title);
    formData.set("summary", summary);
    formData.set("description", description);

    try {
      // make a POST request with Axios
      const res = await axiosInstance.put(`/pages/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (201 === res.status) {
        resetFormValues();
        toast.success("Update success!!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          onClose: () => {
            navigate("/projects");
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function resetFormValues() {
    setTitle("");
    setSummary("");
    setDescription("**Write Detailed description!!!**");
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
                Edit Temple | {title || ""}
              </Typography>
              <Divider />
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="title"
                    name="title"
                    label="Title"
                    value={title || ""}
                    fullWidth
                    autoComplete="item title"
                    onChange={(e) => setTitle(e.target.value)}
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

export default EditProject;
