import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Snackbar,
  Collapse,
  Typography,
  Box,
} from "@mui/material";
import { MdCancel } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const UserReportInfo = ({ row, i, handleDelete, handleCancel }) => {
  const [openDescription, setOpenDescription] = useState(false);

  //Snackbar logic
  const [snackbar, setSnackbar] = useState(false);
  function handleCloseSnackBar(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar(false);
  }

  return (
    <>
      <TableRow
        key={i}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpenDescription(!openDescription)}
          >
            {openDescription ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {i + 1}
        </TableCell>
        <TableCell align="center">{row[0]}</TableCell>
        <TableCell align="center">{row[1].date}</TableCell>
        <TableCell align="center">{row[1].time}</TableCell>
        <TableCell align="center">{row[1].pic}</TableCell>
        <TableCell align="center">{row[1].status}</TableCell>
        <TableCell align="center">
          {row[1].status === "Cancelled" || row[1].status === "Resolved" ? (
            <IconButton onClick={() => handleDelete(i)} color="error">
              <FaTrash size={20} />
            </IconButton>
          ) : (
            <Tooltip title="Cancel">
              <IconButton
                onClick={() => {
                  handleCancel(i);
                  setSnackbar(true);
                }}
                color="error"
              >
                <MdCancel />
              </IconButton>
            </Tooltip>
          )}
          {
            //Snackbar for cancelling report
            <Snackbar
              open={snackbar}
              autoHideDuration={2000}
              onClose={handleCloseSnackBar}
              message="Report cancelled."
            />
          }
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={openDescription} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              <p>{row[1].description}</p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default UserReportInfo;
