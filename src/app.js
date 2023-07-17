import express from 'express';
import { ProductManager } from './productManager.js';
const app = express();
const PORT = 4000;
app.set('json spaces', 2)
app.use(express.urlencoded({ extended: true }));
const manejoProductos = new ProductManager('./src/file.json');

app.get('/products', async (req, res) => {
    const { limit } = req.query;
    res.set('Content-Type', 'application/json');
    const productos = await manejoProductos.getProducts();
    if (limit > 0) {
        res.send(productos.slice(0, limit));
    } else {
        res.send(productos);
    }

    
});



app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const productoBuscado = await manejoProductos.getProductById(productId);
    if (productoBuscado !== false) {
        res.set('Content-Type', 'application/json');
        res.send(productoBuscado);
    } else {
        res.send("Lo siento, no he encontrado un producto con ese id :-(");
    }
    
})


app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`)
})