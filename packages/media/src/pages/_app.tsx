import "tailwindcss/tailwind.css";
import "../style/markdown-body.scss";

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen text-lg p-8 text-gray-300 bg-gray-800">
      <div className="max-w-screen-lg mx-auto">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
