import { Container, Divider, Grid, Paper } from "@mui/material";
import React from "react";
import FilteredList from "../../components/FilteredList";
import AuthLayout from "../../components/Layout/Authenticated";

const Dashboard = () => {
  return (
    <AuthLayout>
      <Container>
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <FilteredList
                type="holywalk"
                limit={5}
                title={"Recently Added Holywalks"}
                sort="desc"
              />
            </Paper>
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <FilteredList
                type="temple"
                limit={5}
                title={"Recently Added Temples"}
                sort="desc"
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AuthLayout>
  );
};

export default Dashboard;
