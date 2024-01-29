import { AddCircle, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Container,
  Divider,
  Fab,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import AuthLayout from "../../../components/Layout/Authenticated";
import axiosInstance from "../../../axiosInstance";
import { toast } from "react-toastify";
import moment from "moment/moment";

const ListProjects = (props) => {
  const [loading, setLoading] = useState(true);
  const [lists, setListData] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [filteredList, setFilteredList] = React.useState("");

  useEffect(() => {
    setLoading(true);
    fetchListData();
  }, []);

  useEffect(() => {
    const currentList = [...lists];
    setFilteredList(currentList);
  }, [lists]);

  async function fetchListData() {
    await axiosInstance
      .get("/pages", {
        params: {
          page_type: "projects",
        },
      })
      .then((res) => {
        setLoading(false);
        setListData(res.data.Items);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const onSearchTextChange = (txt) => {
    setFilterText(txt);
    const currentData = [...lists];
    const filtered = currentData.filter(
      (item) =>
        item.title &&
        item.title.toLowerCase().includes(filterText.toLowerCase())
    );
    if ("" === txt) {
      setFilteredList(currentData);
    } else {
      setFilteredList(filtered);
    }
  };

  const deleteItem = async (record) => {
    const answer = window.confirm("are you sure?");
    if (!answer) return false;
    try {
      // make a POST request with Axios
      const res = await axiosInstance.delete(`/pages/${record.id}`);

      if (200 === res.status) {
        toast.success(`Project deleted successfully`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
          onOpen: () => {
            setLoading(true);
          },
          onClose: () => {
            fetchListData();
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Last updated",
      key: "last_updated",
      selector: (row) => row.updated_at,
      sortable: true,
      cell: (record) => {
        let formatted = "-";
        let t = "";
        if ("" !== record.updated_at) {
          t = new Date(record.updated_at);
        } else {
          t = new Date(record.created_at);
        }
        formatted = moment(t).format("DD/MM/YYYY hh:MM:ss");
        return formatted;
      },
    },
    {
      name: "Actions",
      key: "action",
      text: "Action",
      className: "action",
      width: "300px",
      align: "left",
      sortable: false,
      cell: (record) => {
        return (
          <>
            <Button
              variant="outlined"
              sx={{ marginRight: "3px" }}
              component={Link}
              title="Edit"
              to={`edit/${record.id}`}
            >
              <Edit />
            </Button>
            <Button
              sx={{ marginRight: "3px" }}
              color="error"
              variant="outlined"
              title="Delete"
              onClick={() => deleteItem(record)}
            >
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <AuthLayout>
      <Container>
        <Grid item xs={12}>
          <Fab
            component={Link}
            to="add"
            variant="extended"
            sx={{ float: "right" }}
            size="small"
          >
            <AddCircle sx={{ mr: 1 }} />
            Add New
          </Fab>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Projects
          </Typography>
        </Grid>
        <Divider />
        <Grid item xs={12}>
          <TextField
            id="search-filter"
            label="Search.."
            variant="outlined"
            onChange={(e) => onSearchTextChange(e.target.value)}
            value={filterText}
            size="small"
            sx={{ float: "right", mt: "30px" }}
          />
        </Grid>
        <Grid item xs={12}>
          {!loading ? (
            <>
              <DataTable
                defaultSortFieldId={2}
                defaultSortAsc={false}
                columns={columns}
                data={filteredList}
                pagination
              />
            </>
          ) : (
            <>
              <LinearProgress
                color="inherit"
                sx={{ marginBottom: "30px", marginTop: "30px" }}
              />
              <LinearProgress color="inherit" sx={{ marginBottom: "30px" }} />
              <LinearProgress color="inherit" sx={{ marginBottom: "30px" }} />
              <LinearProgress color="inherit" sx={{ marginBottom: "30px" }} />
              <LinearProgress color="inherit" sx={{ marginBottom: "30px" }} />
            </>
          )}
        </Grid>
      </Container>
    </AuthLayout>
  );
};

export default ListProjects;
