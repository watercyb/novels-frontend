import { Route, Routes } from "react-router-dom";
import "./locales/i18n";
import { lazy } from "react";
import { Suspense } from "react";
import Topbar from "./main/Topbar";

const HomePage = lazy(() => import("./main/HomePage"));
const UserPage = lazy(() => import("./auth/UserPage"));
const NovelPage = lazy(() => import("./novels/NovelPage"));
const ChapterPage = lazy(() => import("./chapters/ChapterPage"));
const EditorPage = lazy(() => import("./editor/EditorPage"));

function App() {
  console.log("Re-rendered: App");

  return (
    <>
      <Topbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<UserPage />} />
          <Route path="/all" element={<NovelPage />} />
          <Route path="/ori" element={<NovelPage />} />
          <Route path="/tran" element={<NovelPage />} />
          <Route path="/chapter" element={<ChapterPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
