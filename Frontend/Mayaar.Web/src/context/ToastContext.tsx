import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

/**
 * Represents the supported notification types.
 */
export type ToastType =
    | "success"
    | "error"
    | "warning"
    | "info";

/**
 * Represents a single toast notification.
 */
export interface Toast {
    /**
     * Unique identifier for the toast.
     */
    id: string;

    /**
     * Determines the visual and semantic type
     * of the notification.
     */
    type: ToastType;

    /**
     * The message displayed to the user.
     */
    message: string;

    /**
     * Amount of time, in milliseconds, before
     * the notification automatically disappears.
     */
    duration: number;
}

/**
 * Defines the public API exposed by ToastContext.
 */
interface ToastContextValue {
    /**
     * Currently visible toast notifications.
     */
    toasts: Toast[];

    /**
     * Displays a success notification.
     */
    showSuccess: (message: string) => void;

    /**
     * Displays an error notification.
     */
    showError: (message: string) => void;

    /**
     * Displays a warning notification.
     */
    showWarning: (message: string) => void;

    /**
     * Displays an informational notification.
     */
    showInfo: (message: string) => void;

    /**
     * Removes a specific toast notification.
     */
    removeToast: (id: string) => void;
}

/**
 * React context used to provide toast notification
 * functionality throughout the Mayaar application.
 */
const ToastContext = createContext<
    ToastContextValue | undefined
>(undefined);

/**
 * Defines the properties accepted by ToastProvider.
 */
interface ToastProviderProps {
    /**
     * React components that should have access to
     * the toast notification system.
     */
    children: ReactNode;
}

/**
 * Provides global toast notification functionality
 * to the Mayaar application.
 *
 * ToastProvider should be placed near the root of
 * the React component tree.
 *
 * @param props
 * Provider properties.
 *
 * @returns
 * The toast context provider.
 */
export function ToastProvider({
    children,
}: ToastProviderProps) {
    /**
     * Stores all currently visible notifications.
     */
    const [toasts, setToasts] = useState<Toast[]>([]);

    /**
     * Removes a notification by its identifier.
     */
    const removeToast = useCallback((id: string) => {
        setToasts((currentToasts) =>
            currentToasts.filter(
                (toast) => toast.id !== id,
            ),
        );
    }, []);

    /**
     * Creates and displays a new notification.
     */
    const showToast = useCallback(
        (
            type: ToastType,
            message: string,
            duration = 4000,
        ) => {
            /**
             * Generate a unique identifier.
             */
            const id = crypto.randomUUID();

            /**
             * Create the notification object.
             */
            const toast: Toast = {
                id,
                type,
                message,
                duration,
            };

            /**
             * Add the notification to the current collection.
             */
            setToasts((currentToasts) => [
                ...currentToasts,
                toast,
            ]);

            /**
             * Automatically remove the notification
             * after the configured duration.
             */
            window.setTimeout(() => {
                removeToast(id);
            }, duration);
        },
        [removeToast],
    );

    /**
     * Displays a success notification.
     */
    const showSuccess = useCallback(
        (message: string) => {
            showToast("success", message);
        },
        [showToast],
    );

    /**
     * Displays an error notification.
     */
    const showError = useCallback(
        (message: string) => {
            showToast("error", message);
        },
        [showToast],
    );

    /**
     * Displays a warning notification.
     */
    const showWarning = useCallback(
        (message: string) => {
            showToast("warning", message);
        },
        [showToast],
    );

    /**
     * Displays an informational notification.
     */
    const showInfo = useCallback(
        (message: string) => {
            showToast("info", message);
        },
        [showToast],
    );

    /**
     * Memoize the context value to avoid unnecessary
     * updates for consumers.
     */
    const contextValue = useMemo<ToastContextValue>(
        () => ({
            toasts,
            showSuccess,
            showError,
            showWarning,
            showInfo,
            removeToast,
        }),
        [
            toasts,
            showSuccess,
            showError,
            showWarning,
            showInfo,
            removeToast,
        ],
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    );
}

/**
 * Provides access to the Mayaar toast notification system.
 *
 * @returns
 * The toast notification context.
 *
 * @throws
 * An error if the hook is used outside ToastProvider.
 */
export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used within a ToastProvider.",
        );
    }

    return context;
}