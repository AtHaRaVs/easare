import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadForm from "./components/UploadForm";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<UploadForm />} />
    </Routes>
  </Router>
);

export default App;
