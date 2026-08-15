
import ConfirmDialog from "../../components/common/ConfirmDialog";


/**
 * CategoriesPage.tsx
 *
 * Purpose:
 * This React component provides the user interface for managing
 * product categories in the Mayaar application.
 *
 * Supported operations:
 *
 * 1. Retrieve all categories.
 * 2. Display categories in a table.
 * 3. Open the Create Category dialog.
 * 4. Validate category input.
 * 5. Create a new category.
 * 6. Open the Edit Category dialog.
 * 7. Update an existing category.
 * 8. Delete an existing category.
 * 9. Refresh the category list after a successful modification.
 * 10. Display toast notifications for successful operations.
 * 11. Display toast notifications when API operations fail.
 *
 * Architecture:
 *
 * CategoriesPage
 *      |
 *      +--------------------+
 *      |                    |
 *      v                    v
 * TanStack Query       Toast Context
 *      |                    |
 *      v                    v
 * categoryService       ToastContainer
 *      |
 *      v
 * Axios / apiClient
 *      |
 *      v
 * Mayaar.Api
 *      |
 *      v
 * Mayaar.Application
 *      |
 *      v
 * Mayaar.Infrastructure
 *      |
 *      v
 * PostgreSQL
 *
 * Technologies used:
 *
 * - React
 * - TypeScript
 * - TanStack Query
 * - React Hook Form
 * - Zod
 * - Axios through categoryService
 * - Lucide React
 * - Tailwind CSS
 * - React Context API for toast notifications
 *
 * Important React concepts demonstrated by this component:
 *
 * - useState
 * - useForm
 * - useQuery
 * - useMutation
 * - useQueryClient
 * - useToast
 * - controlled application state
 * - conditional rendering
 * - event handling
 * - form validation
 * - component rendering
 * - server-state invalidation
 * - global notification handling
 */

import { useState } from "react";

/**
 * `useForm` is provided by React Hook Form.
 *
 * It manages:
 *
 * - Form values
 * - Form registration
 * - Form submission
 * - Validation state
 * - Validation errors
 *
 * Using React Hook Form prevents us from having to create
 * a separate `useState` variable for every form field.
 */
import { useForm } from "react-hook-form";

/**
 * Zod provides runtime validation for our form data.
 *
 * TypeScript provides compile-time type checking, while Zod
 * validates the actual values entered by the user at runtime.
 */
import { z } from "zod";

/**
 * `zodResolver` connects Zod with React Hook Form.
 *
 * This allows React Hook Form to execute our Zod schema
 * whenever the form is submitted.
 */
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * TanStack Query provides server-state management.
 *
 * `useQuery`:
 * Used when we need to retrieve data.
 *
 * `useMutation`:
 * Used when we need to change server-side data.
 *
 * `useQueryClient`:
 * Gives us access to the TanStack Query cache so that we
 * can invalidate cached category data after modifications.
 */
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

/**
 * Lucide React provides SVG-based icons.
 *
 * We deliberately use icon components instead of Unicode
 * characters such as "×".
 *
 * This avoids character encoding problems and provides
 * consistent icons throughout the application.
 */
import {
    Pencil,
    Plus,
    Trash2,
    X,
} from "lucide-react";

/**
 * The category service is responsible for communicating
 * with the Mayaar API.
 *
 * The React component should not know how Axios works
 * or what URL the API uses.
 *
 * This separation gives us:
 *
 * Component
 *     ↓
 * Service
 *     ↓
 * API
 */
import { categoryService } from "../../services/categoryService";

/**
 * These TypeScript types describe the data exchanged
 * between the React application and the Mayaar API.
 *
 * `Category`
 *     Represents an existing category.
 *
 * `CreateCategoryRequest`
 *     Represents the data required to create a category.
 *
 * `UpdateCategoryRequest`
 *     Represents the data required to update a category.
 */
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from "../../types/category";

