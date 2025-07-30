import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/Books/cartPage";
import CheckoutPage from "../pages/Books/CheckoutPage";
import OrdersPage from "../pages/Books/order";
import BooksPage from "../pages/Books/BooksPage";
import OwnerDashboard from "../pages/DashBoard"
const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    children:[
       {
        path: '/',
        element: <Home/>
       },
       {
        path: '/orders',
        element: <OrdersPage/>
       },
       {
        path: '/about',
        element: <div>about</div>
       },
       {
        path: '/login',
        element: <Login/>
       },
       {
        path: '/register',
        element: <Register/>
       },
       {
        path: "/cart",
        element: <CartPage/>
      },
      {
        path: "/checkout",
        element: <CheckoutPage/>
      },{
        path:"/allBooks",
        element: <BooksPage/>
      },
      {
        path:"/dashboard",
        element:<OwnerDashboard/>
      }
    ]
  },
]);

export default router;
