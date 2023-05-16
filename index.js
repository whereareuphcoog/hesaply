//static
const port = 8000
const dburi = 'mongodb://127.0.0.1:27017/freeshop'
//mongodb 
const mongoose = require("mongoose")
mongoose.connect(dburi).then(()=>{
    console.log('Database connection successful')
})

const Product = require("./models/product")
const Ship = require("./models/ship")
const User = require("./models/user")
const Message = require("./models/message")
//express
const express = require('express')
const app = express()
const server = require('http').createServer(app);



app.enable('trust proxy')
app.use(express.static(__dirname+'/views'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//body parser
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))


//session
const expressSession = require('express-session')
const MongoStore = require("connect-mongo")

app.use(expressSession({
    secret:'inanbilmiyom',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl:dburi})
}))
//socket io
const io = require('socket.io')(server);

io.on('connection', (socket) => {


        socket.on('chat message',async (msg) => {
//save db
          const newMessage = new Message({
            content:msg.content,
            user_id: msg.user_id,
            date: Date.now()
          })
        newMessage.save().then(upmsg=>{
Message.findById(upmsg._id).populate("user_id").then(sendmsg=>{
  io.emit('chat message', sendmsg);

})

        })
//send new message

        })



    //online offline
    var user_id = ''
    socket.on("user_id", (arg) => {
      user_id = arg
      const filter = {_id:user_id}
      const update = {online:true}

      User.findOneAndUpdate(filter,update).then(onlineuser=>{
        return
      }).catch(()=>{
        return
      })
    });

      socket.on('disconnect', function () {
      const filter = {_id:user_id}

        const update = {online:false}
        User.findOneAndUpdate(filter,update).then(offlineuser=>{
         return
        }).catch(()=>{
          return
        })

      });
    })
//fileupload
const fileUpload = require("express-fileupload")
app.use(fileUpload());


//handlebars 
const exphbs = require("express-handlebars")
const {dateformat,length, onlyletters, hour} = require("./helpers/dateformat")

app.engine("hbs", exphbs.engine({extname:'.hbs', helpers:{dateformat,length, onlyletters,hour}}))
app.set("view engine", "hbs")



app.use(async (req,res,next)=>{
    const {user_id} = req.session

    if (user_id){
        res.locals.loggedin=true
User.findById(user_id).then(myuser=>{
  if(myuser.role == "admin"){
   res.locals.isadmin = true
  }
  if(myuser.role == "mod"){
   res.locals.ismod = true
  }
})
        
    } else{
        res.locals.loggedin=false
    }
    
    res.locals.title = 'FreeShop - Hesap Satış Ofisi'
    res.locals.userdata = await User.findById(user_id).lean()
    next()
})

//flash message middleware
app.use((req,res,next)=>{
    res.locals.flashmsg = req.session.flashmsg
    delete req.session.flashmsg
    next()
})
//main
const indexRouter = require("./routes/index")
app.use(indexRouter)
const productRouter = require("./routes/product")
app.use(productRouter)
const adminRouter = require("./routes/admin")
app.use("/admin",adminRouter)
const queryRouter = require("./routes/query")
app.use("/",queryRouter)
const chatRouter = require("./routes/chat")
app.use("/chat",chatRouter)
const userRouter = require('./routes/user')
app.use('/user', userRouter)
const balanceRouter = require("./routes/balance")
app.use('/',balanceRouter)

//listen
server.listen(port, ()=>{console.log(`server is listening on port ${port}`)})