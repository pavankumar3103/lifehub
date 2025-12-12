import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import AppRouter from "./routes/AppRouter";

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