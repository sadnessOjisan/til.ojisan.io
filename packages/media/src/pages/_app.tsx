import "tailwindcss/tailwind.css";
import "../style/markdown-body.scss";

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen text-lg p-8 text-gray-300 bg-gray-800 flex flex-col">
      <div className="max-w-screen-lg mx-auto">
        <Component {...pageProps} />
      </div>
      <footer className="mb-0 mt-auto text-center">
        <a
          href="https://twitter.com/sadnessOjisan"
          target="blank"
          rel="noreferrer noopener"
          className="text-blue-600"
        >
          @sadnessOjisan
        </a>
      </footer>
    </div>
  );
}

export default MyApp;
