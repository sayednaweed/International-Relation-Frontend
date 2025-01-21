import { Outlet } from "react-router";
import MainHeader from "./main-header";

export default function MainPage() {
  return (
    <section>
      <MainHeader />
      <Outlet />
    </section>
  );
}
