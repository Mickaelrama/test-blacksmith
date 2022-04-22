import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Box,
  TextField,
} from "@mui/material";
import "./styles.scss";

const ParkinForm = ({ mode, open, onClose, value, onSave }) => {
  const [formData, setFormData] = useState({
    id: null,
    etage: 0,
  });

  const disableSave = useMemo(() => !formData.etage, [formData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!disableSave) onSave(formData);
    },
    [formData, onSave, disableSave]
  );

  const handleChangeInput = (e) => {
    setFormData((state) => ({
      ...state,
      [e.target.name]: Math.floor(e.target.value),
    }));
  };

  useEffect(() => {
    setFormData((state) => ({ id: value.id, etage: value.etage }));
  }, [value]);

  useEffect(() => {
    if (mode === "new") {
      setFormData({ id: null, etage: 0 });
    }
  }, [mode]);

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        {mode === "edit" ? "Modifier une place" : "Ajouter une Place"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box className="form-container">
            <Box className="form-control">
              <TextField
                fullWidth
                type="number"
                name="etage"
                required
                value={formData.etage}
                label="Etage"
                onChange={handleChangeInput}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" disabled={disableSave}>
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ParkinForm;
