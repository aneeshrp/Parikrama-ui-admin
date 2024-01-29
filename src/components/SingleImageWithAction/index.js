import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import { DeleteOutline } from "@mui/icons-material";

export default function SingleImageWithAction(props) {
  const onDeleteButtonClick = () => {
    props.onDeleteAction(props.itemIndex);
  };

  const mediaBasePath = process.env.REACT_APP_ASSETS_BASE_URL;
  const sourceType =
    "" === props.sourceType || undefined == props.sourceType
      ? ""
      : props.sourceType + "/";

  return (
    <Card sx={{ maxWidth: 345, marginBottom: "30px;" }}>
      <CardMedia
        component="img"
        height="194"
        image={`${mediaBasePath}/${sourceType}${props.imagePath}`}
        alt="Paella dish"
      />
      <CardActions disableSpacing>
        <IconButton
          aria-label="delete this image"
          onClick={onDeleteButtonClick}
        >
          <DeleteOutline />
        </IconButton>
      </CardActions>
    </Card>
  );
}
