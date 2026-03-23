import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header"; // 기존 헤더
import PageHeader from "./PageHeader"; // 새 헤더

export default function MainLayout() {
  const location = useLocation();

  // 기존 헤더를 사용할 경로
  const oldHeaderPaths = ["/login", "/join", "/sign"];

  const useOldHeader = oldHeaderPaths.includes(location.pathname);

  return (
    <>
      {useOldHeader ? <Header /> : <PageHeader />}
      <Outlet />
      <Footer />
    </>
  );
}