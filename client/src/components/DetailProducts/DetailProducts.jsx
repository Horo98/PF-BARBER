import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProductsDetail, getLocalStorage, updateDBCart, getPaymentLink,} from "../../redux/actions";
import { CartContext } from "../Shopping/ShoppingCart";


// import styles from '../DetailProducts/DetailProducts.module.css';

function DetailProduct({ match }) {
  
  const { addItemToCart, subtractItemToCart, deleteItemToCart } = useContext(CartContext)
  const [update, setUpdate] = useState(true)
  const dispatch = useDispatch();
  const id = match.params.id;
  const product = useSelector((state) => state.detail)
  const cart = useSelector((state) => state.cart)
  const updateDB = useSelector((state) => state.updateDB)
  const pay = useSelector((state) => state.payMercadoPago)
  
  // useEffect(() => {
    //   dispatch(getProductsDetail(id));
    // }, [id]);
    
    
  //const filter = allProducts.filter(f => f.description)
  // console.log(filter)


  // if (!detailOfProducts) return null;
  useEffect(() => {
    if (update) {
      Swal.showLoading()
      dispatch(getProductsDetail(id))// accedo al id del detalle
      dispatch(getLocalStorage())
      setUpdate(false)
    }
  }, [update]) // muestra recien cuando el componente se monta
  // useEffect(() => {
  //   if (Object.keys(product).length) {
  //     addItemToCart(product,1)
  //   }

  // }, [product])
  useEffect(async () => {
    if(cart){
      let inCar = cart.find((e) => e.productId === Math.round(id))
      console.log("cart",inCar)
      
      if (inCar) {
        dispatch(await updateDBCart(inCar))
      }
    }
  }, [cart])
  
  useEffect(async () => {
    // console("updateDB",updateDB)
    if(updateDB){
      dispatch(await getPaymentLink(id));
      Swal.hideLoading()
    }
  }, [updateDB])



  return (
    <div>
      {/* <Link to="/">Back</Link> */}
      <button onClick={async (e) => {
        e.preventDefault()
        Swal.showLoading()



      }}>ShowAlert</button>
      {/* <Link to={`/yourCart/${id}`} onClick={()=> addToCart(id)}>Want to Buy🛒</Link> */}
      {console.log("pay", pay.init_point)}
      <a target="_blank" rel="noopener" href={pay.init_point + ""} onClick={() => {
      }}>  Mercado Pago</a>

      <hr />
      <Link to="/shop"> See more products! </Link>


      {/* Card */}
      <div>
        <h3>{product.name}</h3>
        <img src={product.image} alt={product.image} />
        <h3>Price: ${product.price}</h3>
        <h3>{product.quality}</h3>


      </div>


    </div>
  );
}
export default DetailProduct;
