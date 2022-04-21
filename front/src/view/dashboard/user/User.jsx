import {
  Box,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  TablePagination,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { useEffect, useState, useCallback } from "react";
import { getUsers } from "../../../redux/slices/user";
import SearchInput from "../../../components/search-input";
import UserForm from "../../../components/user-form";
import { mutateUser, deleteUser } from "../../../redux/slices/user";
import { useAlert } from "react-alert";
import Swal from "sweetalert2";

const UserPage = () => {
  const alert = useAlert();

  // store hooks
  const dispatch = useDispatch();
  const { users, count, loading } = useSelector((store) => store.user);

  // states
  const [formData, setFormData] = useState({
    open: false,
    mode: "new",
    value: { id: null, username: "", role: null, password: "", email: "" },
  });
  const [tableData, setTableData] = useState({
    keyword: "",
    limit: 10,
    offset: 0,
    page: 0,
  });

  const updateListUser = useCallback(
    (tableData) => {
      dispatch(
        getUsers({
          keyword: tableData.keyword || "",
          limit: tableData.limit,
          offset: tableData.offset,
        })
      );
    },
    [dispatch]
  );

  const handleClickDelete = useCallback(
    (id) => () => {
      Swal.fire({
        title: "Vous voulez vraiment effacer cet utilisateur ?",
        showDenyButton: true,
        confirmButtonText: "Confirmer",
        denyButtonText: "Annuler",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const resp = await dispatch(deleteUser(id));
          if (!resp.error) {
            Swal.fire("Suppression effectuée.", "", "success");
            updateListUser(tableData);
          }
        }
      });
    },
    [dispatch, tableData, updateListUser]
  );

  const handleClickEdit = (user) => () => {
    setFormData((state) => ({
      ...state,
      value: user,
      mode: "edit",
      open: true,
    }));
  };

  const handleOnCloseUserForm = () => {
    setFormData((state) => ({ ...state, open: false }));
  };

  const handleClickAddUser = () => {
    setFormData((state) => ({ ...state, open: true, mode: "new" }));
  };

  const handleOnChangeSearchTextInput = (value) => {
    setTableData((state) => ({ ...state, keyword: value }));
  };

  const handleOnPageChange = (_e, value) => {
    setTableData((state) => ({
      ...state,
      page: value,
      offset: value * state.limit,
    }));
  };

  const handleOnRowsPerPageChange = (e) => {
    setTableData((state) => ({ ...state, limit: parseInt(e.target.value) }));
  };

  const handleSaveForm = async (user) => {
    const _user = user;

    // remove password key if password is empty
    if (user.password.length === 0) {
      delete _user.password;
    }

    if (!user.id) {
      delete _user.id;
    }

    const {
      payload: { data },
    } = await dispatch(mutateUser(_user));

    if (!data.error) {
      alert.show("Enregistrement effectué.", { type: "success" });

      //update list
      updateListUser(tableData);

      // close form
      setFormData((state) => ({ ...state, open: false }));
    } else {
      alert.show(
        "Veuillez bien verifier si nom d'utilisateur et l'email sont uniques.",
        { type: "error" }
      );
    }
  };

  useEffect(() => {
    // get form api users
    updateListUser(tableData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData.limit, tableData.keyword, tableData.offset]);

  return (
    <Box className="user-page">
      <h1>Les utilisateurs</h1>
      <Box className="search-container">
        <Box maxWidth={300} marginBottom={2}>
          <SearchInput onChange={handleOnChangeSearchTextInput} />
        </Box>
        <Button
          sx={{ marginBottom: 2 }}
          variant="outlined"
          startIcon={<Add />}
          onClick={handleClickAddUser}
        >
          Ajouter un nouveau utilisateur
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              users.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.role === "ADMIN" ? "Administrateur" : "Public"}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleClickEdit(row)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={handleClickDelete(row.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {loading && (
          <Box className="loading-container">Chargement en cours...</Box>
        )}
        <TablePagination
          rowsPerPageOptions={[10, 30, 60]}
          component="div"
          count={count}
          labelRowsPerPage="Lignes par page"
          rowsPerPage={tableData.limit}
          page={tableData.page}
          onPageChange={handleOnPageChange}
          onRowsPerPageChange={handleOnRowsPerPageChange}
        />
      </TableContainer>
      {formData.open && (
        <UserForm
          {...formData}
          onClose={handleOnCloseUserForm}
          onSave={handleSaveForm}
        />
      )}
    </Box>
  );
};

export default UserPage;
