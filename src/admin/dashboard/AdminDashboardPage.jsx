import { useEffect } from "react";
import useAdminStore from "../UseAdminStore";
import {
  Users,
  PenTool,
  Shield,
  ShieldCheck,
  BookOpen,
  Languages,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const AdminDashboardPage = () => {
  const { counts, isLoadingCounts, getCounts } = useAdminStore();
  const { t } = useTranslation();

  const accountCards = [
    {
      title: t("users"),
      value: counts.userCount,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: t("authors"),
      value: counts.authorCount,
      icon: PenTool,
      color: "text-green-500",
    },
    {
      title: t("admins"),
      value: counts.adminCount,
      icon: Shield,
      color: "text-purple-600",
    },
    {
      title: t("super_admins"),
      value: counts.superAdminCount,
      icon: ShieldCheck,
      color: "text-amber-600",
    },
  ];

  const novelCards = [
    {
      title: t("original_novels"),
      value: counts.originalCount,
      icon: BookOpen,
      color: "text-purple-500",
    },
    {
      title: t("translated_novels"),
      value: counts.translationCount,
      icon: Languages,
      color: "text-cyan-500",
    },
  ];

  const chapterCards = [
    {
      title: t("chapters"),
      value: counts.chapterCount,
      icon: FileText,
      color: "text-indigo-500",
    },
  ];

  useEffect(() => {
    if (!isLoadingCounts) getCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCounts]);

  const renderCards = (title, cards) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="card bg-base-100 shadow-md border border-base-200"
            >
              <div className="card-body flex-row items-center gap-4">
                <div className={`p-3 rounded-box bg-base-200 ${item.color}`}>
                  <Icon size={28} />
                </div>

                <div>
                  <div className="text-sm opacity-70">{item.title}</div>

                  <div className="text-3xl font-bold">
                    {item.value ? item.value : "-"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t("dashboard")}</h1>

        {renderCards(t("accounts"), accountCards)}

        {renderCards(t("novels"), novelCards)}

        {renderCards(t("chapters"), chapterCards)}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
