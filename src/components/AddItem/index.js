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
import AddHolywalk from "./Holywalk";
import AddTemple from "./Temple";

function AddItem(props) {
  return (
    <AuthLayout>
      <Container>
        {"holywalk" === props.type ? <AddHolywalk /> : <AddTemple />}
      </Container>
    </AuthLayout>
  );
}

export default AddItem;
