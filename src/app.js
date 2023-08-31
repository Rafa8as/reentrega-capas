import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import router from './routes/router.js';
import config from "./config/enviroment.config.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import __dirname from "./utils.js";


const app = express();
const PORT = 8080;
const host = "0.0.0.0";


mongoose.set('strictQuery', false)

const mongoUrl = config.MONGO_URL;
const MONGO_PASS = config.MONGO_PASS;
const cookieSecret = config.COOKIE_SECRET;

const enviroment = async () => {
    await mongoose.connect(mongoUrl);
};
enviroment();
initializePassport();
app.use(session({
    store: MongoStore.create({ mongoUrl }),
    secret: MONGO_PASS,
    resave: false,
    saveUninitialized: true,
}))



app.use(passport.initialize());
app.use(passport.session());


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + "/public"));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(cookieSecret));
/*
app.use('/api/products', productsRouter);
//app.use ('/api/carts', cartsRouter);
app.use('/api/cookies', cookiesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/messages', messagesRouter);
app.use('/', viewsRouter);




import productsRouter from "./routes/products.router.js";
//import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import messagesRouter from "./routes/messages.router.js"
import cookiesRouter from "./routes/cookies.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import products from "./data/products.json" assert {type: "json"};




import { messageModel } from "./dao/mongo/messages.model.js";
import { productModel } from "./dao/mongo/product.model.js";

import { Server } from "socket.io";
import "dotenv/config";













*/
import { Server } from "socket.io";
import "dotenv/config";
const httpServer = app.listen(PORT, host, () => { console.log(`Server arriba en http://${host}: ${PORT}`); });

const io = new Server(httpServer);

io.on("connection", async socket => {
    console.log(`Cliente ${socket.id} conectado`);


    const products = await productModel.find().lean();
    io.emit("products", products);

    productModel.watch().on("change", async change => {
        const products = await productModel.find().lean();
        io.emit("products", products);
    });


    const messages = [];

    socket.on("user", async data => {
        await messageModel.create({
            user: data.user,
            message: data.messages,
        });
        const messagesLogs = await messageModel.find();
        io.emit("messagesLogs", messagesLogs);
    });


    socket.on("message", async data => {
        await messageModel.create({
            user: data.user,
            message: data.message,
        });

        const messagesLogs = await messageModel.find();

        io.emit("messagesLogs", messagesLogs);

    });
    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`);
    });
});

router (app);