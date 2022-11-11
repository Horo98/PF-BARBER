import React, { useContext, useEffect } from "react"
import { Link, useLocation } from "react-router-dom";
import Carrusel from "../carrusel/carrusel";
import styles from "./Home.module.css";
import { Button } from "reactstrap";
import { CartContext } from "../Shopping/ShoppingCart";

import {
  getDBUser,
  getDBCart,
} from "../../redux/actions";
import { useSelector, useDispatch } from 'react-redux'
import HomeNavBar from "../HomeNavBar/HomeNavBar";
import Footer from "../Footer/Footer";
import Cookies from "universal-cookie";


export default function Home() {
  const cookies = new Cookies()
  const query = new URLSearchParams(useLocation().search);

  const tokenQuery = query.get("token");

  if (tokenQuery) {
    return cookies.set("token", tokenQuery)
  }


  const { userId } = useContext(CartContext)
  const dispatch = useDispatch()
  useEffect(() => {
    if (userId) {
      dispatch(getDBUser(userId))
      dispatch(getDBCart(userId))
    }
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.title}><h1>BARBER 'S APP</h1>

        <Carrusel /></div>

      <div className={styles.buttonLinks}>
        <Button color="dark"> <Link className={styles.button} to="/information"> Customer Support </Link> </Button>

        <Button color="dark"> <Link className={styles.button} to="/AboutUs"> About Us </Link> </Button>

        <Button color="dark"><Link className={styles.button} to="/shop"> Shop </Link> </Button>


      </div><br />



      <Footer />

    </div>
  );
}