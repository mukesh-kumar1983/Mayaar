import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import CategoriesPage from "../pages/Categories/CategoriesPage";

/**
 * Defines the routing structure of the Mayaar web application.
 *
 * The MainLayout is used as the parent route.
 *
 * Child routes are rendered inside MainLayout's Outlet component.
 *
 * Current routes:
 *
 * /              -> DashboardPage
 * /categories    -> CategoriesPage
 *
 * More routes will be added as new Mayaar features are developed.
 *
 * @returns The application's route configuration.
 */
export default function AppRoutes() {
    return (
        <Routes>
            {/* 
             * Main application layout.
             *
             * Child routes declared below will be rendered
             * inside MainLayout's <Outlet />.
             */}
            <Route element={<MainLayout />}>
                {/* Dashboard route */}
                <Route
                    path="/"
                    element={<DashboardPage />}
                />

                {/* Categories route */}
                <Route
                    path="/categories"
                    element={<CategoriesPage />}
                />
            </Route>
        </Routes>
    );
}