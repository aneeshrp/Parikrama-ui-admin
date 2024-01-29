import { Button, Grid, LinearProgress, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link as RouterLink } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import moment from "moment";

const FilteredList = (props) => {
  const [lists, setListData] = useState([]);
  const linkPath = props.type === "temple" ? "temples" : "holywalk";
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Photo",
      selector: (row) => row.featured_photo,
      maxWidth: "200px",
      sortable: false,
      cell: (record) => {
        const imagePath =
          "" === record.featured_photo
            ? process.env.REACT_APP_NO_IMAGE
            : record.featured_photo;
        return (
          <img
            alt="Featured"
            key={record.id}
            className="responsiveImg"
            src={`${process.env.REACT_APP_ASSETS_BASE_URL}/${imagePath}`}
          ></img>
        );
      },
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      maxWidth: "200px",
      cell: (record) => {
        let formattedDateValue = "";
        if ("" !== record.created_at) {
          var t = new Date(record.created_at);
          formattedDateValue = moment(t).format("DD-M-YYYY hh:MM:ss");
        } else {
          formattedDateValue = "N/A";
        }
        return formattedDateValue;
      },
    },
  ];

  useEffect(() => {
    const servicePath = props.type === "temple" ? "temples" : "parikrama";
    const itemLimit = props.limit !== "" ? props.limit : 5;
    const sortOrder = props.sort === "desc" ? false : true;

    axiosInstance
      .get(`/${servicePath}`, {
        params: {
          limit: itemLimit,
          sort: sortOrder,
        },
      })
      .then((res) => {
        setLoading(false);
        setListData(res.data.Items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props]);

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {props.title}
      </Typography>
      {!loading ? (
        <>
          <Grid container justifyContent="flex-end">
            <DataTable columns={columns} data={lists} />

            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={`/${linkPath}`}
              sx={{ maxWidth: "200px", marginTop: "30px" }}
            >
              See full list
            </Button>
          </Grid>
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
    </>
  );
};

export default FilteredList;
