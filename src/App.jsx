import { Route, Routes } from "react-router-dom";
import "./locales/i18n";
import { lazy } from "react";
import { Suspense } from "react";
import Topbar from "./main/Topbar";
import { Toaster } from "react-hot-toast";
import LoginPage from "./auth/LoginPage";
import useUserStore from "./auth/useUserStore";
import { Navigate } from "react-router-dom";
import SignUpPage from "./auth/SignUpPage";
import UpdatePasswordPage from "./auth/UpdatePasswordPage";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import ResetPasswordPage from "./auth/ResetPasswordPage";

const HomePage = lazy(() => import("./main/HomePage"));
const UserPage = lazy(() => import("./auth/UserPage"));
const NovelPage = lazy(() => import("./novels/NovelPage"));
const ChapterPage = lazy(() => import("./chapters/ChapterPage"));
const EditorPage = lazy(() => import("./editor/EditorPage"));

function App() {
  const { user } = useUserStore();

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
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/update-password"
            element={
              user ? <UpdatePasswordPage /> : <Navigate to="/" replace />
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
