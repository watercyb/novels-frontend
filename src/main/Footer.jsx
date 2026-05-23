const Footer = () => {
  return (
    <footer className="border-t border-base-300 ">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-70">
          <div>© 2026 Novel</div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/watercyb"
              target="_blank"
              className="hover:underline"
            >
              GitHub
            </a>

            <a
              href="mailto:blueberryjoy24@gmail.com"
              className="hover:underline"
            >
              Contact
            </a>

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="hover:underline"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
