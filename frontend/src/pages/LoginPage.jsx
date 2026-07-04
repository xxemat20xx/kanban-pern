import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";

import useAuthStore from "../store/authStore";

const LoginPage = () => {
    const navigate = useNavigate();

    const { login, isLoading } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(email, password);

        if (result.success) {
            navigate("/dashboard");
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
            {/* Left Side */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-16 text-white">
                <div className="max-w-xl">
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-xl">
                        <LayoutDashboard size={42} />
                    </div>

                    <h1 className="text-6xl font-black leading-tight">
                        Kanban
                        <br />
                        PERN
                    </h1>

                    <p className="mt-8 text-xl text-blue-100 leading-relaxed">
                        Organize your projects, collaborate with your team,
                        and manage every task from one beautiful dashboard.
                    </p>

                    <div className="mt-10 flex gap-8">
                        <div>
                            <h2 className="text-3xl font-bold">Projects</h2>
                            <p className="text-blue-200">Manage easily</p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold">Tasks</h2>
                            <p className="text-blue-200">Drag & Drop</p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold">Teams</h2>
                            <p className="text-blue-200">Collaborate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md rounded-3xl bg-white/90 p-10 shadow-2xl backdrop-blur-xl">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg lg:hidden">
                            <LayoutDashboard size={30} />
                        </div>

                        <h2 className="text-4xl font-bold text-gray-800">
                            Welcome Back
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Sign in to continue to your dashboard.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:bg-white"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-4 top-3.5 text-gray-400"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
                        >
                            {isLoading ? (
                                "Signing In..."
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:text-indigo-600"
                        >
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;