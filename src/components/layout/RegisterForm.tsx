"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ToastContainer, toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { z } from "zod";
import { registerSchema, RegisterSchema } from "@/schema/auth/register.schema";


export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        if (json.error.code == "USER_UNVERIFIED") {
          toast.error("Email sudah terdaftar silahkan lakukan verifikasi");
        }
        if (json.error.code == "EMAIL_EXISTS") {
          toast.error("Email sudah terdaftar");
        }
        return;
      }

      toast.success("Registrasi berhasil! Silakan login");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat registrasi");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <ToastContainer />
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#012F61] to-[#E95B0F] rounded-full flex items-center justify-center mb-2">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#012F61]">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your information to get started
          </p>
        </div>

        {/* NAME */}
        <Field>
          <FieldLabel htmlFor="name" className="text-[#012F61] font-medium">
            Full Name
          </FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            className="focus:ring-2 focus:ring-[#E95B0F] focus:border-transparent"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </Field>

        {/* EMAIL */}
        <Field>
          <FieldLabel htmlFor="email" className="text-[#012F61] font-medium">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
            className="focus:ring-2 focus:ring-[#E95B0F] focus:border-transparent"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </Field>

        {/* PASSWORD */}
        <Field>
          <FieldLabel htmlFor="password" className="text-[#012F61] font-medium">
            Password
          </FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Minimal 6 karakter"
            {...register("password")}
            className="focus:ring-2 focus:ring-[#E95B0F] focus:border-transparent"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </Field>

        {/* CONFIRM PASSWORD */}
        <Field>
          <FieldLabel
            htmlFor="confirmPassword"
            className="text-[#012F61] font-medium"
          >
            Confirm Password
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Konfirmasi password"
            {...register("confirmPassword")}
            className="focus:ring-2 focus:ring-[#E95B0F] focus:border-transparent"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E95B0F] hover:bg-[#E95B0F]/90 text-white font-semibold py-5 rounded-lg transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#E95B0F] hover:text-[#E95B0F]/80 underline underline-offset-4 font-medium"
            >
              Login
            </a>
          </FieldDescription>
        </Field>

     
      </FieldGroup>
    </form>
  );
}
