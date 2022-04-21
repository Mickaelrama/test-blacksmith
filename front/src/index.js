import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { store, persistor } from "./redux";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import RouterView from "./router";
import { BrowserRouter as Router } from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import "./assets/styles/index.scss";
import "sweetalert2/dist/sweetalert2.css";

// alert option
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: "16px",
  transition: transitions.SCALE,
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AlertProvider template={AlertTemplate} {...options}>
          <Suspense fallback={null}>
            <Router>
              <RouterView />
            </Router>
          </Suspense>
        </AlertProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
