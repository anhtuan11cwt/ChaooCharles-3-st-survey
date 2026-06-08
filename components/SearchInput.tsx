"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Qs from "query-string";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "";

  const [value, setValue] = useState(title);

  const debouncedValue = useDebouncedValue(value);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = Qs.stringifyUrl(
      {
        query: { title: debouncedValue },
        url: window.location.href,
      },
      { skipEmptyString: true, skipNull: true },
    );
    router.push(url);
  }, [debouncedValue, router]);

  if (pathname !== "/") return null;

  return (
    <div className="relative">
      <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        className="bg-primary/10 pl-10"
        onChange={onChange}
        placeholder="Tìm kiếm"
        value={value}
      />
    </div>
  );
}
