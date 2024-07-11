import { useEffect, useRef, useState, useReducer } from "react";
import { db } from "../../../firebase/firebase";
import {
  doc,
  collection,
  getDocs,
  query,
  deleteDoc,
  setDoc,
  where,
  limit,
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
  TableFooter,
  TablePagination,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  TextField,
  Snackbar,
  styled,
  tableCellClasses,
  Box,
  Tab,
  Container,
  Checkbox,
} from "@mui/material";
import { IoIosRefresh } from "react-icons/io";
import EditUserInterface from "./EditUserInterface";
import TablePaginationActions from "./TablePaginationActions";

//Styling copied from Material UI Table Component
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ManageUserPage = ({ authUser }) => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(true);

  //Read user data from Firestore
  const initialLoad = useRef(false);
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      console.log("Reading firestore");
      const userRef = collection(db, "accounts");
      const q = query(userRef, where("role", "==", "user"));
      var temp = [];
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            temp.push([doc.id, doc.data()]);
          });
        })
        .then(() => {
          setUsers(temp);
        })
        .then(() => {
          console.log(temp);
          initialized.current = true;
          initialLoad.current = true;
        });
    }
  }, [refresh, authUser.displayName]);

  //Page logics
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  function handleChangePage(event, newPage) {
    console.log("Changing page");
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    console.log("Changing rows per page");
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  //Edit user logic
  const [targetUser, setTargetUser] = useState([]);
  const [targetUserAccess, setTargetUserAccess] = useState([]);

  function chooseTargetUser(user) {
    setTargetUser(user);
    const accessRef = collection(db, "accounts", user[0], "access");
    var temp = [];
    getDocs(accessRef)
      .then((snapshot) => [
        snapshot.forEach((doc) => {
          temp.push([doc.id]);
        }),
      ])
      .then(() => {
        setTargetUserAccess(temp);
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
      <Box display={"flex"}>
        <Container>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Index</StyledTableCell>
                  <StyledTableCell align="center">Username</StyledTableCell>
                  <StyledTableCell align="center">Role</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? users.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : users
                ).map((user, i) => {
                  return (
                    <StyledTableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={() => chooseTargetUser(user)}
                    >
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {i + 1 + page * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {user[1].username}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        User
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    colSpan={3}
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Container>
        <Container>
          <EditUserInterface
            targetUser={targetUser}
            targetUserAccess={targetUserAccess}
          />
        </Container>
      </Box>
    </>
  );
};

export default ManageUserPage;
