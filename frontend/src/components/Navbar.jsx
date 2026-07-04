import { LayoutDashboard, LogOut } from "lucide-react";

const Navbar = ({ onLogout }) => {
    return (
        <header className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-xl shadow-sm z-999">
            <div className="mx-auto flex h-20 max-w-[1800px] items-center justify-between px-8">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                        <LayoutDashboard size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                            Kanban PERN
                        </h1>

                        <p className="text-sm text-gray-500">
                            Project Management Dashboard
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg active:scale-95"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;