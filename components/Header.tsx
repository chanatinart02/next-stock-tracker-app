import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";

const Header = () => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="">
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>
        {/* Desktop navigation */}
        <nav className="hidden sm:block">
          <NavItems />
        </nav>
        {/* User dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
};
export default Header;
