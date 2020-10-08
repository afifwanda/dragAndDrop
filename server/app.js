const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const port = 8181;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'./upload')
  },
  filename: (req,file,cb) => {
    cb(null,Date.now() + '-' +file.originalname)
  }
})

const upload = multer({storage})
app.use(cors());
app.use(express.urlencoded({ extended:true }))
app.use(express.json())

app.use("/file",express.static(__dirname+'/upload'))

app.post('/upload', upload.single('files'), (req, res) => {
  if (req.file)
    res.json({
      fileUrl: `file/${req.file.filename}`
    });
  else 
    res.status("409").json('no file uploaded')
});

app.get('/file')

app.listen(port,function(){
    console.log("youre listening to port " + port)
})

module.exports = app