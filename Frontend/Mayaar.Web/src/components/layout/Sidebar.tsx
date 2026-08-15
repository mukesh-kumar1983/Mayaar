import {
    BarChart3,
    Boxes,
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Users,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { NavLink } from "react-router-dom";

/**
 * Represents a single navigation item displayed in the
 * Mayaar application sidebar.
 */
interface NavigationItem {
    /**
     * Text displayed to the user.
     */
    label: string;

    /**
     * URL associated with the navigation item.
     *
     * A null value indicates that the item is a navigation
     * group rather than a directly navigable page.
     */
    path?: string;

    /**
     * Icon displayed next to the navigation label.
     */
    icon: ComponentType<{
        size?: number;
        strokeWidth?: number;
    }>;

    /**
     * Optional child navigation items.
     */
    children?: NavigationItem[];
}

/**
 * Defines the navigation structure used by the Mayaar sidebar.
 *
 * Keeping navigation configuration separate from the JSX
 * makes the sidebar easier to extend as new Mayaar modules
 * are introduced.
 */
const navigationItems: NavigationItem[] = [
    {
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },
    {
        label: "Catalog",
        icon: Boxes,
        children: [
            {
                label: "Categories",
                path: "/categories",
                icon: Boxes,
            },
            {
                label: "Products",
                path: "/products",
                icon: Package,
            },
        ],
    },
    {
        label: "Sales",
        icon: ShoppingCart,
        children: [
            {
                label: "Customers",
                path: "/customers",
                icon: Users,
            },
            {
                label: "Orders",
                path: "/orders",
                icon: ShoppingCart,
            },
        ],
    },
    {
        label: "Reports",
        path: "/reports",
        icon: BarChart3,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: Settings,
    },
];

/**
 * Provides the primary navigation sidebar for Mayaar.
 *
 * The sidebar contains:
 * - Mayaar branding
 * - Dashboard navigation
 * - Feature/module navigation
 * - Expandable navigation groups
 * - Active route highlighting
 *
 * @returns The Mayaar navigation sidebar.
 */
export default function Sidebar() {
    /**
     * Stores the names of navigation groups that are
     * currently expanded.
     */
    const [expandedGroups, setExpandedGroups] = useState<string[]>(
        ["Catalog", "Sales"]
    );

    /**
     * Expands or collapses a navigation group.
     *
     * @param label The name of the navigation group.
     */
    const toggleGroup = (label: string) => {
        setExpandedGroups((currentGroups) =>
            currentGroups.includes(label)
                ? currentGroups.filter((group) => group !== label)
                : [...currentGroups, label]
        );
    };

    /**
     * Determines whether a navigation group is currently expanded.
     *
     * @param label The navigation group name.
     * @returns True when the group is expanded.
     */
    const isGroupExpanded = (label: string) =>
        expandedGroups.includes(label);

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
            {/* Application branding */}
            <div className="flex h-16 items-center border-b border-slate-200 px-5">
                <div>
                    <div className="text-xl font-bold tracking-tight text-slate-900">
                        Mayaar
                    </div>

                    <div className="text-xs text-slate-500">
                        Business Management
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;

                        /*
                         * Navigation groups contain child routes
                         * and therefore do not navigate directly.
                         */
                        if (item.children) {
                            const expanded = isGroupExpanded(item.label);

                            return (
                                <div key={item.label}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleGroup(item.label)
                                        }
                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon
                                                size={18}
                                                strokeWidth={1.8}
                                            />

                                            {item.label}
                                        </span>

                                        {expanded ? (
                                            <ChevronDown
                                                size={16}
                                            />
                                        ) : (
                                            <ChevronRight
                                                size={16}
                                            />
                                        )}
                                    </button>

                                    {expanded && (
                                        <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3">
                                            {item.children.map(
                                                (child) => {
                                                    const ChildIcon =
                                                        child.icon;

                                                    return (
                                                        <NavLink
                                                            key={
                                                                child.path
                                                            }
                                                            to={
                                                                child.path ??
                                                                "#"
                                                            }
                                                            className={({
                                                                isActive,
                                                            }) =>
                                                                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                                                                    isActive
                                                                        ? "bg-slate-900 font-medium text-white"
                                                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                                }`
                                                            }
                                                        >
                                                            <ChildIcon
                                                                size={16}
                                                                strokeWidth={
                                                                    1.8
                                                                }
                                                            />

                                                            {
                                                                child.label
                                                            }
                                                        </NavLink>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        /*
                         * Direct navigation items.
                         */
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path ?? "#"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-700 hover:bg-slate-100"
                                    }`
                                }
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={1.8}
                                />

                                {item.label}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Sidebar footer */}
            <div className="border-t border-slate-200 p-4">
                <p className="text-xs text-slate-400">
                    Mayaar
                </p>

                <p className="text-xs text-slate-400">
                    Business Platform
                </p>
            </div>
        </aside>
    );
}