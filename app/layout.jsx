"use client";

import "react-quill/dist/quill.snow.css";
import "nprogress/nprogress.css";
import "simplebar-react/dist/simplebar.min.css";
import nProgress from "nprogress";
import Router from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../src/createEmotionCache";
import { appWithTranslation } from "next-i18next";
import { SessionProvider } from "next-auth/react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor } from "../src/redux/store";
import { SnackbarProvider } from "notistack";
import MuiTheme from "../src/theme/MuiTheme";
import RTL from "../src/components/RTL";
import { AppProvider } from "../src/contexts/AppContext";
import SettingsProvider from "../src/contexts/SettingContext";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import SEO from "../src/components/SEO";
import CustomLoadingUI from "../src/components/CustomLoading";
import { useEffect, useState } from "react";
import store from "../src/redux/store";
import { getCookie } from "cookies-next";
import { loginSuccess } from "../src/redux/reducers/user.reducer";
import {
  setCountryCode,
  setCurrencies,
  setCurrency,
} from "../src/redux/reducers/shop.reducer";
import { getCurrencyData } from "../src//redux/action";
import { api } from "../src/utils/axiosInstance";
import ShopLayout1 from "../src/components/layouts/ShopLayout1";
import Ordersale from "./ordersale/page.jsx"

// Create Emotion cache
const clientSideEmotionCache = createEmotionCache();

function App({ children }) {
  // const { seo, countryCode, currencies } = app
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getInitialValues = async () => {
      const userId = getCookie("user-id");
      const user = getCookie("user");
      const isGuest = getCookie("is-guest");
      const data = {
        userId: userId ?? null,
        isGuest: isGuest ? isGuest : true,
        user: user ? JSON.parse(user) : null,
      };
      store.dispatch(loginSuccess(data));

      const { app } = await getInitialData();

      if (app) {
        setInitialData(app);
        store.dispatch(setCountryCode(app?.countryCode));
        store.dispatch(setCurrencies(app?.currencies));
        if (app?.currencies?.length > 0) {
          store.dispatch(setCurrency(app?.currencies[0]));
        }
      }
    };  

    getInitialValues();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SnackbarProvider maxSnack={3}>
          <SessionProvider session={null}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <CacheProvider value={clientSideEmotionCache}>
                <Ordersale />
                  <SEO
                    title="App Title"
                    description="App Description"
                    image="/path-to-image"
                  />
                  <SettingsProvider>
                    <AppProvider>
                      <MuiTheme>
                        {loading && <CustomLoadingUI />}
                        <ShopLayout1 >
                        <RTL>{children}</RTL>
                        </ShopLayout1>
                        <TawkMessengerReact
                          propertyId={initialData?.tawkTo?.propertyId || ""}
                          widgetId={initialData?.tawkTo?.widgetId || ""}
                        />
                      </MuiTheme>
                    </AppProvider>
                  </SettingsProvider>
                </CacheProvider>
              </PersistGate>
            </Provider>
          </SessionProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}

async function getInitialData(context) {
  // const { ctx } = context;
  // const pathname = ctx.pathname;
  const countryCode = "in";
  // let seoData = {};
  let appData = {};
  let currencies = [];

  try {
    currencies = await getCurrencyData(countryCode);
  } catch (error) {
    console.error("Failed to fetch currency data:", error);
  }

  try {
    const { data } = await api.get("app/");
    appData = data?.app || {};
  } catch (error) {
    console.error("Failed to fetch app data:", error);
  }

  // try {
  //   const { data } = await api.post("app/meta", {
  //     slug: pathname,
  //   });
  //   console.log("seoaapdata", data);
  //   seoData = data?.seo || {};
  //   // console.log("seo", seoData);
  // } catch (error) {
  //   console.error("Failed to fetch SEO data:", error);
  // }

  return {
    app: {
      ...appData,
      // seo: seoData,
      countryCode,
      currencies,
    },
  };
}
export default App;