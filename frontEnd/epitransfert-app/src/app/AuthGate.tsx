"use client";

import { useState } from "react";
import FileTransfer from "./FileTransfer";

const ALLOWED_EMAIL_REGEX = /^[^\s@]+@epita\.fr$/i;

const ALLOWED_EMAIL = "shreya@epita.fr";
const ALLOWED_PASSWORD = "mdp123";

function extractUsername(email: string) {
    const localPart = email.split("@")[0] ?? "";
    const firstSegment = localPart.split(/[.\-_]/)[0] ?? localPart;
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
}

export default function AuthGate() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = emailInput.trim();

        if (!trimmedEmail || !passwordInput) {
            setError("Merci de saisir un email et un mot de passe.");
            return;
        }

        if (!ALLOWED_EMAIL_REGEX.test(trimmedEmail)) {
            setError("Cette adresse n'est pas autorisée à accéder à cet espace.");
            return;
        }

        if (
            trimmedEmail.toLowerCase() !== ALLOWED_EMAIL.toLowerCase() ||
            passwordInput !== ALLOWED_PASSWORD
        ) {
            setError("Email ou mot de passe incorrect.");
            return;
        }

        setError("");
        setUsername(extractUsername(trimmedEmail));
        setIsAuthenticated(true);
    };

    if (isAuthenticated) {
        return <FileTransfer username={username} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <form
                onSubmit={handleSubmit}
                className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
                <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-[#0F4D92]/10 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-[#0F4D92]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z"
                        />
                    </svg>
                </div>

                <h1 className="text-xl font-semibold text-gray-900 mb-1 text-center">
                    Accès restreint
                </h1>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Connecte-toi avec tes identifiants pour continuer.
                </p>

                <div className="space-y-3">
                    <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                            setEmailInput(e.target.value);
                            setError("");
                        }}
                        placeholder="nom@monentreprise.fr"
                        autoFocus
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F4D92]"
                    />
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setError("");
                        }}
                        placeholder="Mot de passe"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F4D92]"
                    />
                </div>

                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                <button
                    type="submit"
                    className="w-full mt-5 py-3 rounded-xl font-medium text-white bg-[#0F4D92] hover:bg-[#0d3f78] transition-colors"
                >
                    Continuer
                </button>
            </form>
        </div>
    );
}