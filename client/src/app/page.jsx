export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 caret-transparent">
        <h1 className="text-bold text-4xl">Vanis</h1>
        <div className="flex w-full h-full justify-around">
          <div className="w-1/2 flex justify-center border-2 p-32">
            <h2>Upload</h2>
          </div>
          <div className="w-1/2 flex justify-center border-2 p-32">
            <h2>Download</h2>
          </div>
        </div>
        <div >
          <button>
            Donate
          </button>
        </div>
      </main>
    </>
  );
}
