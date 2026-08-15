import AppRoutes from "./routes/AppRoutes";

/**
 * Root React component of the Mayaar web application.
 *
 * App is responsible for connecting the application's root
 * component tree with the route configuration.
 *
 * Individual pages and application layouts are managed by
 * React Router through AppRoutes.
 *
 * @returns The Mayaar application.
 */
function App() {
    return <AppRoutes />;
}

export default App;