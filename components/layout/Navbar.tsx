"use client";

import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import NavMenu from "@/components/layout/nav-menu";
import { ModeToggle } from "@/components/mode-toggle";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  email: string;
  name: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-fetch user on route change
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    toast.success("Đăng xuất thành công!");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-secondary/100 backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between">
          <button
            className="flex cursor-pointer items-center gap-1"
            onClick={() => router.push("/")}
            type="button"
          >
            <div className="text-xl font-bold">Stay Savvy</div>
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <Suspense>
              <SearchInput />
            </Suspense>
            <ModeToggle />
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.name || user.email}
                </span>
                <NavMenu />
                <Button onClick={handleSignOut} size="sm" variant="outline">
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/sign-in")}
                  size="sm"
                  variant="outline"
                >
                  Đăng nhập
                </Button>
                <Button onClick={() => router.push("/sign-up")} size="sm">
                  Đăng ký
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 sm:hidden">
            <ModeToggle />
            {user && <NavMenu />}
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="flex flex-col items-start gap-3 pb-4 pt-2 sm:hidden">
            <div className="w-full">
              <Suspense>
                <SearchInput />
              </Suspense>
            </div>
            {user ? (
              <div className="flex w-full items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {user.name || user.email}
                </span>
                <Button onClick={handleSignOut} size="sm" variant="outline">
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex w-full items-center gap-3">
                <Button
                  className="flex-1"
                  onClick={() => router.push("/sign-in")}
                  size="sm"
                  variant="outline"
                >
                  Đăng nhập
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => router.push("/sign-up")}
                  size="sm"
                >
                  Đăng ký
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </nav>
  );
}
