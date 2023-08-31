import { Router } from "express";
import { 
        product,
        products,
        createProduct,
        deleteProduct,
        updateProduct,
 } from "../controllers/products.controller.js";

 const router = Router ();

 router.get ('/', products);
 router.get ('/:id',product);
 router.post ('/', createProduct);
 router.put ('/:id', updateProduct);
 router.delete ('/:id', deleteProduct);

 console.log (products)
 
 
export default router;