import { useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { categoryService } from "../services/categoryService";
import type { CreateCategoryRequest } from "../types/category";

/**
 * Represents the Categories management page.
 *
 * This page provides functionality for:
 * - Retrieving categories from the Mayaar API.
 * - Displaying categories in a table.
 * - Opening the Create Category dialog.
 * - Creating a new category.
 * - Refreshing the category list after creation.
 *
 * The component communicates with the backend through:
 *
 * React
 *   ↓
 * TanStack Query
 *   ↓
 * categoryService
 *   ↓
 * Axios
 *   ↓
 * Mayaar API
 *   ↓
 * PostgreSQL
 *
 * @returns The rendered Categories management page.
 */
export default function CategoriesPage() {
    /**
     * Provides access to the TanStack Query client.
     *
     * The query client is used to invalidate the categories query
     * after a category has been successfully created.
     */
    const queryClient = useQueryClient();

    /**
     * Controls whether the Create Category dialog is visible.
     *
     * `false` means the dialog is hidden.
     * `true` means the dialog is visible.
     */
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    /**
     * Stores the category name entered by the user.
     */
    const [name, setName] = useState("");

    /**
     * Stores the category description entered by the user.
     */
    const [description, setDescription] = useState("");

    /**
     * Retrieves all categories from the Mayaar API.
     *
     * TanStack Query automatically manages:
     * - Loading state.
     * - Error state.
     * - Retrieved data.
     * - Caching.
     * - Refetching.
     *
     * The query is identified by the `categories` query key.
     */
    const {
        data: categories,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: categoryService.getAll,
    });

    /**
     * Creates a new category through the Mayaar API.
     *
     * `useMutation` is used because creating a category changes
     * server-side data.
     */
    const createMutation = useMutation({
        /**
         * Executes the category creation request.
         *
         * @param request The category creation request.
         * @returns The newly created category.
         */
        mutationFn: (request: CreateCategoryRequest) =>
            categoryService.create(request),

        /**
         * Executes after the category has been successfully created.
         *
         * The categories query is invalidated so TanStack Query
         * retrieves the latest category list from the API.
         */
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            /**
             * Reset the form fields.
             */
            setName("");
            setDescription("");

            /**
             * Close the Create Category dialog.
             */
            setIsCreateOpen(false);
        },
    });

    /**
     * Handles submission of the Create Category form.
     *
     * @param event The browser form submission event.
     */
    const handleCreate = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        /**
         * Prevent the browser from performing a traditional
         * full-page form submission.
         */
        event.preventDefault();

        /**
         * Do not submit an empty category name.
         */
        if (!name.trim()) {
            return;
        }

        /**
         * Send the category to the backend API.
         */
        createMutation.mutate({
            name: name.trim(),
            description: description.trim() || null,
            imageUrl: null,
        });
    };

    /**
     * Displays the loading state while categories are being retrieved.
     */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <div className="mx-auto max-w-6xl">
                    <p className="text-slate-500">
                        Loading categories...
                    </p>
                </div>
            </div>
        );
    }

    /**
     * Displays an error message when the category request fails.
     */
    if (isError) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <div className="mx-auto max-w-6xl">
                    <p className="text-red-600">
                        Failed to load categories:{" "}
                        {error instanceof Error
                            ? error.message
                            : "Unknown error"}
                    </p>
                </div>
            </div>
        );
    }

    /**
     * Renders the Categories page.
     */
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="mx-auto max-w-6xl">

                {/*
                 * Page header
                 */}
                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Categories
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Manage your product categories.
                        </p>
                    </div>

                    {/*
                     * Opens the Create Category dialog.
                     */}
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>

                {/*
                 * Category table.
                 */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    {/*
                     * Table header.
                     */}
                    <div className="grid grid-cols-[1fr_2fr_120px] border-b border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600">
                        <div>Name</div>
                        <div>Description</div>
                        <div>Status</div>
                    </div>

                    {/*
                     * Display a message when no categories exist.
                     */}
                    {categories?.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            No categories found.
                        </div>
                    ) : (
                        /*
                         * Render each category.
                         */
                        categories?.map((category) => (
                            <div
                                key={category.id}
                                className="grid grid-cols-[1fr_2fr_120px] items-center border-b border-slate-100 px-6 py-4 last:border-0"
                            >
                                <div className="font-medium text-slate-900">
                                    {category.name}
                                </div>

                                <div className="text-sm text-slate-500">
                                    {category.description || "—"}
                                </div>

                                <div>
                                    <span
                                        className={
                                            category.isActive
                                                ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                                : "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500"
                                        }
                                    >
                                        {category.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/*
             * Create Category dialog.
             *
             * The dialog is conditionally rendered only when
             * `isCreateOpen` is true.
             */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

                        {/*
                         * Dialog header.
                         */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Add Category
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Create a new product category.
                                </p>
                            </div>

                            {/*
                             * Close dialog button.
                             */}
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/*
                         * Create Category form.
                         */}
                        <form onSubmit={handleCreate}>

                            <div className="space-y-5 px-6 py-6">

                                {/*
                                 * Category name.
                                 */}
                                <div>
                                    <label
                                        htmlFor="category-name"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Name
                                    </label>

                                    <input
                                        id="category-name"
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="e.g. Electronics"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                        autoFocus
                                    />
                                </div>

                                {/*
                                 * Category description.
                                 */}
                                <div>
                                    <label
                                        htmlFor="category-description"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="category-description"
                                        value={description}
                                        onChange={(event) =>
                                            setDescription(event.target.value)
                                        }
                                        placeholder="Describe this category..."
                                        rows={4}
                                        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />
                                </div>

                                {/*
                                 * Display the API error if category creation fails.
                                 */}
                                {createMutation.isError && (
                                    <p className="text-sm text-red-600">
                                        {createMutation.error instanceof Error
                                            ? createMutation.error.message
                                            : "Failed to create category."}
                                    </p>
                                )}
                            </div>

                            {/*
                             * Dialog footer.
                             */}
                            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                                {/*
                                 * Cancel button.
                                 */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsCreateOpen(false)
                                    }
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                {/*
                                 * Submit button.
                                 */}
                                <button
                                    type="submit"
                                    disabled={
                                        !name.trim() ||
                                        createMutation.isPending
                                    }
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {createMutation.isPending
                                        ? "Creating..."
                                        : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}