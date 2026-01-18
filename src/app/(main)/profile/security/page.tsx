"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import {
  changePasswordSchema,
  type ChangePasswordData,
} from "@/schema/profile/change-password.schema";
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
      return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (strength <= 5)
      return { strength: 66, label: "Medium", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Password requirements
  const requirements = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /\d/.test(p) },
    {
      label: "One special character (@$!%*?&#)",
      test: (p: string) => /[@$!%*?&#]/.test(p),
    },
  ];

  const onSubmit = async (data: ChangePasswordData) => {
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer <token>`,
        },
        body: JSON.stringify({
          old_password: data.old_password,
          new_password: data.new_password,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to change password");
      }

      toast.success("Password berhasil diubah!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header */}
      <div className=" mx-auto mb-4 sm:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Change Password
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <div className=" mx-auto">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Lock className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Password Security
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Choose a strong password to protect your account
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
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  {...register("old_password")}
                  type={showOldPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors text-sm sm:text-base ${
                    errors.old_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register("new_password")}
                  type={showNewPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors text-sm sm:text-base ${
                    errors.new_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                    <span className="text-gray-600">Password strength:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.strength === 33
                          ? "text-red-600"
                          : passwordStrength.strength === 66
                          ? "text-yellow-600"
                          : "text-green-600"
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
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Password must contain:
                </p>
                {requirements.map((req, index) => {
                  const isMet = req.test(newPassword);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs sm:text-sm"
                    >
                      {isMet ? (
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400 shrink-0" />
                      )}
                      <span
                        className={isMet ? "text-green-700" : "text-gray-600"}
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
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  {...register("confirm_password")}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors text-sm sm:text-base ${
                    errors.confirm_password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                {isSubmitting ? "Changing Password..." : "Change Password"}
              </button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="p-4 sm:p-6 border-t bg-blue-50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  Security Tips
                </h4>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <li>• Use a unique password that you don't use elsewhere</li>
                  <li>• Avoid using personal information in your password</li>
                  <li>• Change your password regularly</li>
                  <li>• Never share your password with anyone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
