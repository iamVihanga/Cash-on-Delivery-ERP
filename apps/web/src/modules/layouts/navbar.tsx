
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {};

export function Navbar({}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <>
      {/* Sticky Navbar with Glass Effect */}
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-4 lg:px-6 bg-white/30 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
        )}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/wisby2.png" // Replace with your actual logo path
              alt="Wisby Logo"
              className="h-28 w-50 object-contain"
            />
            {/* <span
              className={cn(
                "font-black text-2xl font-heading transition-colors text-gray-900 hover:text-[#003580]"
              )}
            >
              Bloonsoo
            </span> */}
          </Link>
        </div>

        {/* Centered Navigation Links */}
        {/* <nav className="flex-1 flex justify-center items-center gap-6">
          <Link
            href="/about"
            className={cn(
              "font-medium text-sm hover:underline transition-colors text-gray-700 hover:text-[#003580]",
              pathname === "/about" && "text-[#003580] font-semibold"
            )}
          >
            About
          </Link>
          <Link
            href="/article"
            className={cn(
              "font-medium text-sm hover:underline transition-colors text-gray-700 hover:text-[#003580]",
              pathname === "/articles" && "text-[#003580] font-semibold"
            )}
          >
            Read
          </Link>
          <Link
            href="/contact"
            className={cn(
              "font-medium text-sm hover:underline transition-colors text-gray-700 hover:text-[#003580]",
              pathname === "/contact" && "text-[#003580] font-semibold"
            )}
          >
            Contact
          </Link>
          <Link
            href="/search"
            className={cn(
              "font-medium text-sm hover:underline transition-colors text-gray-700 hover:text-[#003580]",
              pathname === "/search" && "text-[#003580] font-semibold"
            )}
          >
            Explore
          </Link>
        </nav> */}

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* <Button
            asChild
            variant="ghost"
            className={cn(
              "text-gray-900 border border-gray-300 hover:bg-[#003580]/10"
            )}
          >
            <Link href="/account">List your Property</Link>
          </Button> */}
          <Button
            variant="outline"
            className={cn(
              "text-[#003580] border-[#003580]/20 hover:bg-[#003580]/10 cursor-pointer"
            )}
            onClick={() => {
              const activeOrgId = session?.session?.activeOrganizationId;
              if (activeOrgId) {
                router.push("/account");
              } else {
                router.push("/account");
              }
            }}
          >
            My Account
          </Button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind navbar */}
      <div className="h-16" />
    </>
  );
}
