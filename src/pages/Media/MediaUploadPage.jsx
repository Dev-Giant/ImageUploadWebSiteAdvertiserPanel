import { useCallback, useEffect, useState } from "react";
import { getData, saveData, recordAudit } from "../../api/mockApi";

export default function MediaUploadPage() {
    const [uploads, setUploads] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function load() {
            const allUploads = await getData("media");
            setUploads(allUploads || []);
        }
        load();
    }, []);

    // drag-drop handler
    const onDrop = useCallback(
        async (e) => {
            e.preventDefault();
            setDragActive(false);
            const dt = e.dataTransfer;
            const fileList = dt.files;
            await handleFiles(fileList);
        },
        [uploads]
    );

    // handle file validation, compression mock, metadata
    async function handleFiles(fileList) {
        const arr = Array.from(fileList);
        setUploading(true);
        let processed = [];

        for (let i = 0; i < arr.length; i++) {
            const f = arr[i];
            const isValid = validateFile(f);
            if (!isValid) continue;

            const url = URL.createObjectURL(f);
            const sizeKB = Math.round(f.size / 1024);
            const tag = guessTagFromName(f.name);

            // simulate upload progress
            await fakeProgress(i, arr.length);

            processed.push({
                id: `m_${Date.now()}_${i}`,
                name: f.name,
                url,
                size: sizeKB,
                tag,
                status: "pending",
                createdAt: new Date().toISOString(),
                format: f.type,
                width: 0,
                height: 0,
            });
        }

        const next = [...processed, ...uploads];
        setUploads(next);
        saveData("media", next);
        recordAudit("upload_media", `${processed.length} files`);
        setUploading(false);
        setProgress(0);
    }

    function validateFile(file) {
        const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
        if (!validTypes.includes(file.type)) {
            alert(`${file.name} has invalid format.`);
            return false;
        }
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > 10) {
            alert(`${file.name} exceeds 10MB limit.`);
            return false;
        }
        return true;
    }

    function guessTagFromName(name) {
        const lower = name.toLowerCase();
        if (lower.includes("leaderboard")) return "Leaderboard";
        if (lower.includes("sidebar")) return "Sidebar";
        if (lower.includes("banner")) return "Banner";
        if (lower.includes("video")) return "Video Ad";
        return "General";
    }

    function onFileChange(e) {
        handleFiles(e.target.files);
    }

    async function fakeProgress(index, total) {
        const chunk = 100 / total;
        for (let i = 0; i <= 100; i += 10) {
            await new Promise((r) => setTimeout(r, 60));
            setProgress(Math.min(100, Math.round(((index + i / 100) * chunk) + chunk)));
        }
    }

    function approve(id) {
        const next = uploads.map((u) =>
            u.id === id ? { ...u, status: "approved" } : u
        );
        setUploads(next);
        saveData("media", next);
        recordAudit("approve_media", id);
    }

    function remove(id) {
        if (!confirm("Delete this file?")) return;
        const next = uploads.filter((u) => u.id !== id);
        setUploads(next);
        saveData("media", next);
        recordAudit("delete_media", id);
    }

    return (
        <div className="space-y-6 text-neutral-50">
            <h2 className="text-xl font-semibold">Media Uploads</h2>

            {/* Upload Area */}
            <div
                onDrop={onDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                className={`border-dashed border-2 p-8 rounded text-center bg-blue-950 transition ${dragActive ? "border-green-400 bg-green-400" : "border-sky-400"
                    }`}
            >
                <p className="mb-2">
                    Drag & drop files here or select from your device
                </p>
                <input
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="mx-auto block text-sm"
                />
                <p className="text-xs mt-2">
                    Supported: JPG, PNG, GIF, MP4 — up to 10MB each
                </p>

                {uploading && (
                    <div className="mt-4 w-full bg-gray-200 h-2 rounded">
                        <div
                            className="h-2 bg-blue-600 rounded transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-4 gap-4">
                {uploads.length > 0 ? (
                    uploads.map((u) => (
                        <div
                            key={u.id}
                            className="bg-blue-950 rounded-lg shadow p-2 relative group"
                            title={`${u.name}\nFormat: ${u.format}\nSize: ${u.size} KB`}
                        >
                            {u.format == "video" ? (
                                <video
                                    src={u.url}
                                    className="w-full h-36 object-cover rounded"
                                    controls
                                />
                            ) : (
                                <img
                                    src={u.url}
                                    alt={u.name}
                                    className="w-full h-36 object-cover rounded"
                                />
                            )}
                            <div className="mt-2 text-sm font-medium truncate mb-2">{u.name}</div>
                            <div className="text-xs mb-2">
                                Tag:{" "}
                                <span>{u.tag}</span>
                            </div>
                            <div className="text-xs mt-1">
                                Status:{" "}
                                <span className="px-1.5 py-0.5 rounded text-xs bg-sky-400">
                                    {u.status}
                                </span>
                            </div>

                            {/* Hover info */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                                <div className="bg-sky-400 border text-xs rounded shadow px-2 py-1">
                                    {u.format}, {u.size} KB
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-3">
                                {u.status !== "approved" && (
                                    <button
                                        onClick={() => approve(u.id)}
                                        className="px-2 py-1 rounded-lg bg-sky-400 text-xs"
                                    >
                                        Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => remove(u.id)}
                                    className="px-2 py-1 rounded-lg bg-sky-400 text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-4 text-gray-500 text-center py-6">
                        No media uploaded yet.
                    </div>
                )}
            </div>
        </div>
    );
}
