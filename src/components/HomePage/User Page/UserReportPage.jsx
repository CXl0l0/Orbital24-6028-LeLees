import { useEffect, useRef, useState, useReducer } from "react";
import { db } from "../../../firebase/firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, LinearProgress } from "@mui/material";
import { IoIosRefresh } from "react-icons/io";
import { FaCrow } from "react-icons/fa";
import UserReportInfo from "./UserReportInfo";

const UserReportPage = ({ authUser }) => {
  const initialLoad = useRef(false);

  const [reports, setReports] = useState([]);
  const [refresh, setRefresh] = useState(true);

  //Read report data from Firestore
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      console.log("Reading firestore");
      const reportRef = collection(db, "report", "user", authUser.uid);
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
  }, [refresh]);

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

    deleteDoc(doc(db, "report", "user", authUser.uid, roomNum)).then(() => {
      initialized.current = false;
      setRefresh(!refresh);
    });
  }

  function handleCancel(i) {
    const roomNum = reports[i][0];
    const pic = reports[i][1].pic;
    const time = reports[i][1].time;
    const date = reports[i][1].date;
    const description = reports[i][1].description;
    console.log(roomNum + " " + pic);

    setDoc(doc(db, "report", "admin", pic, roomNum), {
      reporter: authUser.displayName,
      userUID: authUser.uid,
      status: "Cancelled",
      time: time,
      date: date,
      description: description,
    })
      .then(() => {
        setDoc(doc(db, "report", "user", authUser.uid, roomNum), {
          reporter: authUser.displayName,
          pic: pic,
          status: "Cancelled",
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
            pic: pic,
            reporter: authUser.displayName,
            status: "Cancelled",
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
              <TableCell align="center" />
              <TableCell align="center">Index</TableCell>
              <TableCell align="center">Room Number</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Time Reported</TableCell>
              <TableCell align="center">Person In Charge</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((row, i) => {
              return (
                <UserReportInfo
                  row={row}
                  i={i}
                  handleDelete={handleDelete}
                  handleCancel={handleCancel}
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

export default UserReportPage;
