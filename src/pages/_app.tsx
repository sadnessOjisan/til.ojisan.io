import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="text-white bg-black min-h-screen text-lg p-8">
      <div className="max-w-screen-lg mx-auto">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
