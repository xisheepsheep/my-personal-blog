"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function login(formData: FormData) {
    setMessage("");
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push("/admin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登录失败");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <h1 className="text-2xl font-semibold tracking-tight">后台登录</h1>
        <p className="mt-2 text-sm text-slate-500">请使用 `ADMIN_EMAIL` 对应的 Supabase 用户登录。</p>
        <form action={login} className="mt-6 space-y-4">
          <Input name="email" placeholder="管理员邮箱" required type="email" />
          <Input name="password" placeholder="密码" required type="password" />
          <Button className="w-full" type="submit">登录</Button>
          {message ? <p className="text-sm text-red-600">{message}</p> : null}
        </form>
      </Card>
    </div>
  );
}
