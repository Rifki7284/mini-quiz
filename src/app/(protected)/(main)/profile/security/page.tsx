"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import {
  changePasswordSchema,
  type ChangePasswordData,
} from "@/schema/profile/change-password.schema";
import { ApiResponse } from "@/types/common/apiResponse";

export default function ResetPasswordPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const newPassword = watch("new_password", "");

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    if (strength <= 3)
      return { strength: 33, label: "Lemah", color: "bg-red-500" };
    if (strength <= 5)
      return { strength: 66, label: "Sedang", color: "bg-amber-500" };
    return { strength: 100, label: "Kuat", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const requirements = [
    { label: "Minimal 8 karakter", test: (p: string) => p.length >= 8 },
    { label: "Satu huruf kapital", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Satu huruf kecil", test: (p: string) => /[a-z]/.test(p) },
    { label: "Satu angka", test: (p: string) => /\d/.test(p) },
    {
      label: "Satu karakter spesial (@$!%*?&#)",
      test: (p: string) => /[@$!%*?&#]/.test(p),
    },
  ];

  const onSubmit = async (data: ChangePasswordData) => {
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: data.old_password,
          new_password: data.new_password,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        if (json.error?.code === "INVALID_CREDENTIALS") {
          toast.error("Password lama yang dimasukkan salah");
          return;
        }

        toast.error("Gagal mengubah password");
        return;
      }

      toast.success("Password berhasil diubah!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah password");
    }
  };

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#012F61]">
          Ubah Password
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Perbarui password Anda untuk menjaga keamanan akun
        </p>
      </div>

      <div className="mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b bg-[#012F61]/5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#E95B0F] text-white flex items-center justify-center shrink-0">
                <Lock className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#012F61]">
                  Keamanan Password
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Pilih password yang kuat untuk melindungi akun Anda
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 sm:p-6 space-y-4 sm:space-y-5"
          >
            {/* Current Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#012F61]">
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  {...register("old_password")}
                  type={showOldPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-[#E95B0F] focus:border-transparent outline-none transition-colors text-sm sm:text-base ${
                    errors.old_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E95B0F] transition-colors"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.old_password && (
                <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.old_password.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#012F61]">
                Password Baru
              </label>
              <div className="relative">
                <input
                  {...register("new_password")}
                  type={showNewPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-[#E95B0F] focus:border-transparent outline-none transition-colors text-sm sm:text-base ${
                    errors.new_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E95B0F] transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 font-medium">
                      Kekuatan password:
                    </span>
                    <span
                      className={`font-semibold ${
                        passwordStrength.strength === 33
                          ? "text-red-600"
                          : passwordStrength.strength === 66
                            ? "text-amber-600"
                            : "text-emerald-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.new_password && (
                <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.new_password.message}
                </p>
              )}

              {/* Password Requirements */}
              <div className="bg-[#012F61]/5 border border-[#012F61]/10 rounded-xl p-3 sm:p-4 space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-[#012F61] mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#E95B0F]" />
                  Password harus mengandung:
                </p>
                {requirements.map((req, index) => {
                  const isMet = req.test(newPassword);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs sm:text-sm"
                    >
                      {isMet ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400 shrink-0" />
                      )}
                      <span
                        className={`font-medium ${isMet ? "text-emerald-700" : "text-gray-600"}`}
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#012F61]">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  {...register("confirm_password")}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-[#E95B0F] focus:border-transparent outline-none transition-colors text-sm sm:text-base ${
                    errors.confirm_password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E95B0F] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 sm:pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-[#E95B0F] text-white rounded-lg hover:bg-[#E95B0F]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                {isSubmitting ? "Mengubah Password..." : "Ubah Password"}
              </button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="p-4 sm:p-6 border-t bg-[#E95B0F]/5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#E95B0F]/10 rounded-lg shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#E95B0F]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-[#012F61] mb-2">
                  Tips Keamanan
                </h4>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E95B0F] mt-0.5">•</span>
                    <span>
                      Gunakan password unik yang tidak digunakan di tempat lain
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E95B0F] mt-0.5">•</span>
                    <span>
                      Hindari menggunakan informasi pribadi dalam password
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E95B0F] mt-0.5">•</span>
                    <span>Ubah password Anda secara berkala</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E95B0F] mt-0.5">•</span>
                    <span>
                      Jangan pernah membagikan password Anda kepada siapapun
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
