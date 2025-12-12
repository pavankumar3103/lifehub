import React from "react";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
      <AuthProvider>
        <DataProvider>
          <AppRouter />
        </DataProvider>
      </AuthProvider>
  );
}

export default App;