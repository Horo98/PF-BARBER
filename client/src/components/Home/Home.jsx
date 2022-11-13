import React, { useContext, useEffect } from "react"
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
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
  const { userId } = useContext(CartContext)

  const dispatch = useDispatch()
  const cookies = new Cookies()
 
  const history = useHistory()

  
  
  const query = new URLSearchParams(useLocation().search);
  const tokenQuery = query.get("token");
  
  useEffect(() => {
    if (userId) {
      dispatch(getDBUser(userId))
      dispatch(getDBCart(userId))
    }
    else if (tokenQuery) {
      cookies.set("token", tokenQuery)
      history.push("/")
      window.location.reload()

    }
  }, []);



  return (
    <div className={styles.background}>
      <div className={styles.title}><h1>All The Barbers Products For You!</h1> <br /><br /><br />

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