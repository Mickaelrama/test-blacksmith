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
  Chip,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import format from "format-duration";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { useEffect, useState, useCallback } from "react";
import ParkingForm from "../../../components/parking-form";
import { useAlert } from "react-alert";
import Swal from "sweetalert2";
import {
  mutateParking,
  getParkings,
  deleteParking,
} from "../../../redux/slices/parking";
import SetParkingUser from "../../../components/set-parking-user";

const ParkingPage = () => {
  const alert = useAlert();

  // store hooks
  const dispatch = useDispatch();
  const { parkings, count, loading } = useSelector((store) => store.parking);

  // states
  const [formData, setFormData] = useState({
    open: false,
    mode: "new",
    value: { id: null, etage: 0 },
  });
  const [tableData, setTableData] = useState({
    etage: 0,
    dispo: false,
    limit: 10,
    offset: 0,
    page: 0,
  });
  const [openAssign, setOpenAssign] = useState(false);
  const [parkingToAssign, setParkingToAssign] = useState(null);

  const updateListParking = useCallback(
    (tableData) => {
      const data = { ...tableData };
      delete data.page;
      dispatch(getParkings(data));
    },
    [dispatch]
  );

  const handleClickDelete = useCallback(
    (id) => () => {
      Swal.fire({
        title: "Vous voulez vraiment effacer cette place ?",
        showDenyButton: true,
        confirmButtonText: "Confirmer",
        denyButtonText: "Annuler",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const resp = dispatch(deleteParking(id));
          if (!resp.error) {
            Swal.fire("Suppression effectuée.", "", "success");
            updateListParking(tableData);
          }
        }
      });
    },
    [dispatch, tableData, updateListParking]
  );

  const handleClickEdit = (parking) => () => {
    console.log(parking);
    setFormData((state) => ({
      ...state,
      value: parking,
      mode: "edit",
      open: true,
    }));
  };

  const handleOnCloseUserForm = () => {
    setFormData((state) => ({ ...state, open: false }));
  };

  const handleClickParking = () => {
    setFormData((state) => ({ ...state, open: true, mode: "new" }));
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

  const handleClickAssign = (id) => () => {
    setOpenAssign(true);
    setParkingToAssign(id);
  };

  const handleSaveForm = useCallback(
    async (value) => {
      const dataToSave = value;
      if (!value.id) {
        delete dataToSave.id;
      }
      const {
        payload: { data },
      } = await dispatch(mutateParking(dataToSave));
      if (!data.errors) {
        alert.show("Enregistrement effectué.", { type: "success" });

        // upadate list
        updateListParking(tableData);

        // close form
        setFormData((state) => ({ ...state, open: false }));
        setOpenAssign(false);
      }
    },
    [alert, dispatch, tableData, updateListParking]
  );

  const handleClickDesassign = (id) => () => {
    handleSaveForm({ id, userId: null, tempsOccupation: null });
  };

  const handleChangeEtageFilter = (e) => {
    setTableData((state) => ({ ...state, etage: Math.floor(e.target.value) }));
  };

  const handleChangeDispoFilter = (_e, value) => {
    setTableData((state) => ({ ...state, dispo: value }));
  };

  useEffect(() => {
    updateListParking(tableData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableData.etage,
    tableData.etage,
    tableData.limit,
    tableData.offset,
    tableData.dispo,
  ]);

  return (
    <Box className="parking-page">
      <h1>Les places de parking</h1>
      <Box className="search-container">
        <Box className="filter-container" marginBottom={2}>
          <TextField
            sx={{ marginRight: 2 }}
            type="number"
            value={tableData.etage}
            onChange={handleChangeEtageFilter}
            size="small"
            label="Etage"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={tableData.dispo}
                onChange={handleChangeDispoFilter}
              />
            }
            label="Les places disponibles"
          />
        </Box>
        <Button
          sx={{ marginBottom: 2 }}
          variant="outlined"
          startIcon={<Add />}
          onClick={handleClickParking}
        >
          Ajouter une place
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nº de la place</TableCell>
              <TableCell>Etage</TableCell>
              <TableCell>Disponibilité</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              parkings.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.etage}</TableCell>
                  <TableCell>
                    {row.user ? (
                      <Box>
                        Occupée par <strong>{row.user.username}</strong> durant{" "}
                        <strong>{format(row.tempsOccupation * 1000)}</strong>
                      </Box>
                    ) : (
                      <Chip size="small" label="Disponible" color="success" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleClickEdit(row)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={handleClickDelete(row.id)}>
                      <Delete />
                    </IconButton>
                    {!row.user ? (
                      <Button
                        sx={{ marginLeft: 1 }}
                        variant="contained"
                        size="small"
                        onClick={handleClickAssign(row.id)}
                      >
                        Assigner à un Utilisateur
                      </Button>
                    ) : (
                      <Button
                        sx={{ marginLeft: 1 }}
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={handleClickDesassign(row.id)}
                      >
                        Désassigner
                      </Button>
                    )}
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
        <ParkingForm
          {...formData}
          onClose={handleOnCloseUserForm}
          onSave={handleSaveForm}
        />
      )}
      {openAssign && (
        <SetParkingUser
          open={openAssign}
          id={parkingToAssign}
          onClose={() => setOpenAssign(false)}
          onSave={handleSaveForm}
        />
      )}
    </Box>
  );
};

export default ParkingPage;
