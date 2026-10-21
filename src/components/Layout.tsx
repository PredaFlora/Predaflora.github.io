import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteImagesProvider } from "../contexts/SiteImagesContext";
import { HomeBlocksProvider } from "../contexts/HomeBlocksContext";
import Header from "./Header";
import Footer from "./Footer";
import EditModeBar from "./EditModeBar";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  return (
    <SiteImagesProvider>
      <HomeBlocksProvider>
      <div className="flex min-h-screen flex-col bg-night text-bone">
        <ScrollManager />
        <div className="sticky top-0 z-40">
          <Header />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <EditModeBar />
      </div>
      </HomeBlocksProvider>
    </SiteImagesProvider>
  );
}
