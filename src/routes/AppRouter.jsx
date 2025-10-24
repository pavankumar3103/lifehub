import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
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
                
                {/* App pages - with layout */}
                <Route path="/dashboard" element={
                    <Layout>
                        <Dashboard />
                    </Layout>
                } />
                <Route path="/habits" element={
                    <Layout>
                        <Habits />
                    </Layout>
                } />
                <Route path="/meals" element={
                    <Layout>
                        <Meals />
                    </Layout>
                } />
                <Route path="/workouts" element={
                    <Layout>
                        <Workouts />
                    </Layout>
                } />
                <Route path="/mood" element={
                    <Layout>
                        <Mood />
                    </Layout>
                } />
                <Route path="/profile" element={
                    <Layout>
                        <Profile />
                    </Layout>
                } />
            </Routes>
        </Router>
    );
}