/**
 * `useToast` provides access to the global notification
 * system created for the Mayaar application.
 *
 * CategoriesPage uses it to notify the user about:
 *
 * - Successful category creation.
 * - Failed category creation.
 * - Successful category updates.
 * - Failed category updates.
 * - Successful category deletion.
 * - Failed category deletion.
 */
import { useToast } from "../../context/ToastContext";

/**
 * Defines the validation rules for the category form.
 *
 * Zod checks the actual values entered by the user.
 *
 * This is different from TypeScript.
 *
 * TypeScript:
 *     Protects us while writing code.
 *
 * Zod:
 *     Protects us when the application is actually running.
 */
const categorySchema = z.object({
    /**
     * Category name.
     *
     * `trim()` removes unnecessary whitespace.
     *
     * `min(1)` prevents an empty value.
     *
     * `max(100)` prevents excessively long names.
     */
    name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(
            100,
            "Category name cannot exceed 100 characters.",
        ),

    /**
     * Category description.
     *
     * The description is optional.
     *
     * When provided, it cannot exceed 500 characters.
     */
    description: z
        .string()
        .trim()
        .max(
            500,
            "Description cannot exceed 500 characters.",
        )
        .optional(),

    /**
     * Optional category image URL.
     *
     * If a URL is provided, Zod validates that it is
     * actually formatted as a URL.
     *
     * An empty string is also accepted because the user
     * may choose not to provide an image URL.
     */
    imageUrl: z
        .string()
        .trim()
        .url("Please enter a valid URL.")
        .optional()
        .or(z.literal("")),

    /**
     * Determines whether the category is active.
     *
     * This value is primarily used when editing a category.
     */
    isActive: z.boolean(),
});

/**
 * Creates a TypeScript type directly from the Zod schema.
 *
 * This is an important pattern:
 *
 *     Zod schema
 *          ↓
 *     TypeScript type
 *
 * Therefore, we do not have to maintain the same validation
 * structure manually in two different places.
 */
type CategoryFormValues = z.infer<typeof categorySchema>;

/**
 * Defines the two possible modes of the category dialog.
 *
 * "create":
 *     The dialog is being used to create a new category.
 *
 * "edit":
 *     The dialog is being used to modify an existing category.
 */
type CategoryDialogMode = "create" | "edit";

/**
 * Categories management page.
 *
 * This is a React functional component.
 *
 * React executes this function whenever the component needs
 * to render or re-render its user interface.
 *
 * @returns The Categories page UI.
 */
