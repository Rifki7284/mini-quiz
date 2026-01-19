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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema, LoginSchema } from "@/schema/auth/login.schema";
import { LogIn } from "lucide-react";
import { ApiResponse } from "@/types/common/apiResponse";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include", 
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const json = await res.json();
    if (json.success != true) {
      toast.error("Login gagal, silahkan cek email dan password");
    } else {
      toast.success("Login berhasil");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
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
          <div className="w-12 h-12 bg-gradient-to-br from-[#E95B0F] to-[#012F61] rounded-full flex items-center justify-center mb-2">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#012F61]">
            Login to your account
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

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
          <div className="flex items-center">
            <FieldLabel
              htmlFor="password"
              className="text-[#012F61] font-medium"
            >
              Password
            </FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm text-[#E95B0F] hover:text-[#E95B0F]/80 underline-offset-4 hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="focus:ring-2 focus:ring-[#E95B0F] focus:border-transparent"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
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
                Loading...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-[#E95B0F] hover:text-[#E95B0F]/80 underline underline-offset-4 font-medium"
            >
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
