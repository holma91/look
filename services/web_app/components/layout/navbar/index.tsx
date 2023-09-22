import Link from 'next/link';
import Search from './search';

export default async function Navbar() {
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6 bg-black">
      <div className="block flex-none md:hidden"></div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6 cursor-pointer hover:text-blue-600"
          >
            Klader
          </Link>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          {/* <Search /> */}
        </div>
        <Link
          href="/product"
          className="hidden justify-end md:flex md:w-1/3 cursor-pointer hover:text-blue-600"
        >
          Products
        </Link>
      </div>
    </nav>
  );
}
