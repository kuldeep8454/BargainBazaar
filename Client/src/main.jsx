import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ConfigProvider } from "antd";
import store from "./redux/store.jsx";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: "#40513B",
              colorPrimaryHover: "#40513B",
              borderRadius: "2px",
              boxShadow: "none",
            },
          },
          token: {
            borderRadius: "2px",
            colorPrimary: "#40513B",
          },
        }}
      >
        <App />
      </ConfigProvider>
  </Provider>
);
