import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/navigation/Footer";
import "./main.css";
import Navigation from "./components/navigation/Navigation";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <Navigation />
      <main id="main">
        <App />
      </main>
      <Footer />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
