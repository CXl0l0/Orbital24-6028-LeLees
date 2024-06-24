import { useEffect, useRef, useState, useReducer } from "react";
import { db } from "../../../firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, Tooltip, Snackbar, LinearProgress } from "@mui/material";
import { IoIosRefresh } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FaCrow } from "react-icons/fa";

const UserReportPage = ({ authUser }) => {
  const initialLoad = useRef(false);

  const [reports, setReports] = useState([]);
  const [refresh, setRefresh] = useState(true);

  //Snackbar logic
  const [snackbar, setSnackbar] = useState(false);
  function handleCloseSnackBar(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar(false);
  }

  //Read report data from Firestore
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      console.log("Reading firestore");
      const reportRef = collection(db, "report", "user", authUser.uid);
      const q = query(reportRef);
      var temp = [];
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            temp.push([doc.id, doc.data(), "Pending"]);
          });
        })
        .then(() => {
          setReports(temp);
        })
        .then(() => {
          initialLoad.current = true;
        });
    }
  }, [refresh]);

  //Force render bypass method from
  //https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
  //End

  function handleCancel(i) {
    const roomNum = reports[i][0];
    const pic = reports[i][1].pic;
    console.log(roomNum + " " + pic);
    setSnackbar(true);

    deleteDoc(doc(db, "report", "admin", pic, roomNum))
      .then(() => {
        deleteDoc(doc(db, "report", "user", authUser.uid, roomNum));
      })
      .then(() => {
        var temp = reports;
        temp[i] = [
          roomNum,
          { pic: pic, reporter: authUser.displayName },
          "Cancelled",
        ];
        setReports(temp);
      })
      .then(() => {
        handleClick();
      });
  }

  return !initialLoad.current ? (
    <>
      <br />
      <LinearProgress />
    </>
  ) : (
    <>
      <IconButton
        onClick={() => {
          initialized.current = false;
          setRefresh(!refresh);
        }}
      >
        <IoIosRefresh />
      </IconButton>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Index</TableCell>
              <TableCell align="center">Room Number</TableCell>
              <TableCell align="center">Person In Charge</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((row, i) => {
              return (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {i + 1}
                  </TableCell>
                  <TableCell align="center">{row[0]}</TableCell>
                  <TableCell align="center">{row[1].pic}</TableCell>
                  <TableCell align="center">{row[2]}</TableCell>
                  <TableCell align="center">
                    {row[2] === "Cancelled" ? (
                      <IconButton disabled>
                        <MdCancel />
                      </IconButton>
                    ) : (
                      <Tooltip title="Cancel">
                        <IconButton
                          onClick={() => handleCancel(i)}
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      {reports.length === 0 && (
        <center>
          <FaCrow /> All quiet...
        </center>
      )}
    </>
  );
};

export default UserReportPage;
