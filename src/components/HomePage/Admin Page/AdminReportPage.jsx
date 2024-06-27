import { useEffect, useRef, useState, useReducer } from "react";
import { db } from "../../../firebase/firebase";
import {
  doc,
  collection,
  getDocs,
  query,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { IoIosRefresh } from "react-icons/io";
import { FaCrow } from "react-icons/fa";
import AdminReportInfo from "./AdminReportInfo";

const AdminReportPage = ({ authUser }) => {
  const initialLoad = useRef(false);

  const [reports, setReports] = useState([]);
  const [refresh, setRefresh] = useState(true);

  //Read report data from Firestore
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      console.log("Reading firestore");
      const reportRef = collection(db, "report", "admin", authUser.displayName);
      const q = query(reportRef);
      var temp = [];
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            temp.push([doc.id, doc.data()]);
          });
        })
        .then(() => {
          setReports(temp);
        })
        .then(() => {
          initialLoad.current = true;
        });
    }
  }, [refresh, authUser.displayName]);

  //Force render bypass method from
  //https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
  //End

  function handleDelete(i) {
    console.log(reports);
    console.log(i);
    const roomNum = reports[i][0];

    deleteDoc(doc(db, "report", "admin", authUser.displayName, roomNum)).then(
      () => {
        initialized.current = false;
        setRefresh(!refresh);
      }
    );
  }

  function handleResolve(i) {
    const roomNum = reports[i][0];
    const reporter = reports[i][1].reporter;
    const userUID = reports[i][1].userUID;
    const time = reports[i][1].time;
    const date = reports[i][1].date;
    const description = reports[i][1].description;
    console.log(roomNum + " " + userUID);

    setDoc(doc(db, "report", "admin", authUser.displayName, roomNum), {
      reporter: reporter,
      userUID: userUID,
      status: "Resolved",
      time: time,
      date: date,
      description: description,
    })
      .then(() => {
        setDoc(doc(db, "report", "user", userUID, roomNum), {
          reporter: reporter,
          pic: authUser.displayName,
          status: "Resolved",
          time: time,
          date: date,
          description: description,
        });
      })
      .then(() => {
        var temp = reports;
        temp[i] = [
          roomNum,
          {
            reporter: reporter,
            userUID: userUID,
            status: "Resolved",
            time: time,
            date: date,
            description: description,
          },
        ];
        setReports(temp);
      })
      .then(() => {
        handleClick();
      });
  }

  return !initialLoad.current ? ( //Loading
    <>
      <br />
      <LinearProgress />
    </>
  ) : (
    <>
      <IconButton
        onClick={() => {
          //Refresh
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
              <TableCell align="center" />
              <TableCell align="center">Index</TableCell>
              <TableCell align="center">Room Number</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Time Reported</TableCell>
              <TableCell align="center">Reporter</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((row, i) => {
              return (
                <AdminReportInfo
                  row={row}
                  i={i}
                  handleDelete={handleDelete}
                  handleResolve={handleResolve}
                />
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
