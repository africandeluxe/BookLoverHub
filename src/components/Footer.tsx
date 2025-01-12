export default function Footer() {
  return (
    <footer className="w-full bg-greenPale text-center py-4 border-t border-greenLight">
      <p className="text-sm text-greenDark">
        © {new Date().getFullYear()} Book Lovers Hub. All rights reserved.
      </p>
      <p className="text-sm text-greenDark">
        Made with ❤️ by book enthusiasts for book enthusiasts.
      </p>
    </footer>
  );
}
