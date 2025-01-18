"use client"

import { Fragment, lazy, useCallback, useState } from "react";
const Sticky = lazy(()=> import("../../components/Sticky"));
const Topbar = lazy(()=> import("../../components/Topbar"));
import { Footer1 } from "../../components/footer";
const Header = lazy(()=> import("../../components/header/Header"));
const Navbar = lazy(()=> import("../../components/navbar/Navbar"));
import { MobileNavigationBar } from "../../components/mobile-navigation";
import SearchInputWithCategory from "../../components/search-box/SearchInputWithCategory";

/**
 *  Used in:
 *  1. home, matket-2, gadget-shop,
 *     fashion-shop, fashion-shop-2, fashion-shop-3, furniture-shop, grocery3, gift-shop
 *  2. product details page
 *  3. order-confirmation page
 *  4. product-search page
 *  5. shops and shops-details page
 *  6. checkoutNavLayout and CustomerDashboadLayout component
 */

const ShopLayout1 = ({
  children,
  topbarBgColor,
  showTopbar = true,
  showNavbar = true,
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback((fixed) => setIsFixed(fixed), []);
  return (
    <Fragment>

      {/* TOPBAR */}
      {showTopbar && <Topbar bgColor={topbarBgColor} />}

      {/* HEADER */}
      <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={300}>
        <Header isFixed={isFixed} searchInput={<SearchInputWithCategory />} />
      </Sticky>

      <div className="section-after-sticky">
        {/* NAVIGATION BAR */}
        {showNavbar && <Navbar elevation={0} border={1} />}

        {/* BODY CONTENT */}
        {children}
      </div>

      {/* SMALL DEVICE BOTTOM NAVIGATION */}
      <MobileNavigationBar />

      {/* FOOTER */}
      <Footer1 />
    </Fragment>
  );
};
export default ShopLayout1;
