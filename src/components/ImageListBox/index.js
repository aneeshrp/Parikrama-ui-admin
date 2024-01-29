import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button, IconButton } from "@mui/material";
import { Photo, DeleteIcon, DeleteOutline } from "@mui/icons-material";

export default function ImageListBox(props) {
  const removeFile = (item) => {
    props.removeItem(item);
  };
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {props.files.map((file, index) => (
        <React.Fragment key={index}>
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => removeFile(file.name)}
              >
                <DeleteOutline />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <Photo />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={file.name}
              secondary={`Type: ${file.type}, Size: ${file.size}`}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}
