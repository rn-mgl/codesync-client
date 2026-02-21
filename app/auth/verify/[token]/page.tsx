import VerificationState from "@/src/components/features/auth/verify/VerificationState";
import Logo from "@/src/components/global/Logo";
import Link from "next/link";

const Page = async () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-primary p-4 t:p-8">
      <div
        className="w-full max-w-(--breakpoint-l-s) bg-neutral-900 h-full relative
                  rounded-2xl flex flex-col items-start justify-start p-4 z-10 border-2 border-secondary/20"
      >
        <Link href="/" className="absolute">
          <Logo type="light" isTransparent={true} />
        </Link>

        <VerificationState />
      </div>
    </div>
  );
};

export default Page;
