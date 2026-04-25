import { Route, Routes } from "react-router-dom";
import ReportForm from "./components/ReportForm";

function App() {
  return (
    <Routes>
      <Route path="/rental-report-form" element={<ReportForm />} />
    </Routes>
  );
}

export default App;
