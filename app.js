let createError = require('http-errors');
let express = require('express');
let path = require('path');
let logger = require('morgan');
let helmet = require('helmet')
let cors = require('cors');
let mysql = require('mysql');



// multer file storage config

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10 mb max
    },
    fileFilter: fileFilter
});

// mysql config

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "11223344",
    database: "store"
});

db.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("MySQL database connected");
});


// Express 
let app = express();

app.use(helmet()); // security layer
app.use(cors()); // cross-origin requests
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.get("/",(req,res)=>{
  res.send(`<h1>Ryan's Local Store</h1>`);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3333,()=>console.log("express API running on port 3333"))

