import Dashboard from "./pages/Dashboard";
import AddPayment from "./pages/AddPayment";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Smart Apartment Maintenance Management System</h1>
      <Dashboard />
      <hr />
      <AddPayment />
    </div>
  );
}

export default App;
