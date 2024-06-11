import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const AddDeviceCard = () => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Sound Sensor
        </Typography>
        <Typography variant="h5" component="div">
          ESP32
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Room #001
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">View Device</Button>
      </CardActions>
    </Card>
  );
};

export default AddDeviceCard;
