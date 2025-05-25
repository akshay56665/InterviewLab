import { isAuthenticated } from "@/app/lib/actions/auth.actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/signin");
  return (
    <div className="root-layout">
      <nav>
        <Link href={"/"} className="flex items-center gap-2">
          <Image src="logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">InterviewLab</h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};
export default RootLayout;
