"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle, Calendar, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import {
  UpdateProfileData,
  updateProfileSchema,
} from "@/schema/profile/update-profile.schema";
import { UserProfile } from "@/schema/profile/user.schema";
import { userResponseSchema } from "@/schema/profile/user-response.schema";
import { ApiResponse } from "@/types/common/apiResponse";
export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile");
        const json: ApiResponse<UserProfile> = await res.json();
        const parsed = userResponseSchema.parse(json);

        setUser(parsed.data);
        reset({
          name: parsed.data.name,
          email: parsed.data.email,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [reset]);

  const onSubmit = async (data: UpdateProfileData) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      toast.success("Profil berhasil diperbarui");
      setUser((prev) =>
        prev
          ? { ...prev, ...data, updated_at: new Date().toISOString() }
          : null,
      );
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui profil");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-sm sm:text-base text-muted-foreground">
          Failed to load profile
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header - Hidden on mobile, shown on larger screens */}
      <div className=" mx-auto mb-4 sm:mb-6 hidden sm:block">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Profile
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Manage your account information
        </p>
      </div>

      <div className=" mx-auto bg-white rounded-lg border shadow-sm overflow-hidden">
        {/* Profile Header Section */}
        <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold shadow-lg shrink-0">
              {user.name[0].toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
                {user.name}
              </h2>
              <p className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base text-muted-foreground mt-1 break-all">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-[250px] sm:max-w-none">
                  {user.email}
                </span>
              </p>

              {/* Badges */}
              <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                  <Shield className="h-3 w-3" />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                {user.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          {/* Section Header with Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Account Information
            </h3>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <User className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset({ name: user.name, email: user.email });
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            {isEditing ? (
              <div>
                <input
                  {...register("name")}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors text-sm sm:text-base ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base break-words">
                {user.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            {isEditing ? (
              <div>
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors text-sm sm:text-base ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base break-all">
                {user.email}
              </p>
            )}
          </div>

          {/* User ID Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <p className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 rounded-lg text-gray-500 font-mono text-xs sm:text-sm break-all">
              {user.id}
            </p>
          </div>
        </form>

        {/* Footer - Account Details */}
        <div className="p-4 sm:p-6 border-t bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
            Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Created At */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Created At
                </p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>

            {/* Updated At */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <div className="p-2 bg-green-50 rounded-lg shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Last Updated
                </p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                  {formatDate(user.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
