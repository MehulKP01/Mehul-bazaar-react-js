import { NextResponse } from "next/server";

export default async function middleware(req) {

  const url = req.nextUrl;

  const { pathname, } = new URL(url);

    const countryCode = "in";
  
    if (pathname.startsWith("/shop")) {
      url.pathname = url.pathname.replace('/shop',`/${countryCode}/shop`);
      return NextResponse.redirect(url)
    }else if(pathname.startsWith("/product")){
      url.pathname = url.pathname.replace('/product',`/${countryCode}/product`);
      return NextResponse.redirect(url)
    }


    const newReq = new Request(url, {
      headers: req.headers,
      body: req.body,
    });
    return NextResponse.next(newReq);
}
// Configure middleware to match relevant paths
export const config = {
  matcher: ["/","/shop/:path*", "/product/:path*", "/home/:path*"],
};