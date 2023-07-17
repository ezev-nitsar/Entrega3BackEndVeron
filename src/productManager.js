import fs from 'fs';
export class ProductManager {
    constructor(fileName) {
        //Estado inicial, Array products vacío y definición del archivo a utilizar
        this.products = [];
        this.fileName = fileName;
    }

    //Funcion de Lectura y Parseo del archivo reconvertida a ASYNC
    readFileAsync = () => {
        return new Promise((resolve, reject) => {
            fs.readFile(this.fileName, 'utf8', (err, data) => {
                if (err) {
                    throw new Error(err);
                }
                resolve(JSON.parse(data));
            })
        });
    }

    writeFileAsync = async () => {
        await fs.writeFile(this.fileName, JSON.stringify(this.products), (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }

    //Función que verifica si hay productos en el archivo y, de ser así, lo actualiza en this.products
    cargarProductos = async () => {
        let productosGuardados = [];
        productosGuardados = await this.readFileAsync();
        if (productosGuardados.length > 0) {
            this.products = productosGuardados;
        }
    }
    //Función que devuelve todos los productos
    getProducts = async () => {
        //Lectura inicial de todos los productos
        await this.cargarProductos();
        return this.products;

    }
    //Función que busca un Producto por ID
    getProductById = async (id) => {
        //Lectura inicial de todos los productos
        await this.cargarProductos();
        const productoEncontrado = this.products.find(x => x.id === parseInt(id));
        //Si no hay resultados, muestro el error en la consola
        if (!productoEncontrado) {
            console.log("No se ha encontrado el producto con el id " + id);
            return false;
        } else {
            return productoEncontrado;
        }
    }
    //Función que agrega productos
    addProduct = async (producto) => {
        //Lectura inicial de todos los productos
        this.cargarProductos();
        //Verifico que todos los campos estén seteados y que price y stock sean numéricos
        if (!producto.title || !producto.description || !producto.price || isNaN(producto.price) || !producto.thumbnail || !producto.code || !producto.stock || isNaN(producto.stock)) {
            console.log("Todos los campos son obligatorios. price y stock deben ser numéricos");
        }
        //Valido que ya no exista un producto con el mismo código
        else if (this.products.find(x => x.code === producto.code)) {
            console.log("Ya existe un producto con el código especificado");
        } else {
            // Todo OK, avanzo con la creación del objecto Product con los datos pasados por parámetros
            const title = producto.title;
            const description = producto.description;
            const price = producto.price;
            const thumbnail = producto.thumbnail;
            const code = producto.code;
            const stock = producto.stock;
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            //Determinación del ID
            if (this.products.length === 0) {
                product.id = 1;
            } else {
                //De esta forma, no se repite el ID si se borra un producto
                const nuevoId = Math.max(...this.products.map(x => x.id));
                product.id = nuevoId + 1;
            }
            //Adición del producto al array Products y grabado en el archivo
            this.products.push(product);

            try {
                await this.writeFileAsync();
            } catch (err) {
                console.log("Hubo un error: " + err);
            }


        }
    }
    updateProduct = async (id, productDetails) => {
        //Lectura inicial de todos los productos
        this.cargarProductos();
        const productoEncontrado = this.products.find(x => x.id === id);
        if (!productoEncontrado) {
            console.log("No se ha encontrado el producto con el id " + id);
            return false;
        } else {
            //Inicialmente, seteo los valores originales del producto
            let title = productoEncontrado.title;
            let description = productoEncontrado.description;
            let price = productoEncontrado.price;
            let thumbnail = productoEncontrado.thumbnail;
            let code = productoEncontrado.code;
            let stock = productoEncontrado.stock;
            //Busco en el objeto enviado, si el campo está seteado y es válido, lo actualizo
            if (productDetails.title) {
                title = productDetails.title;
            }
            if (productDetails.description) {
                description = productDetails.description;
            }
            if (productDetails.price) {
                price = productDetails.price;
            }
            if (productDetails.thumbnail) {
                thumbnail = productDetails.thumbnail;
            }
            if (productDetails.code || !isNaN(productDetails.code)) {
                code = productDetails.code;
            }
            if (productDetails.stock || !isNaN(productDetails.stock)) {
                stock = productDetails.stock;
            }
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id
            }
            //Busco el producto y lo actualizo
            const actualizar = this.products.findIndex(obj => obj.id === id);
            this.products[actualizar] = product;
            //Guardo en el archivo

            try {
                await this.writeFileAsync();
            } catch (err) {
                console.log("Hubo un error W: " + err);
            }

        }
    }

    deleteProduct = async (id) => {
        //Lectura inicial de todos los productos
        this.cargarProductos();
        const productoEncontrado = this.products.find(x => x.id === id);
        if (!productoEncontrado) {
            console.log("No se ha encontrado el producto con el id " + id);
            return false;
        } else {
            //Busco el producto y lo elimino
            const nuevosProductos = this.products.filter(x => x.id !== id);
            this.products = nuevosProductos;
            try {
                await this.writeFileAsync();
            } catch (err) {
                console.log("Hubo un error W: " + err);
            }
        }
    }

}