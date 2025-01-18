import categoriesMegaMenu from "./categoriesMegaMenu";

// MEGAMENU DATA
const megaMenus = [
  [
    {
      title: "Home",
      child: [
        {
          title: "home",
          url: "/home",
        },
      ],
    },
  ],
  [
    {
      title: "User Account",
      child: [
        {
          title: "Order List",
          url: "/orders",
        },
        {
          title: "Order Details",
          url: "/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8",
        },
        {
          title: "View Profile",
          url: "/profile",
        },
        {
          title: "Edit Profile",
          url: "/profile/e42e28ea-528f-4bc8-81fb-97f658d67d75",
        },
        {
          title: "Address List",
          url: "/address",
        },
        {
          title: "Add Address",
          url: "/address/d27d0e28-c35e-4085-af1e-f9f1b1bd9c34",
        },
        {
          title: "Wishlist",
          url: "/wishlist",
        },
      ],
    },
  ],
  [
    {
      title: "Vendor Account",
      child: [
        {
          title: "Dashboard",
          url: "/vendor/dashboard",
        },
       
      ],
    },
    {
      title: "Products",
      child: [
        {
          title: "All products",
          url: "/admin/products",
        },
        
      ],
    },
    {
      title: "Orders",
      child: [
        {
          title: "All orders",
          url: "/admin/orders",
        },
       
      ],
    },
  ],
  [
    {
      title: "Sale Page",
      child: [
        {
          title: "Sales Version 1",
          url: "/sale-page-1",
        },
      ],
    },
    {
      title: "Shop",
      child: [
        {
          title: "Search product",
          url: "/product/search/mobile phone",
        },
        
      ],
    },
  ],
];

// MAIN NAVIGATION DATA
const navbarNavigations = [
  {
    title: "HOME",
    megaMenu: false,
    megaMenuWithSub: false,
    child: [
      {
        title: "Market 1",
        url: "/home",
      },

    ],
  },
  {
    megaMenu: true,
    megaMenuWithSub: false,
    title: "SHOP",
    child: megaMenus,
  },
  {
    megaMenu: false,
    megaMenuWithSub: true,
    title: "RESRESELLER PROGRAM",
    child: categoriesMegaMenu,
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Pages",
    child: [
      {
        title: "Sale Page",
        child: [
          {
            title: "Version 1",
            url: "/sale-page-1",
          },
          
        ],
      },
      {
        title: "Vendor",
        child: [
          {
            title: "All vendors",
            url: "/shops",
          },
          
        ],
      },
      {
        title: "Shop",
        child: [
          {
            title: "Search product",
            url: "/product/search/mobile phone",
          },
          
        ],
      },
    ],
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "User Account",
    child: [
      {
        title: "Orders",
        child: [
          {
            title: "Order List",
            url: "/orders",
          },
          {
            title: "Order Details",
            url: "/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8",
          },
        ],
      },
      {
        title: "Profile",
        child: [
          {
            title: "View Profile",
            url: "/profile",
          },
          {
            title: "Edit Profile",
            url: "/profile/e42e28ea-528f-4bc8-81fb-97f658d67d75",
          },
        ],
      },
      {
        title: "Address",
        child: [
          {
            title: "Address List",
            url: "/address",
          },
          {
            title: "Add Address",
            url: "/address/d27d0e28-c35e-4085-af1e-f9f1b1bd9c34",
          },
        ],
      },
      {
        title: "Support tickets",
      },
      {
        title: "Wishlist",
        url: "/wishlist",
      },
    ],
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Vendor Account",
    child: [
      {
        title: "Dashboard",
        url: "/vendor/dashboard",
      },
      {
        title: "Products",
        child: [
          {
            title: "All products",
            url: "/admin/products",
          },
          {
            title: "Add/Edit product",
            url: "/admin/products/lord-2019",
          },
        ],
      },
      {
        title: "Orders",
        child: [
          {
            title: "All orders",
            url: "/admin/orders",
          },
          {
            title: "Order details",
            url: "/admin/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8",
          },
        ],
      },
      {
        title: "Profile",
        url: "/vendor/account-setting",
      },
    ],
  },
];
export default navbarNavigations;
