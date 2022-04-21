import DurationPicker from "react-duration-picker";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import durationToSecond from "../../tools/durationToSecond";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../../redux/slices/user";
import "./styles.scss";

const SetParkingUser = ({ id, open, onClose, onSave }) => {
  const { users, loading } = useSelector((store) => store.user);
  const [formData, setFormData] = useState({
    userId: null,
    id,
    tempsOccupation: null,
  });
  const dispatch = useDispatch();

  const [autoCompleteData, setAutoCompleteData] = useState({
    limit: 20,
    offset: 0,
    role: "PUBLIC",
    keyword: "",
  });
  const [openAutoComplete, setOpenAutoComplete] = useState(false);

  const handleChangeDuration = useCallback((value) => {
    const durationFormat = `${value.hours}:${value.minutes}:${value.seconds}`;
    setFormData((state) => ({
      ...state,
      tempsOccupation: durationToSecond(durationFormat),
    }));
  }, []);

  const handelChangeInputAutocomplete = (_e, value) => {
    setAutoCompleteData((state) => ({ ...state, keyword: value.trim() }));
  };

  const getUsersList = useCallback(() => {
    dispatch(getUsers(autoCompleteData));
  }, [dispatch, autoCompleteData]);

  const handleOnChangeAutocomplete = (_e, value) => {
    setFormData((state) => ({
      ...state,
      userId: value.id,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.tempsOccupation && formData.tempsOccupation) {
      onSave(formData);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getUsersList(autoCompleteData);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCompleteData.keyword]);

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <DialogTitle>Assigner à un client</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box className="form-container">
            <Box className="form-control">
              <Autocomplete
                open={openAutoComplete}
                onOpen={() => {
                  setOpenAutoComplete(true);
                }}
                onClose={() => {
                  setOpenAutoComplete(false);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.username}
                onInputChange={handelChangeInputAutocomplete}
                options={users}
                loading={loading}
                onChange={handleOnChangeAutocomplete}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client*"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
            <Box className="form-control">
              <label>Temps d'occupation</label>
              <DurationPicker onChange={handleChangeDuration} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button
            type="submit"
            disabled={!formData.userId || !formData.tempsOccupation}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SetParkingUser;
