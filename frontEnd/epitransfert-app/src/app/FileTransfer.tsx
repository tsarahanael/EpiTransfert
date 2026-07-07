"use client";

import { useState, useCallback } from "react";

type UploadedFile = {
    name: string;
    size: number;
    progress: number;
};

type FileTransferProps = {
    username?: string;
};

export default function FileTransfer({ username }: FileTransferProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");
    const [sent, setSent] = useState(false);
    const [sentEmailCount, setSentEmailCount] = useState(0);

    const handleFiles = useCallback((fileList: FileList) => {
        const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
            name: f.name,
            size: f.size,
            progress: 0,
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        newFiles.forEach((file) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                setFiles((prev) =>
                    prev.map((f) => (f.name === file.name ? { ...f, progress } : f))
                );
            }, 300);
        });
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    };

    const removeFile = (name: string) => {
        setFiles((prev) => prev.filter((f) => f.name !== name));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} o`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    };

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const addEmail = () => {
        const trimmed = emailInput.trim();
        if (!trimmed) return;

        if (!isValidEmail(trimmed)) {
            setEmailError("Adresse email invalide");
            return;
        }
        if (emails.includes(trimmed)) {
            setEmailError("Cette adresse est déjà ajoutée");
            return;
        }

        setEmails((prev) => [...prev, trimmed]);
        setEmailInput("");
        setEmailError("");
    };

    const removeEmail = (email: string) => {
        setEmails((prev) => prev.filter((e) => e !== email));
    };

    const handleSend = () => {
        if (files.length === 0 || emails.length === 0) return;
        setSentEmailCount(emails.length);
        setSent(true);
    };

    const resetForm = () => {
        setFiles([]);
        setEmails([]);
        setEmailInput("");
        setEmailError("");
        setSent(false);
    };

    const allUploaded = files.length > 0 && files.every((f) => f.progress >= 100);
    const canSend = allUploaded && emails.length > 0 && !sent;

    if (sent) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-white p-6">
                <div className="max-w-md w-full text-center bg-white rounded-2xl p-10 shadow-sm border border-green-100">
                    <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Merci d&apos;avoir partagé vos fichiers !
                    </h1>

                    <p className="text-gray-600 mb-1">
                        Les fichiers ont été partagés avec {sentEmailCount} destinataire
                        {sentEmailCount > 1 ? "s" : ""}.
                    </p>
                    <p className="text-gray-500 text-sm mb-8">
                        Un lien d&apos;accès restreint a été généré.
                    </p>

                    <button
                        onClick={resetForm}
                        className="inline-block px-6 py-3 bg-[#0F4D92] text-white rounded-xl hover:bg-[#0d3f78] transition-colors font-medium"
                    >
                        Envoyer de nouveaux documents
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-12 px-4">
            {username && (
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-700 text-sm">
                        Bonjour <span className="font-semibold text-[#0F4D92]">{username}</span>
                    </p>
                </div>
            )}

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer
          ${isDragging ? "border-[#0F4D92] bg-[#0F4D92]/5" : "border-[#0F4D92]/40 bg-white"}`}
                onClick={() => document.getElementById("file-input")?.click()}
            >
                <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <p className="text-[#0F4D92] font-medium text-lg">
                    Glisse tes fichiers ici
                </p>
                <p className="text-gray-500 text-sm mt-1">ou clique pour parcourir</p>
            </div>

            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl px-4 py-3 shadow-sm flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800 truncate max-w-[60%]">
                  {file.name}
                </span>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">{formatSize(file.size)}</span>
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        aria-label="Supprimer le fichier"
                                        className="text-gray-400 hover:text-red-500 font-bold text-base leading-none transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-[#0F4D92] transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-8 bg-white rounded-xl p-5 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destinataire(s) autorisé(s)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => {
                                setEmailInput(e.target.value);
                                setEmailError("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && addEmail()}
                            placeholder="nom@exemple.com"
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F4D92]"
                        />
                        <button
                            onClick={addEmail}
                            className="bg-[#0F4D92] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0d3f78] transition-colors"
                        >
                            Ajouter
                        </button>
                    </div>
                    {emailError && (
                        <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}

                    {emails.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {emails.map((email) => (
                                <span
                                    key={email}
                                    className="bg-[#0F4D92]/10 text-[#0F4D92] text-xs px-3 py-1 rounded-full flex items-center gap-2"
                                >
                  {email}
                                    <button
                                        onClick={() => removeEmail(email)}
                                        className="text-[#0F4D92] hover:text-red-500 font-bold"
                                    >
                    ×
                  </button>
                </span>
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                        Seules ces adresses pourront accéder au(x) fichier(s).
                    </p>
                </div>
            )}

            {files.length > 0 && (
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className={`w-full mt-6 py-3 rounded-xl font-medium text-white transition-colors
            ${canSend ? "bg-[#0F4D92] hover:bg-[#0d3f78] cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
                >
                    Envoyer
                </button>
            )}
        </div>
    );
}