import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import "./styles.scss";

const UserForm = ({ mode, open, onClose, value, onSave }) => {
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    role: null,
  });

  const disableSave = useMemo(
    () => !formData.username.length || !formData.email.length || !formData.role,
    [formData]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!disableSave) onSave(formData);
    },
    [formData, onSave, disableSave]
  );

  const handleChangeInput = (e) => {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleChangeRadio = (_e, value) => {
    setFormData((state) => ({ ...state, role: value }));
  };

  useEffect(() => {
    setFormData((state) => ({ ...state, ...value }));
  }, [value]);

  useEffect(() => {
    if (mode === "new")
      setFormData({
        id: null,
        username: "",
        email: "",
        password: "",
        role: null,
      });
  }, [mode]);

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        {mode === "edit" ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box className="form-container">
            <Box className="form-control">
              <TextField
                fullWidth
                type="text"
                name="username"
                required
                value={formData.username}
                label="Nom d'utilisateur"
                onChange={handleChangeInput}
              />
            </Box>
            <Box className="form-control">
              <TextField
                fullWidth
                type="email"
                name="email"
                required
                label="Email"
                value={formData.email}
                onChange={handleChangeInput}
              />
            </Box>
            <Box className="form-control">
              <TextField
                fullWidth
                type="password"
                name="password"
                required={mode === "new"}
                label={mode === "edit" ? "Mot de passe*" : "Mot de passe"}
                value={formData.password}
                onChange={handleChangeInput}
              />
            </Box>
            <FormControl>
              <FormLabel>Role*</FormLabel>
              <RadioGroup
                name="role"
                value={formData.role}
                onChange={handleChangeRadio}
                required
              >
                <FormControlLabel
                  value="ADMIN"
                  control={<Radio />}
                  label="Administrateur"
                />
                <FormControlLabel
                  value="PUBLIC"
                  control={<Radio />}
                  label="Public"
                />
              </RadioGroup>
            </FormControl>
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

export default UserForm;