export default function CategoriesPage() {
    /**
     * Obtain the TanStack Query client.
     *
     * TanStack Query maintains a cache of server data.
     *
     * We use this client after creating, updating, or deleting
     * a category to tell TanStack Query that its cached category
     * data is no longer guaranteed to be current.
     */
    const queryClient = useQueryClient();

    /**
     * Obtain the global toast notification functions.
     *
     * These functions allow this page to display notifications
     * without having to implement notification UI itself.
     *
     * The actual visual notification is rendered by
     * ToastContainer.
     */
    const {
        showSuccess,
        showError,
    } = useToast();

    /**
     * Determines whether the Create/Edit dialog is visible.
     *
     * Initial value:
     *
     *     false
     *
     * Therefore, the dialog is initially hidden.
     */
    const [isDialogOpen, setIsDialogOpen] =
        useState(false);

    /**
     * Determines what operation the dialog represents.
     *
     * Initial mode:
     *
     *     create
     */
    const [dialogMode, setDialogMode] =
        useState<CategoryDialogMode>("create");

    /**
     * Stores the category currently being edited.
     *
     * `null` means there is currently no selected category.
     */
    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    /**
     * Stores the category currently selected for deletion.
     *
     * `null` means that no delete confirmation dialog is open.
     */
    const [categoryToDelete, setCategoryToDelete] =
        useState<Category | null>(null);

    /**
     * Retrieves categories from the Mayaar API.
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
     * Configures React Hook Form.
     */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        /**
         * Connect Zod validation to React Hook Form.
         */
        resolver: zodResolver(categorySchema),

        /**
         * Define the initial form values.
         */
        defaultValues: {
            name: "",
            description: "",
            imageUrl: "",
            isActive: true,
        },
    });

    /**
     * Defines the mutation responsible for creating categories.
     */
    const createMutation = useMutation({
        /**
         * Function executed when a new category is submitted.
         */
        mutationFn: (
            request: CreateCategoryRequest,
        ) => categoryService.create(request),

        /**
         * Executed after successful category creation.
         */
        onSuccess: async () => {
            /**
             * Mark the category query as stale.
             *
             * This causes TanStack Query to retrieve the
             * latest category collection.
             */
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            /**
             * Close the Create dialog.
             */
            closeDialog();

            /**
             * Display a success notification.
             */
            showSuccess(
                "Category created successfully.",
            );
        },

        /**
         * Executed when the create API request fails.
         */
        onError: (mutationError) => {
            /**
             * Convert the API error into a user-friendly
             * message where possible.
             */
            const message =
                mutationError instanceof Error
                    ? mutationError.message
                    : "Unable to create category.";

            /**
             * Display the error notification.
             */
            showError(message);
        },
    });

    /**
     * Defines the mutation responsible for updating categories.
     */
    const updateMutation = useMutation({
        /**
         * Executes the category update API request.
         */
        mutationFn: ({
            id,
            request,
        }: {
            id: string;
            request: UpdateCategoryRequest;
        }) => categoryService.update(id, request),

        /**
         * Executed after a successful update.
         */
        onSuccess: async () => {
            /**
             * Refresh the cached category collection.
             */
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            /**
             * Close the Edit dialog.
             */
            closeDialog();

            /**
             * Display a success notification.
             */
            showSuccess(
                "Category updated successfully.",
            );
        },

        /**
         * Executed when the update API request fails.
         */
        onError: (mutationError) => {
            /**
             * Convert the error into a readable message.
             */
            const message =
                mutationError instanceof Error
                    ? mutationError.message
                    : "Unable to update category.";

            /**
             * Display the error notification.
             */
            showError(message);
        },
    });

    /**
     * Defines the mutation responsible for deleting categories.
     */
    const deleteMutation = useMutation({
        /**
         * Calls the category service DELETE operation.
         */
        mutationFn: (id: string) =>
            categoryService.delete(id),

        /**
         * Executed after successful deletion.
         */
        onSuccess: async () => {
            /**
             * Refresh the category collection so the
             * deleted category disappears from the UI.
             */
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            /**
             * Close the confirmation dialog.
             */
            setCategoryToDelete(null);

            /**
             * Display a success notification.
             */
            showSuccess(
                "Category deleted successfully.",
            );
        },

        /**
         * Executed when the DELETE API request fails.
         */
        onError: (mutationError) => {
            /**
             * Convert the API error into a readable message.
             */
            const message =
                mutationError instanceof Error
                    ? mutationError.message
                    : "Unable to delete category.";

            /**
             * Display the error notification.
             */
            showError(message);
        },
    });

    /**
     * Opens the dialog in Create mode.
     */
    const openCreateDialog = () => {
        /**
         * Set the dialog mode to Create.
         */
        setDialogMode("create");

        /**
         * No existing category is being edited.
         */
        setSelectedCategory(null);

        /**
         * Reset the form.
         */
        reset({
            name: "",
            description: "",
            imageUrl: "",
            isActive: true,
        });

        /**
         * Display the dialog.
         */
        setIsDialogOpen(true);
    };

    /**
     * Opens the dialog in Edit mode.
     *
     * @param category
     * The category selected by the user.
     */
    const openEditDialog = (
        category: Category,
    ) => {
        /**
         * Change the dialog to Edit mode.
         */
        setDialogMode("edit");

        /**
         * Remember the category being edited.
         */
        setSelectedCategory(category);

        /**
         * Populate the form with existing values.
         */
        reset({
            name: category.name,
            description:
                category.description ?? "",
            imageUrl:
                category.imageUrl ?? "",
            isActive: category.isActive,
        });

        /**
         * Display the dialog.
         */
        setIsDialogOpen(true);
    };

    /**
     * Closes the Create/Edit dialog.
     */
    const closeDialog = () => {
        /**
         * Hide the dialog.
         */
        setIsDialogOpen(false);

        /**
         * Clear the selected category.
         */
        setSelectedCategory(null);

        /**
         * Reset the form.
         */
        reset({
            name: "",
            description: "",
            imageUrl: "",
            isActive: true,
        });
    };

    /**
     * Handles successful form validation and submission.
     *
     * @param values
     * Validated form values.
     */
    const onSubmit = (
        values: CategoryFormValues,
    ) => {
        /**
         * Handle Create mode.
         */
        if (dialogMode === "create") {
            /**
             * Send validated data to the create mutation.
             */
            createMutation.mutate({
                name: values.name,
                description:
                    values.description || null,
                imageUrl:
                    values.imageUrl || null,
            });

            /**
             * Stop execution so update logic does not run.
             */
            return;
        }

        /**
         * Defensive check.
         *
         * An edit operation requires an existing category.
         */
        if (!selectedCategory) {
            return;
        }

        /**
         * Send the updated data to the update mutation.
         */
        updateMutation.mutate({
            id: selectedCategory.id,

            request: {
                name: values.name,
                description:
                    values.description || null,
                imageUrl:
                    values.imageUrl || null,
                isActive: values.isActive,
            },
        });
    };

    /**
     * Opens the delete confirmation dialog.
     *
     * This function does not immediately delete anything.
     *
     * It stores the selected category in state and lets
     * the user confirm the destructive action.
     *
     * @param category
     * The category selected for deletion.
     */
    const handleDelete = (
        category: Category,
    ) => {
        /**
         * Store the selected category.
         */
        setCategoryToDelete(category);
    };

    /**
     * Determines whether a Create or Update operation
     * is currently running.
     */
    const isSaving =
        createMutation.isPending ||
        updateMutation.isPending;

    /**
     * Render the loading state.
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
     * Render the error state when the initial category
     * request fails.
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
     * Main page rendering.
     */
    return (
        <div className="min-h-screen bg-slate-50 p-8">

            {/* Main page container. */}
            <div className="mx-auto max-w-6xl">

                {/* Page header. */}
                <div className="mb-8 flex items-center justify-between">

                    {/* Page title and description. */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Categories
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Manage your product categories.
                        </p>
                    </div>

                    {/* Create Category button. */}
                    <button
                        type="button"
                        onClick={openCreateDialog}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
                    >
                        <Plus size={18} />

                        Add Category
                    </button>
                </div>

                {/* Category table container. */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    {/* Table header. */}
                    <div className="grid grid-cols-[1fr_2fr_120px_100px] border-b border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600">

                        <div>Name</div>

                        <div>Description</div>

                        <div>Status</div>

                        <div>Actions</div>
                    </div>

                    {/* Empty-state rendering. */}
                    {categories?.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            No categories found.
                        </div>
                    ) : (

                        /*
                         * Render every category.
                         */
                        categories?.map(
                            (category) => (
                                <div
                                    key={category.id}
                                    className="grid grid-cols-[1fr_2fr_120px_100px] items-center border-b border-slate-100 px-6 py-4 last:border-0"
                                >
                                    {/* Category name. */}
                                    <div className="font-medium text-slate-900">
                                        {category.name}
                                    </div>

                                    {/* Category description. */}
                                    <div className="text-sm text-slate-500">
                                        {category.description ||
                                            "—"}
                                    </div>

                                    {/* Category status. */}
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

                                    {/* Action buttons. */}
                                    <div className="flex items-center gap-1">

                                        {/* Edit button. */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditDialog(
                                                    category,
                                                )
                                            }
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                            title="Edit category"
                                            aria-label={`Edit ${category.name}`}
                                        >
                                            <Pencil
                                                size={17}
                                            />
                                        </button>

                                        {/* Delete button. */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    category,
                                                )
                                            }
                                            disabled={
                                                deleteMutation.isPending
                                            }
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                            title="Delete category"
                                            aria-label={`Delete ${category.name}`}
                                        >
                                            <Trash2
                                                size={17}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ),
                        )
                    )}
                </div>
            </div>

            {/* Create/Edit dialog. */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

                    {/* Dialog box. */}
                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

                        {/* Dialog header. */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {dialogMode === "create"
                                        ? "Add Category"
                                        : "Edit Category"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {dialogMode === "create"
                                        ? "Create a new product category."
                                        : "Update the selected product category."}
                                </p>
                            </div>

                            {/* Close button. */}
                            <button
                                type="button"
                                onClick={closeDialog}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Category form. */}
                        <form
                            onSubmit={handleSubmit(
                                onSubmit,
                            )}
                        >
                            <div className="space-y-5 px-6 py-6">

                                {/* Category name. */}
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
                                        {...register("name")}
                                        placeholder="e.g. Electronics"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                        autoFocus
                                    />

                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors.name
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Category description. */}
                                <div>
                                    <label
                                        htmlFor="category-description"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="category-description"
                                        {...register(
                                            "description",
                                        )}
                                        placeholder="Describe this category..."
                                        rows={4}
                                        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />

                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors
                                                    .description
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Image URL. */}
                                <div>
                                    <label
                                        htmlFor="category-image-url"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Image URL
                                    </label>

                                    <input
                                        id="category-image-url"
                                        type="text"
                                        {...register(
                                            "imageUrl",
                                        )}
                                        placeholder="https://..."
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />

                                    {errors.imageUrl && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors.imageUrl
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Active checkbox. */}
                                {dialogMode === "edit" && (
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            {...register(
                                                "isActive",
                                            )}
                                            className="h-4 w-4 rounded border-slate-300"
                                        />

                                        <span className="text-sm font-medium text-slate-700">
                                            Active
                                        </span>
                                    </label>
                                )}

                                {/*
                                 * API errors are now handled by
                                 * ToastContext.
                                 *
                                 * We intentionally do not render
                                 * duplicate inline error messages here.
                                 */}
                            </div>

                            {/* Dialog footer. */}
                            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                                {/* Cancel button. */}
                                <button
                                    type="button"
                                    onClick={closeDialog}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                {/* Submit button. */}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : dialogMode ===
                                            "create"
                                          ? "Create Category"
                                          : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/*
             * Delete confirmation dialog.
             *
             * The dialog is visible only when
             * categoryToDelete contains a category.
             */}
            <ConfirmDialog
                isOpen={
                    categoryToDelete !== null
                }
                title="Delete Category"
                message={
                    <>
                        Are you sure you want to delete{" "}
                        <strong className="font-semibold text-slate-900">
                            "{categoryToDelete?.name}"
                        </strong>
                        ?

                        <span className="mt-2 block text-sm text-slate-500">
                            This action cannot be undone.
                        </span>
                    </>
                }
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={
                    deleteMutation.isPending
                }
                onCancel={() => {
                    /**
                     * Clear the selected category.
                     *
                     * This closes the confirmation dialog.
                     */
                    setCategoryToDelete(null);
                }}
                onConfirm={() => {
                    /**
                     * Defensive check.
                     */
                    if (!categoryToDelete) {
                        return;
                    }

                    /**
                     * Execute the DELETE API operation.
                     */
                    deleteMutation.mutate(
                        categoryToDelete.id,
                    );
                }}
            />
        </div>
    );
}

