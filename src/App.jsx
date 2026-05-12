import { Route, Routes } from "react-router-dom";
import Language from "./locales/Language";
import "./locales/i18n";
import { lazy } from "react";
import { Suspense } from "react";

const HomePage = lazy(() => import("./main/HomePage"));
const UserPage = lazy(() => import("./auth/UserPage"));
const NovelPage = lazy(() => import("./novels/NovelPage"));
const ChapterPage = lazy(() => import("./chapters/ChapterPage"));
const EditorPage = lazy(() => import("./editor/EditorPage"));

function App() {
  console.log("Re-rendered: App");

  return (
    <>
      <Language />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<UserPage />} />
          <Route path="/novel" element={<NovelPage />} />
          <Route path="/chapter" element={<ChapterPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
