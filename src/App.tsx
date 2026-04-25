import { Route, Routes } from "react-router-dom";
import ReportForm from "./components/ReportForm";
import { AppProvider } from "./providers/AppProvider";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/rental-report-form" element={<ReportForm />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
