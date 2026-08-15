import {
    AlertTriangle,
    X,
} from "lucide-react";
import type {
    MouseEvent,
    ReactNode,
} from "react";

/**
 * Defines the properties accepted by the ConfirmDialog component.
 */
interface ConfirmDialogProps {
    /**
     * Determines whether the confirmation dialog is visible.
     */
    isOpen: boolean;

    /**
     * The title displayed at the top of the dialog.
     */
    title: string;

    /**
     * The primary message displayed to the user.
     *
     * ReactNode is used instead of string so callers can provide
     * formatted content when necessary.
     */
    message: ReactNode;

    /**
     * Text displayed on the confirmation button.
     *
     * Defaults to "Delete".
     */
    confirmText?: string;

    /**
     * Text displayed on the cancellation button.
     *
     * Defaults to "Cancel".
     */
    cancelText?: string;

    /**
     * Indicates whether the confirmation action is currently
     * being processed.
     *
     * When true, the confirmation button is disabled and
     * displays a processing state.
     */
    isLoading?: boolean;

    /**
     * Callback executed when the user confirms the action.
     */
    onConfirm: () => void;

    /**
     * Callback executed when the user cancels the action
     * or closes the dialog.
     */
    onCancel: () => void;
}

/**
 * Displays a reusable confirmation dialog.
 *
 * This component replaces browser-native confirmation dialogs
 * such as window.confirm().
 *
 * The component is intentionally generic so it can be reused
 * throughout Mayaar for operations such as:
 *
 * - Deleting categories
 * - Deleting products
 * - Removing customers
 * - Deactivating records
 * - Other destructive operations
 *
 * @param props The properties supplied to the dialog.
 * @returns The confirmation dialog when open; otherwise null.
 */
export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    /**
     * Do not render anything when the dialog is closed.
     *
     * Returning null tells React that this component should
     * not contribute any elements to the rendered DOM.
     */
    if (!isOpen) {
        return null;
    }

    /**
     * Prevents clicks inside the dialog from propagating
     * to the surrounding backdrop.
     */
    const handleDialogClick = (
        event: MouseEvent<HTMLDivElement>
    ) => {
        event.stopPropagation();
    };

    return (
        /*
         * Full-screen backdrop.
         *
         * fixed:
         * Keeps the dialog positioned relative to the browser
         * viewport rather than the surrounding page.
         *
         * inset-0:
         * Makes the backdrop cover the entire viewport.
         *
         * z-50:
         * Places the dialog above normal application content.
         */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            role="presentation"
            onMouseDown={onCancel}
        >
            {/* Confirmation dialog */}
            <div
                className="w-full max-w-md rounded-xl bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
                onMouseDown={handleDialogClick}
            >
                {/* Dialog header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle
                                size={20}
                                strokeWidth={2}
                                className="text-red-600"
                            />
                        </div>

                        <h2
                            id="confirm-dialog-title"
                            className="text-lg font-semibold text-slate-900"
                        >
                            {title}
                        </h2>
                    </div>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        aria-label="Close confirmation dialog"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X
                            size={20}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>

                {/* Dialog body */}
                <div
                    id="confirm-dialog-message"
                    className="px-6 py-5"
                >
                    <div className="text-sm leading-6 text-slate-600">
                        {message}
                    </div>
                </div>

                {/* Dialog actions */}
                <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Deleting..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}