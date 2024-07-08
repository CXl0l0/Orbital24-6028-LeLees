import { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  TableCell,
  TableRow,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const AdminReportInfo = ({ row, i, handleDelete, handleResolve }) => {
  const [openDescription, setOpenDescription] = useState(false);

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
        <TableCell align="center">{row[1].reporter}</TableCell>
        <TableCell align="center">{row[1].status}</TableCell>
        <TableCell align="center">
          {row[1].status === "Resolved" || row[1].status === "Cancelled" ? (
            <IconButton onClick={() => handleDelete(i)} color="error">
              <FaTrash size={20} />
            </IconButton>
          ) : (
            <Tooltip title="Resolve">
              <IconButton
                color="success"
                onClick={() => {
                  handleResolve(i);
                }}
              >
                <FaCheck size={20} />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={openDescription} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              <p>{row[1].description}</p>
            </Box>
            {row[1].comment !== undefined && (
              <Box sx={{ margin: 1, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Resolve Comment
                </Typography>
                <p>{row[1].comment}</p>
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default AdminReportInfo;
