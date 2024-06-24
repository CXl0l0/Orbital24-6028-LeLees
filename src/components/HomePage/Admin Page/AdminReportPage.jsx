import { useEffect, useRef, useState, useReducer } from "react";
import { db } from "../../../firebase/firebase";
import { doc, collection, getDocs, query, deleteDoc } from "firebase/firestore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import { IconButton, Tooltip, LinearProgress } from "@mui/material";
import { IoIosRefresh } from "react-icons/io";
import { FaCrow } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

const AdminReportPage = ({ authUser }) => {
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
      const reportRef = collection(db, "report", "admin", authUser.displayName);
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

  /*
  const dbListener = onSnapshot(
    collection(db, "report", "admin", authUser.displayName),
    (collection) => {
      console.log("Something changed");
    }
  );*/

  //Force render bypass method from
  //https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
  //End

  function handleResolve(i) {
    const roomNum = reports[i][0];
    const reporter = reports[i][1].reporter;
    const userUID = reports[i][1].reporterUID;
    console.log(roomNum + " " + userUID);

    deleteDoc(doc(db, "report", "admin", authUser.displayName, roomNum))
      .then(() => {
        deleteDoc(doc(db, "report", "user", userUID, roomNum));
      })
      .then(() => {
        var temp = reports;
        temp[i] = [
          roomNum,
          { reporter: reporter, userUID: userUID },
          "Resolved",
        ];
        setReports(temp);
        setSnackbar(true);
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
              <TableCell align="center">Reporter</TableCell>
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
                  <TableCell align="center">{row[1].reporter}</TableCell>
                  <TableCell align="center">{row[2]}</TableCell>
                  <TableCell align="center">
                    {row[2] === "Resolved" ? (
                      <IconButton disabled>
                        <FaCheck size={20} />
                      </IconButton>
                    ) : (
                      <Tooltip title="Resolve">
                        <IconButton
                          color="success"
                          onClick={() => handleResolve(i)}
                        >
                          <FaCheck size={20} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {
                      //Snackbar for resolving report
                      <Snackbar
                        open={snackbar}
                        autoHideDuration={2000}
                        onClose={handleCloseSnackBar}
                        message="Report resolved."
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

export default AdminReportPage;
