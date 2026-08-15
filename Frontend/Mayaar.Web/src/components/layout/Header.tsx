import { Bell, Search, UserCircle } from "lucide-react";

/**
 * Provides the top header of the Mayaar application.
 *
 * The header contains:
 * - Search
 * - Notifications
 * - Current user area
 *
 * The component is intentionally independent from individual
 * business modules.
 *
 * @returns The Mayaar application header.
 */
export default function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            {/* Search area */}
            <div className="flex w-full max-w-md items-center">
                <div className="relative w-full">
                    <Search
                        size={18}
                        strokeWidth={1.8}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="search"
                        placeholder="Search..."
                        aria-label="Search"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    />
                </div>
            </div>

            {/* Header actions */}
            <div className="ml-6 flex items-center gap-4">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                    <Bell
                        size={20}
                        strokeWidth={1.8}
                    />
                </button>

                <div className="flex items-center gap-2">
                    <UserCircle
                        size={32}
                        strokeWidth={1.6}
                        className="text-slate-500"
                    />

                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-medium text-slate-800">
                            Administrator
                        </p>

                        <p className="text-xs text-slate-500">
                            Admin
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}