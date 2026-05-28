"use client";

import { useState } from "react";
import { X, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";

interface AdminSolveModalProps {
  ideaTitle: string;
  onConfirm: (solutionText: string, imageFile?: File) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 sm:text-sm p-2.5 bg-white outline-none transition-all";
const labelClass = "block text-sm font-semibold text-gray-700";

export function AdminSolveModal({ ideaTitle, onConfirm, onCancel }: AdminSolveModalProps) {
  const [solutionText, setSolutionText] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionText.trim()) return;
    setSaving(true);
    await onConfirm(solutionText.trim(), imageFile);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => { if (e.target === e.currentTarget && !saving) onCancel(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Mark as Solved</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={saving}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5 pl-7 line-clamp-2">"{ideaTitle}"</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Solution Summary *</label>
            <textarea
              required
              rows={4}
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              className={inputClass}
              placeholder="Describe how this idea was resolved or implemented..."
            />
          </div>

          <div>
            <label className={labelClass}>Solution Image <span className="text-gray-400 font-normal">(optional)</span></label>
            <label className="mt-1 flex items-center gap-3 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-amber-400 hover:bg-amber-50 transition-all">
              <ImagePlus className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-500 truncate">
                {imageFile ? imageFile.name : "Click to upload an image"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {preview && (
              <img src={preview} alt="Preview" className="mt-3 rounded-lg w-full max-h-48 object-cover border border-gray-100" />
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !solutionText.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Confirm Solved</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
