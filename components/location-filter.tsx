"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Qs from "query-string";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useLocation, { type District, type Province } from "@/hooks/useLocation";

export default function LocationFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchAllProvinces, fetchDistrictsByProvinceId } = useLocation();

  const [state, setState] = useState(searchParams.get("state") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    fetchAllProvinces().then(setProvinces);
  }, [fetchAllProvinces]);

  useEffect(() => {
    if (state) {
      fetchDistrictsByProvinceId(state).then(setDistricts);
    }
  }, [state, fetchDistrictsByProvinceId]);

  function handleStateChange(value: string) {
    setState(value);
    setCity("");
    if (!value) setDistricts([]);
  }

  function handleCityChange(value: string) {
    setCity(value);
  }

  const prevUrlRef = useRef("");

  useEffect(() => {
    if (!state && !city) {
      if (prevUrlRef.current !== "/") {
        prevUrlRef.current = "/";
        router.push("/");
      }
      return;
    }

    const currentQuery: Record<string, string> = {};
    if (state) currentQuery.state = state;
    if (city) currentQuery.city = city;

    const url = Qs.stringifyUrl(
      { query: currentQuery, url: "/" },
      { skipEmptyString: true, skipNull: true },
    );

    if (prevUrlRef.current !== url) {
      prevUrlRef.current = url;
      router.push(url);
    }
  }, [state, city, router]);

  function handleClear() {
    router.push("/");
    setState("");
    setCity("");
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm">
        <Select onValueChange={handleStateChange} value={state}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tỉnh / Thành phố" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((p) => (
              <SelectItem key={p.idProvince} value={p.idProvince}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {districts.length > 0 && (
          <Select onValueChange={handleCityChange} value={city}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Quận / Huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.idDistrict} value={d.idDistrict}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {(state || city) && (
          <Button onClick={handleClear} variant="outline">
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
