import { Route, Routes } from "react-router-dom";
import "./locales/i18n";
import { lazy } from "react";
import { Suspense } from "react";
import Topbar from "./main/Topbar";
import { Toaster } from "react-hot-toast";
import LoginPage from "./auth/LoginPage";
import useUserStore from "./auth/useUserStore";
import { Navigate } from "react-router-dom";
import Footer from "./main/Footer";
import NotFoundPage from "./main/NotFoundPage";

const HomePage = lazy(() => import("./main/HomePage"));
const ProfilePage = lazy(() => import("./auth/ProfilePage"));
const NovelsPage = lazy(() => import("./novels/NovelsPage"));
const ChapterPage = lazy(() => import("./chapters/ChapterPage"));
const EditorPage = lazy(() => import("./editor/EditorPage"));
const SignUpPage = lazy(() => import("./auth/SignUpPage"));
const UpdatePasswordPage = lazy(() => import("./auth/UpdatePasswordPage"));
const ForgotPasswordPage = lazy(() => import("./auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./auth/ResetPasswordPage"));
const NovelPage = lazy(() => import("./novels/NovelPage"));
const AuthorPage = lazy(() => import("./auth/AuthorPage"));

function App() {
  const { user } = useUserStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/all" element={<NovelsPage type="all" />} />
            <Route path="/ori" element={<NovelsPage type="original" />} />
            <Route path="/tran" element={<NovelsPage type="translation" />} />
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
            <Route
              path="/profile"
              element={user ? <ProfilePage /> : <Navigate to="/" replace />}
            />
            <Route path="/novel/:novelId" element={<NovelPage />} />
            <Route path="/author/:authorId" element={<AuthorPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
