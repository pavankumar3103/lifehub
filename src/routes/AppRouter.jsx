import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import Habits from "../pages/Habits";
import Meals from "../pages/Meals";
import Workouts from "../pages/Workouts";
import Mood from "../pages/Mood";
import Profile from "../pages/Profile";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Landing page - no layout */}
                <Route path="/" element={<HomePage />} />
                
                {/* App pages - with layout and protection */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/habits" element={
                    <ProtectedRoute>
                        <Layout>
                            <Habits />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/meals" element={
                    <ProtectedRoute>
                        <Layout>
                            <Meals />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/workouts" element={
                    <ProtectedRoute>
                        <Layout>
                            <Workouts />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/mood" element={
                    <ProtectedRoute>
                        <Layout>
                            <Mood />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}