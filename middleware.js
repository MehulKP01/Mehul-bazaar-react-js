import { NextResponse } from "next/server";

export default async function middleware(req) {

  const url = req.nextUrl;

  const { pathname, } = new URL(url);
  const { searchParams } = new URL(url);
  // // Now you can work with the query parameters 
  const myParam = searchParams.get('myParam');
  console.log("myParam21212:",myParam);
  console.log("pathname:",pathname);
  console.log("url:",url);

  // const urlParams = new URLSearchParams(new URL(req.url.toString()));
  // console.log("urlParams:", urlParams);


  //const pathname = req.nextUrl.pathname;
    const countryCode = "in";
  
    if (pathname.startsWith("/shop")) {
      url.pathname = url.pathname.replace('/shop',`/${countryCode}/shop`);
      console.log("pathname:shop",url.pathname);
      return NextResponse.redirect(url)
      //return NextResponse.rewrite(url);
    }else if(pathname.startsWith("/product")){
      url.pathname = url.pathname.replace('/product',`/${countryCode}/product`);
      console.log("pathname:product",url.pathname);

      return NextResponse.redirect(url)
      //return NextResponse.rewrite(url);
      //return NextResponse.rewrite(new URL(url.pathname, req.url))
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