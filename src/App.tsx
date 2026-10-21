import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteContentProvider } from "./contexts/SiteContentContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import PlantDetail from "./pages/PlantDetail";
import BrowseAll from "./pages/BrowseAll";
import TypePage from "./pages/TypePage";
import AboutPage from "./pages/AboutPage";
import CareGuides from "./pages/CareGuides";
import Reviews from "./pages/Reviews";
import Faqs from "./pages/Faqs";
import CareGuideDetail from "./pages/CareGuideDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const App = () => (
  <SiteContentProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/predatory" element={<CategoryPage key="predatory" category="predatory" />} />
          <Route path="/non-predatory" element={<CategoryPage key="non_predatory" category="non_predatory" />} />
          <Route path="/type/:type" element={<TypePage />} />
          <Route path="/browse-all" element={<BrowseAll />} />
          <Route path="/care" element={<CareGuides />} />
          <Route path="/care/:id" element={<CareGuideDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faq" element={<Faqs />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </SiteContentProvider>
);

export default App;
