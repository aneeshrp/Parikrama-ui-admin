import React from "react";
import {
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AuthLayout from "../../Layout/Authenticated";

function AddTemple() {
  return (
    <AuthLayout>
      <Container>
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
              fullWidth
              autoComplete="item title"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="summart"
              name="summary"
              label="Summary"
              fullWidth
              autoComplete="item summary"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              name="city"
              label="City"
              fullWidth
              autoComplete="billing address-level2"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              name="state"
              label="State/Province/Region"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="zip"
              name="zip"
              label="Zip / Postal code"
              fullWidth
              autoComplete="billing postal-code"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="country"
              name="country"
              label="Country"
              fullWidth
              autoComplete="billing country"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox color="secondary" name="saveAddress" value="yes" />
              }
              label="Use this address for payment details"
            />
          </Grid>
        </Grid>
      </Container>
    </AuthLayout>
  );
}

export default AddTemple;
