import Header from "./Header.jsx";
import CartOverview from "./../features/cart/CartOverview.jsx";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./Loader.jsx";

function AppLayout() {
  const navigation = useNavigation();
  //navitagion - will have navigation.state with "idle, loading,submiting"
  const isLoading = navigation.state === "loading"; // when it`ll be true - we will make loading spinner
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] ">
      {/* h-screen will give entire height of device */}
      {isLoading && <Loader />}
      <Header />
      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl  ">
          {/* if its not enough space for cartoverview - only main content will be scrolled and cartoverview will be shown */}
          <Outlet />
        </main>
      </div>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
