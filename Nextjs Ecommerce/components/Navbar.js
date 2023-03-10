import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  AiOutlineShoppingCart,
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Navbar = ({
  Logout,
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const router = useRouter;
  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true);
    let exempted = ["/checkout", "/order", "/orders", "/myaccount", "/"];
    if (exempted.includes(router.pathname)) {
      setSidebar(false);
    }
  }, []);

  const ref = useRef();
  const toggleCart = () => {
    setSidebar(!sidebar);
    // if (ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-full");
    //   ref.current.classList.add("translate-x-0");
    // } else if (!ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-0");
    //   ref.current.classList.add("translate-x-full");
    // }
  };
  return (
    <>
      {!sidebar && (
        <span
          onMouseOver={() => {
            setDropdown(true);
          }}
          onMouseLeave={() => {
            setDropdown(false);
          }}
          className="absolute right-10 top-2 z-30 cursor-pointer">
          {dropdown && (
            <div className="absolute right-5 bg-white shadow-lg border top-4 py-4 rounded-md px-5 w-32 z-30">
              <ul>
                <Link href={"/myaccount"} legacyBehavior>
                  <a>
                    <li className="py-1 hover:text-indigo-500 text-sm font-semibold">
                      My Account
                    </li>
                  </a>
                </Link>
                <Link href={"/orders"} legacyBehavior>
                  <a>
                    <li className="py-1 hover:text-indigo-500 text-sm font-semibold">
                      Orders
                    </li>
                  </a>
                </Link>{" "}
                <li
                  onClick={Logout}
                  className="py-1 hover:text-indigo-500 text-sm font-semibold">
                  Logout
                </li>
              </ul>
            </div>
          )}
          {/* <span
            onMouseOver={() => {
              setDropdown(true);
            }}
            onMouseLeave={() => {
              setDropdown(false);
            }}> */}
          {user.value && (
            <MdAccountCircle className="text-xl md:text-2xl mx-2 " />
          )}
          {/* </span> */}
        </span>
      )}

      <div
        className={`flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 bg-white z-10 ${
          !sidebar && "overflow-hidden"
        }`}>
        <div className="logo mr-auto md:mx-5">
          <Link href={"/"} legacyBehavior>
            <a>
              <Image width={200} height={40} src="/logo.png" alt="" />
            </a>
          </Link>
        </div>
        <div className="nav">
          <ul className="flex items-center space-x-6 font-bold md:text-md">
            <Link href={"/tshirts"} legacyBehavior>
              <a>
                <li className="hover:text-indigo-600">Tshirts</li>
              </a>
            </Link>
            <Link href={"/hoodies"} legacyBehavior>
              <a>
                <li className="hover:text-indigo-600">Hoodies</li>
              </a>
            </Link>
            <Link href={"/stickers"} legacyBehavior>
              <a>
                <li className="hover:text-indigo-600">Stickers</li>
              </a>
            </Link>
            <Link href={"/mugs"} legacyBehavior>
              <a>
                <li className="hover:text-indigo-600">Mugs</li>
              </a>
            </Link>
          </ul>
        </div>

        <div className="cart items-center absolute right-0 top-2 mx-5 cursor-pointer flex">
          {!user.value && (
            <Link href={"/login"} legacyBehavior>
              <a>
                <button className="text-white bg-indigo-500 py-1 px-2 focus:outline-none hover:bg-indigo-600 rounded-md text-sm mx-2">
                  Login
                </button>
              </a>
            </Link>
          )}

          <AiOutlineShoppingCart
            onClick={toggleCart}
            className=" text-xl md:text-2xl"
          />
        </div>

        {/* sidebar */}

        <div
          ref={ref}
          className={`w-72 h-[100vh] overflow-y-scroll sideCart absolute top-0 bg-indigo-100 px-8 py-10 transform transition-all ${
            sidebar ? "right-0" : "-right-96"
          }`}>
          <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
          <span
            onClick={toggleCart}
            className="absolute top-2 right-3 cursor-pointer text-2xl text-indigo-500">
            <AiFillCloseCircle />
          </span>
          <ol className="list-decimal font-semibold">
            {Object.keys(cart).length == 0 && (
              <div className="my-4 font-semibold">Your Cart is Empty</div>
            )}
            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex my-5">
                    <div className="w-2/3 font-semibold">
                      {cart[k].name}({cart[k].size}/{cart[k].variant})
                    </div>
                    <div className="w-1/3 font-semibold flex items-center justify-center text-lg">
                      <AiFillMinusCircle
                        onClick={() => {
                          removeFromCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          );
                        }}
                        className="cursor-pointer text-indigo-500"
                      />
                      <span className="mx-2 text-sm">{cart[k].qty}</span>
                      <AiFillPlusCircle
                        onClick={() => {
                          addToCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          );
                        }}
                        className="cursor-pointer text-indigo-500"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="total font-bold my-2">SubTotal: {subTotal}</div>
          <div className="flex">
            <Link href={"/checkout"}>
              <button
                disabled={Object.keys(cart).length === 0}
                className="disabled:bg-indigo-300 flex mr-2 text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded text-sm">
                <BsFillBagCheckFill className="m-1" />
                Checkout
              </button>
            </Link>
            <button
              disabled={Object.keys(cart).length === 0}
              onClick={clearCart}
              className="disabled:bg-indigo-300 flex mr-2 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded text-sm">
              <BsFillBagCheckFill className="m-1" />
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
