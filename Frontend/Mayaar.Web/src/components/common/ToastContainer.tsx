import {
    CheckCircle2,
    Info,
    TriangleAlert,
    X,
    XCircle,
} from "lucide-react";
import type { Toast, ToastType } from "../../context/ToastContext";
import { useToast } from "../../context/ToastContext";

/**
 * Defines the visual configuration used by a toast type.
 */
interface ToastStyle {
    /**
     * Background color classes for the toast icon container.
     */
    iconBackground: string;

    /**
     * Text color classes for the toast icon.
     */
    iconColor: string;

    /**
     * Background color classes for the toast's
     * left-side accent indicator.
     */
    accentColor: string;
}

/**
 * Provides the visual configuration for each
 * supported toast notification type.
 *
 * Keeping this configuration in one place makes it
 * easier to maintain a consistent notification design.
 */
const toastStyles: Record<ToastType, ToastStyle> = {
    success: {
        iconBackground: "bg-emerald-100",
        iconColor: "text-emerald-600",
        accentColor: "bg-emerald-500",
    },

    error: {
        iconBackground: "bg-red-100",
        iconColor: "text-red-600",
        accentColor: "bg-red-500",
    },

    warning: {
        iconBackground: "bg-amber-100",
        iconColor: "text-amber-600",
        accentColor: "bg-amber-500",
    },

    info: {
        iconBackground: "bg-blue-100",
        iconColor: "text-blue-600",
        accentColor: "bg-blue-500",
    },
};

/**
 * Returns the appropriate Lucide icon for a toast type.
 *
 * @param type
 * The type of toast notification.
 *
 * @returns
 * A Lucide React icon component.
 */
function getToastIcon(type: ToastType) {
    switch (type) {
        case "success":
            return CheckCircle2;

        case "error":
            return XCircle;

        case "warning":
            return TriangleAlert;

        case "info":
            return Info;
    }
}

/**
 * Returns a human-readable label for a toast type.
 *
 * This label is used as an accessible heading for
 * screen-reader users.
 *
 * @param type
 * The type of toast notification.
 *
 * @returns
 * A human-readable notification type.
 */
function getToastLabel(type: ToastType): string {
    switch (type) {
        case "success":
            return "Success";

        case "error":
            return "Error";

        case "warning":
            return "Warning";

        case "info":
            return "Information";
    }
}

/**
 * Displays all currently active toast notifications.
 *
 * ToastContainer consumes the toast state exposed by
 * ToastContext and renders each notification in the
 * upper-right corner of the application.
 *
 * The component is designed to support multiple
 * simultaneous notifications.
 *
 * @returns
 * The collection of visible toast notifications.
 */
export default function ToastContainer() {
    /**
     * Retrieve the currently active toasts and the
     * function used to remove individual notifications.
     */
    const {
        toasts,
        removeToast,
    } = useToast();

    return (
        <div
            className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() =>
                        removeToast(toast.id)
                    }
                />
            ))}
        </div>
    );
}

/**
 * Defines the properties accepted by ToastItem.
 */
interface ToastItemProps {
    /**
     * The toast notification to display.
     */
    toast: Toast;

    /**
     * Callback executed when the user closes
     * the notification manually.
     */
    onClose: () => void;
}

/**
 * Renders an individual toast notification.
 *
 * This component is intentionally separate from
 * ToastContainer so that the container remains
 * responsible only for displaying the collection
 * of notifications.
 *
 * @param props
 * Toast data and close callback.
 *
 * @returns
 * A single toast notification.
 */
function ToastItem({
    toast,
    onClose,
}: ToastItemProps) {
    /**
     * Get the visual configuration associated with
     * the current toast type.
     */
    const style = toastStyles[toast.type];

    /**
     * Select the appropriate icon.
     */
    const Icon = getToastIcon(toast.type);

    /**
     * Generate an accessible label for the notification.
     */
    const label = getToastLabel(toast.type);

    return (
        <div
            className="pointer-events-auto relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            role="status"
        >
            {/*
             * Colored vertical accent on the left side
             * of the notification.
             */}
            <div
                className={`absolute inset-y-0 left-0 w-1 ${style.accentColor}`}
                aria-hidden="true"
            />

            <div className="flex items-start gap-3 px-4 py-3 pl-5">
                {/*
                 * Notification icon.
                 */}
                <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.iconBackground}`}
                >
                    <Icon
                        size={19}
                        strokeWidth={2}
                        className={style.iconColor}
                        aria-hidden="true"
                    />
                </div>

                {/*
                 * Notification content.
                 */}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                        {label}
                    </p>

                    <p className="mt-0.5 text-sm leading-5 text-slate-600">
                        {toast.message}
                    </p>
                </div>

                {/*
                 * Manual close button.
                 *
                 * Users do not have to wait for the
                 * automatic timeout.
                 */}
                <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={`Close ${label.toLowerCase()} notification`}
                >
                    <X
                        size={17}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    );
}