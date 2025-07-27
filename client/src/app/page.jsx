import Link from "next/link";
import Navbar from "./component/nav";

export const metadata = {
  title: "Vanis - Temporary & Secure File Sharing",
  description: "Share files anonymously and securely using Vanis.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-black-900 text-white duration-500 caret-transparent selection:text-black selection:bg-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Vanis</h1>
        <p className="text-center max-w-xl text-gray-300 mb-12 px-4">
          Helping you share files temporarily and securely while being
          anonymous.
        </p>

        <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8 mb-12">
          {/* Upload Box */}
          <Link href="/upload" className="flex-1">
            <div className="flex-1 flex justify-center">
              <div className="border-2 border-dotted border-gray-500 bg-black-800 p-16 rounded-2xl w-full max-w-md hover:border-white transition-all duration-200">
                {/* You can insert an icon/image here */}
                <h2 className="text-2xl font-semibold text-center">Upload</h2>
              </div>
            </div>
          </Link>

          {/* Download Box */}
          <Link href="/download" className="flex-1">
            <div className="flex-1 flex justify-center">
              <div className="border-2 border-dotted border-gray-500 bg-white p-16 rounded-2xl w-full max-w-md hover:border-black transition-all duration-200">
                {/* You can insert an icon/image here */}
                <h2 className="text-2xl font-semibold text-center text-black">
                  Download
                </h2>
              </div>
            </div>
          </Link>
        </div>

        <a href="https://github.com/lynx-fx" target="_blank">
          <button className="px-6 py-3 text-black bg-white hover:bg-gray-700 rounded-xl text-lg transition-all duration-500">
            Donate
          </button>
        </a>
      </main>
    </>
  );
}
