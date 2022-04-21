import { Card, TextField, Box, Button } from "@mui/material";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { loginThunk } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const Login = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      payload: { errors },
    } = await dispatch(loginThunk(formData)); // call api and setup state in redux
    if (errors) {
      if (errors[0].message === "username or email don't exist.") {
        alert.show("Nom d'utilisateur ou email n'existe pas.", {
          type: "error",
        });
      } else if (errors[0].message === "wrong password") {
        alert.show("Mot de passe incorrect.", { type: "error" });
      }
    } else {
      navigate("/"); // go back
    }
  };

  return (
    <Box className="login">
      <Card className="login-form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <Box className="from-control">
            <TextField
              label="Nom d'utilisateur | email"
              value={formData.usernameOrEmail}
              fullWidth
              name="usernameOrEmail"
              onChange={handleChange}
            />
          </Box>
          <Box className="from-control">
            <TextField
              type="password"
              label="Mot de passe"
              value={formData.password}
              fullWidth
              name="password"
              onChange={handleChange}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={
              !formData.usernameOrEmail.length ||
              !formData.password.length ||
              loading
            }
          >
            Login
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default Login;
