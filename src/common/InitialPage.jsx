import React from 'react'

import { useRouter,Router } from "next/router";
import { setCountryCode, setCurrencies, setCurrency } from '../redux/reducers/shop.reducer';
import { getCookie } from 'cookies-next';
import "nprogress/nprogress.css";
import nProgress from 'nprogress';
import store from '../redux/store';
import { useDispatch } from 'react-redux';


Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());
nProgress.configure({
    showSpinner: false,
  });

const InitialPage = () => {

    const dispatch = useDispatch()

        const userId = getCookie("user-id");
        const user = getCookie("user");
        const isGuest = getCookie("is-guest");
        const data = {
          userId: userId ?? null,
          isGuest: isGuest ? isGuest : true,
          user: user ? JSON.parse(user) : null,
        };
        store.dispatch(loginSuccess(data));
    
        // save country code
        store.dispatch(setCountryCode(props?.countryCode));
        store.dispatch(setCurrencies(props?.app?.currencies));
        if (props?.currencies?.length > 0) {
          store.dispatch(setCurrency(props?.currencies[0]));
        }
    
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);
    
        Router.events.on("routeChangeStart", handleStart);
        Router.events.on("routeChangeComplete", handleComplete);
        Router.events.on("routeChangeError", handleComplete);
    
        return () => {
          Router.events.off("routeChangeStart", handleStart);
          Router.events.off("routeChangeComplete", handleComplete);
          Router.events.off("routeChangeError", handleComplete);
        };
}

export default InitialPage