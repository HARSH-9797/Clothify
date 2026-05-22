# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
ecommerce-app
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ about_img.png
│  │  ├─ add_icon.png
│  │  ├─ assets.js
│  │  ├─ bin_icon.png
│  │  ├─ cart_icon.png
│  │  ├─ contact_img.png
│  │  ├─ cross_icon.png
│  │  ├─ dropdown_icon.png
│  │  ├─ exchange_icon.png
│  │  ├─ hero_img.png
│  │  ├─ logo.png
│  │  ├─ menu_icon.png
│  │  ├─ order_icon.png
│  │  ├─ parcel_icon.svg
│  │  ├─ profile_icon.png
│  │  ├─ p_img1.png
│  │  ├─ p_img10.png
│  │  ├─ p_img11.png
│  │  ├─ p_img12.png
│  │  ├─ p_img13.png
│  │  ├─ p_img14.png
│  │  ├─ p_img15.png
│  │  ├─ p_img16.png
│  │  ├─ p_img17.png
│  │  ├─ p_img18.png
│  │  ├─ p_img19.png
│  │  ├─ p_img2.png
│  │  ├─ p_img20.png
│  │  ├─ p_img21.png
│  │  ├─ p_img22.png
│  │  ├─ p_img23.png
│  │  ├─ p_img24.png
│  │  ├─ p_img25.png
│  │  ├─ p_img26.png
│  │  ├─ p_img27.png
│  │  ├─ p_img28.png
│  │  ├─ p_img29.png
│  │  ├─ p_img2_1.png
│  │  ├─ p_img2_2.png
│  │  ├─ p_img2_3.png
│  │  ├─ p_img2_4.png
│  │  ├─ p_img3.png
│  │  ├─ p_img30.png
│  │  ├─ p_img31.png
│  │  ├─ p_img32.png
│  │  ├─ p_img33.png
│  │  ├─ p_img34.png
│  │  ├─ p_img35.png
│  │  ├─ p_img36.png
│  │  ├─ p_img37.png
│  │  ├─ p_img38.png
│  │  ├─ p_img39.png
│  │  ├─ p_img4.png
│  │  ├─ p_img40.png
│  │  ├─ p_img41.png
│  │  ├─ p_img42.png
│  │  ├─ p_img43.png
│  │  ├─ p_img44.png
│  │  ├─ p_img45.png
│  │  ├─ p_img46.png
│  │  ├─ p_img47.png
│  │  ├─ p_img48.png
│  │  ├─ p_img49.png
│  │  ├─ p_img5.png
│  │  ├─ p_img50.png
│  │  ├─ p_img51.png
│  │  ├─ p_img52.png
│  │  ├─ p_img6.png
│  │  ├─ p_img7.png
│  │  ├─ p_img8.png
│  │  ├─ p_img9.png
│  │  ├─ quality_icon.png
│  │  ├─ razorpay_logo.png
│  │  ├─ react.svg
│  │  ├─ search_icon.png
│  │  ├─ star_dull_icon.png
│  │  ├─ star_icon.png
│  │  ├─ stripe_logo.png
│  │  ├─ support_img.png
│  │  └─ upload_area.png
│  ├─ components
│  │  ├─ BestSeller.jsx
│  │  ├─ context
│  │  │  └─ ShopContext.jsx
│  │  ├─ Footer.jsx
│  │  ├─ Hero.jsx
│  │  ├─ LatestCollection.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ NewsletterBox.jsx
│  │  ├─ OurPolicy.jsx
│  │  ├─ ProductItem.jsx
│  │  └─ Title.jsx
│  ├─ index.css
│  ├─ main.jsx
│  └─ pages
│     ├─ About.jsx
│     ├─ Cart.jsx
│     ├─ Collection.jsx
│     ├─ Contact.jsx
│     ├─ Home.jsx
│     ├─ Login.jsx
│     ├─ Orders.jsx
│     ├─ PlaceOrder.jsx
│     └─ Product.jsx
├─ tailwind.config.js
└─ vite.config.js

```