import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

/**
 * Provides the main application shell for Mayaar.
 *
 * The layout consists of:
 *
 * Sidebar
 *     ↓
 * Primary application navigation
 *
 * Header
 *     ↓
 * Search, notifications and user information
 *
 * Outlet
 *     ↓
 * Currently selected application page
 *
 * React Router renders the active child route through
 * the Outlet component.
 *
 * @returns The complete Mayaar application shell.
 */
export default function MainLayout() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Primary application navigation */}
            <Sidebar />

            {/* Main application area */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Application header */}
                <Header />

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}