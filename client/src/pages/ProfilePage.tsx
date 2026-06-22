import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/shared/Avatar";
import { useAuthStore } from "@/store/authStore";
import { uploadFile } from "@/services/upload";
import api from "@/api/axios";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      setPhotoUrl(url);
    } catch {
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.put(`/api/users/${user._id}`, {
        display_name: displayName,
        photo_url: photoUrl,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Profile Settings</h1>
          <button
            onClick={() => navigate("/chat")}
            className="text-sm text-blue-500 hover:underline"
          >
            Back to Chat
          </button>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <label className="group relative cursor-pointer">
            <Avatar src={photoUrl} name={displayName || "U"} size="lg" />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
          {uploading && (
            <p className="mt-2 text-xs text-gray-400">Uploading...</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !displayName.trim()}
            className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
