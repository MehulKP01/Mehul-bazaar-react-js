"use client"

import { getAppDataLogo, getAllSubject } from "../../src/redux/action";
import { useDispatch } from "react-redux";
import { memo, useEffect } from "react";
import MarketShop from '../page';


const HomePage = () => {
    
    return (
        <MarketShop />
    );
};

export default HomePage;

