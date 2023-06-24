import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import Modal from "react-modal";
import { UserProvider } from "context/UserContext";

Modal.setAppElement("#root");

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <UserProvider>
        <App />
    </UserProvider>)
    ;