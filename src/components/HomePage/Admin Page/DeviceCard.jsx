import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface Props {
  deviceName: string;
  roomNumber: string;
  viewDevice: () => null;
  removeDevice: () => boolean;
}

const DeviceCard = ({
  deviceName,
  roomNumber,
  viewDevice,
  removeDevice,
}: Props) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Sound Sensor
        </Typography>
        <Typography variant="h5" component="div">
          {deviceName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Room #{roomNumber}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={viewDevice}>
          View Device
        </Button>
        <Button color="error" size="small" onClick={removeDevice}>
          Delete Device
        </Button>
      </CardActions>
    </Card>
  );
};

export default DeviceCard;
