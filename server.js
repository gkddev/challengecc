var express=require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var session = require('express-session')
const path = require('path');
var mysql      = require('mysql');
var morgan=require('morgan');
var bcrypt=require('bcrypt');
var MySQLStore = require('express-mysql-session')(session);
var app=express()
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password :'12345',
    database : 'realchat'
   
});
 
 // Connect databse
db.connect((err) => {
    if(err){
        console.log("error for sql");
    }
    else{
    console.log('MySql Connected...');}
});

var sessionStore = new MySQLStore(
    {
        schema: {
            tableName: 'session',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires_column_name',
                data: 'data_column_name'
            }
        }
    }/* session store options */, db);
app.use(morgan('tiny'));
var values={
    PORT:process.env.PORT||4000
}
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/', express.static(__dirname))
app.use(session({ 
    
                secret: 'keyboard cat',
                name:'realchat',
                resave: false,
                store: sessionStore,
                saveUninitialized: false,
                cookie: { maxAge:1000*60*60*60*24*6,httpOnly: true }
            }));

var checkdata=(req,res,next)=>{
    console.log('inside checkdata'+JSON.stringify(req.session)+"with session is"+req.session.id);

    if(req.session)
    {
        sessionStore.get(req.session.id, (error,session)=>{
            if(error)
            {
                console.log("error in store get"+error.message);
                next()
            }
            else
            {
                if(session)
                {
                    console.log('session is '+session+'with session id is'+req.session.id)
                    res.redirect('/dashboard');
                }
                else
                {
                    console.log('no session received from store')
                    next()
                }
            }
            // console.log("Session is"+JSON.stringify(session));
        })
        // console.log('next'+req.session.id);
     

    }
    else
    {
        console.log("no sesion found");
        next()
    }
}
var checklogin=(req,res,next)=>{
    console.log('insidechecklogin'+JSON.stringify(req.session)+"with session is"+req.session.id);
    if(req.session)
    {
        sessionStore.get(req.session.id, (error,session)=>{
            if(error)
            {
                console.log("error in store get"+error.message);
                res.redirect('/login')
            }
            else
            {
                if(session)
                {
                    console.log('session is '+JSON.stringify(session)+'with session id is'+req.session.id)
                    next()
                }
                else
                {
                    console.log('no session received from store')
                    res.redirect('/login')
                }
            }
            // console.log("Session is"+JSON.stringify(session));
        })
        // console.log('next'+req.session.id);
     

    }
    else
    {
        console.log("no sesion found");
        res.redirect('/login')
    }
 
}
app.post('/find_one',(req,res)=>{
    console.log('inside new find one'+JSON.stringify(req.body))
})

app.post('/find_one_ew',(req,res)=>{
    console.log('req body inside findone'+JSON.stringify(req.body))
    console.log("email inside findone"+email);
    var sql = `SELECT email,iduser FROM realchat.user WHERE email = '${email}'`;
    var query = db.query(sql, (err, result,field) => 
    {
        // console.log("data send"+sql);
        if(err)
        {
            console.log("not success with an error"+err.message);    
            var abc=
            {
                
                "success":false,
                "Found":false
            }
            res.json(abc);
            res.end();
        }
        else
        {   if(result[0])
            {
                console.log(`found data ${JSON.stringify(result[0])}`);
                var rows=JSON.parse(JSON.stringify(result[0]));
               

                    var abc=
                    {
                       
                        "success":true,
                        "friends_list":rows
                    }
                    console.log("Success");
                  
                    
             res.json(abc).end();
               
              
            }
            else
            {
                console.log("no user");
                var abc=
                    {
                        "success":false
                    }
                    res.json(abc);

                    res.end();
            }
                 
        }
    }); 
})

app.post('/add_one',(req,res)=>{
    var sql = `SELECT email,iduser FROM realchat.user WHERE email = '${req.body.email}'`;
    var query = db.query(sql, (err, result,field) => 
    {
        // console.log("data send"+sql);
        if(err)
        {
            console.log("not success with an error"+err.message);    
            var abc=
            {
                
                "success":false,
                "Found":false
            }
            res.json(abc);
            res.end();
        }
        else
        {   if(result[0])
            {
                console.log(`found data ${JSON.stringify(result[0])}`);
                var rows=JSON.parse(JSON.stringify(result[0]));
                // ------------------------------------------------------------------------------------------------------------------------------------------------
                var sql = `SELECT iduser,email,friends FROM mysampledb.cart WHERE email = '${req.session.email}'`;
    var query = db.query(sql, (err, result,field) => 
    {
        if(err)
        {
            console.log("no userid found so unsuccess with an error"+err.message);    
            var abc=
            {
                
                "success":false
            }
           
            res.json(abc);
            res.end();
        }
        else
        {    if(result[0])
            {
                var rows=JSON.parse(JSON.stringify(result[0]));
                console.log("ajax call for product success");
         
                var productjson=JSON.parse(JSON.stringify(rows.cartjson));
               
                console.log(`rows[0] is here ${JSON.stringify(rows)} with id of product is ${JSON.stringify((rows.id))} and productjson is ${productjson} `);
                console.log("once again parsing result is"+JSON.parse(productjson));
                var parsedproductjson=JSON.parse(productjson);
                console.log(parsedproductjson.product[0]);
                
                console.log(parsedproductjson);
                console.log("path is---------------------------------"+req.path);
                // if(req.path="/changequantity"){
                //     console.log("yes inside changequantity");
                //     var count=Object.keys(parsedproductjson.product).length;
                //     console.log("count is"+count);
                //     let i=0;
                //     for( i=0;i<count;i++){
                //     //    console.log(parsedproductjson.product[i].id) ;
                //         if(parsedproductjson.product[i].id==req.body.id){
                //             console.log("id is"+req.body.id);
                //             console.log("quantity is"+req.body.quantity)
                //             parsedproductjson.product[i].quantity=req.body.quantity;
                //         }
                //     }
                // }
                // if(req.path="/addtocart")
                {

                    var count=Object.keys(parsedproductjson.product).length;
                    console.log("count is"+count);
                    let i=0,p=0;
                    for( i=0;i<count;i++){
                    //    console.log(parsedproductjson.product[i].id) ;
                        if(parsedproductjson.product[i].id==req.body.id){
                            p=1;
                            var abc=
                            {
                                
                                "success":"already"
                            }
                           
                            res.json(abc);
                            res.end();
                        }
                    }
                    if(p==0){
                              parsedproductjson.product.push({
                            "email":email
                        
                        });
                    }
                }
               
        console.log("new json data"+(rows[0]));
        var wow=JSON.stringify(parsedproductjson);
        console.log("wow is here"+wow);
        let sql = `UPDATE mysampledb.cart SET cartjson = '${wow}' WHERE userid = '${userid}'`;
        // let sql = `UPDATE mysampledb.wishlist SET wishlistjson = '${wishlistjson}' WHERE userid = '${userid}'`;
        // var query1=db.query(`INSERT INTO mysampledb.cart (cartjson) VALUES ('${JSON.stringify()}') WHERE userid=${userid}`, (err,results)=>
        // var query1=db.query('INSERT INTO mysampledb.cart SET ?',[detailsnew] , (err,result) => 
        let query1 = db.query(sql, (err, result) =>
        {
            if(err)
            {
                console.log("error"+err.message);
                let signupresponsejson=
                {
                    "success" : false,
                    "update":false
                }
                res.json(signupresponsejson);
                res.end();
            }
            else
            {  console.log("success in adding category");
                let signupresponsejson=
                {
                    "success" : true,
                    "update":true
                }
                res.json(signupresponsejson);
                res.end();
            }
        });
                
            }
            else
            {   console.log("no record found");
                // ==================================forno record found=======
                
                var details={
                
                    
                    
                    "product":
                    [
                        {
                            "id":req.body.id,
                            "quantity":req.body.quantity,
                            "productName":req.body.productName
                          
                        }

                    ]
                }
                var detailsnew=JSON.stringify(details);
                console.log("new json data"+(detailsnew));
                var query1=db.query(`INSERT INTO mysampledb.cart (userid, cartjson) VALUES ('${userid}','${detailsnew}')`, (err,results)=>
                // var query1=db.query('INSERT INTO mysampledb.cart SET ?',[detailsnew] , (err,result) => 
                {
                    if(err)
                    {
                        console.log("error"+err.message);
                        let signupresponsejson=
                        {
                            success : false
                        }
                        res.json(signupresponsejson);
                        res.end();
                    }
                    else
                    {  console.log("success in adding category");
                        let signupresponsejson=
                        {
                            success : true
                        }
                        res.json(signupresponsejson);
                        res.end();
                    }
                });
                // ======================================
            }
                
        }
    }); 
                // ------------------------------------------------------------------------------------------------------------------------------------------------
            }
            else
            {
                console.log("no user");
                var abc=
                    {
                        "success":false
                    }
                    res.json(abc);

                    res.end();
            }
                 
        }
    }); 
})
app.post('/getlist',(req,res)=>{
    email=req.session.email
    var sql = `SELECT friends FROM realchat.user WHERE email = '${email}'`;
    var query = db.query(sql, (err, result,field) => 
    {
        // console.log("data send"+sql);
        if(err)
        {
            console.log("not success with an error"+err.message);    
            var abc=
            {
                
                "success":false,
                "Found":false
            }
            res.json(abc);
            res.end();
        }
        else
        {   if(result[0])
            {
                console.log(`found data ${JSON.stringify(result[0])}`);
                var rows=JSON.parse(JSON.stringify(result[0]));
               

                    var abc=
                    {
                       
                        "success":true,
                        "friends_list":rows
                    }
                    console.log("Success");
                  
                    
             res.json(abc).end();
               
              
            }
            else
            {
                console.log("no user");
                var abc=
                    {
                        "success":false
                    }
                    res.json(abc);

                    res.end();
            }
                 
        }
    }); 
})
app.get('/',(req,res)=>{
    console.log(process.env.PORT);
    console.log(values.PORT);
    res.send("<h1>CHAT APPLICATION:></h1><br><br> <a href='/login'>login</a><br> <a href='/signup'>signup</a><br><a href='/'>home</a> ");
    res.end();
})
app.get('/login',checkdata,(req,res)=>{
    res.send("<h1>CHAT APPLICATION:></h1><br><br><h2>Login</h2><br><form method='POST' action='/login'><input type='text' name='email' placeholder='email'><input type='password' name='password' placeholder='password'><input type='submit' name='submit'></form> <a href='/login'>login</a><br> <a href='/signup'>signup</a><br>  <a href='/'>home</a> ");
    res.end();
})
app.get('/signup',checkdata,(req,res)=>{
    res.send("<h1>CHAT APPLICATION:></h1><br><br><h2>Signup</h2><br><form method='POST' action='/signup'><input type='text' name='mobile' placeholder='mobile'><input type='text' name='firstname' placeholder='firstname'><input type='text' name='lastname' placeholder='lastname'><input type='text' name='email' placeholder='email'><input type='password' name='password' placeholder='password'><input type='submit' name='submit'></form> <a href='/login'>login</a><br> <a href='/signup'>signup</a><br>  <a href='/'>home</a>  ");
    res.end();
})
app.get('/dashboard',checklogin,(req,res)=>{

    res.sendFile(path.join(__dirname, '../chat/dashboard', 'dashboard.html'));
    // res.sendFile(path.join(__dirname, '../chat/dashboard', 'dashboard.js'));
        // res.send("<h1>CHAT APPLICATION:></h1><br><p>name:</p><br><p>email</p> <form action='/logout' method='post'><input type='submit' value='logout'></form> ");
        res.end();
})
app.get('/404',(req,res)=>{
    res.status(404).send('<h1>CHAT APPLICATION:></h1><br><h2>page not found</h2>')
    res.end();
})

app.post("/login",urlencodedParser,checkdata, function (req, res) 
{
     console.log(`req came from form to login with body ${JSON.stringify(req.body)}`);
    let email=req.body.email;
    let password=req.body.password;
    var sql = `SELECT * FROM realchat.user WHERE email = '${email}'`;
    var query = db.query(sql, (err, result,field) => 
    {
        console.log("data send"+sql);
        if(err)
        {
            console.log("not success with an error"+err.message);    
            var abc=
            {
                
                "success":false,
                "Found":no
            }
            res.json(abc);
            res.end();
        }
        else
        {   if(result[0])
            {
                console.log(`found data ${JSON.stringify(result[0])}`);
                var rows=JSON.parse(JSON.stringify(result[0]));
                if(bcrypt.compareSync(password, rows.password)==true)
                {
                    req.session.email=rows.email;
                    req.session.firstname = rows.firstname;
                    // sessionStore.close(); 

                    var abc=
                    {
                       
                        "success":true
                    }
                    console.log("Success");
                  
                    
                    res.redirect('/dashboard');
               
                }
                else
                {
                    console.log("not Success");
                    var abc=
                    {
                        
                        "success":false
                    }
                    res.json(abc);
                   
                    res.end();
                }
            }
            else
            {
                console.log("no user");
                var abc=
                    {
                        "success":false
                    }
                    res.json(abc);

                    res.end();
            }
                 
        }
    });  
});

app.post('/signup',checklogin,(req,res)=>{
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
var createuser={
     firstname:req.body.firstname,
     lastname:req.body.lastname,
     email:req.body.email,
     mobile:req.body.mobile,
     password:hashedPassword
}
console.log(createuser)
var query1=db.query('INSERT INTO realchat.user SET ?',createuser , (err,result) => 
    {
        if(err)
        {
            console.log("error"+err.message);
            let signupresponsejson=
            {
                success : false
            }
            res.json(signupresponsejson);
            res.end();
            // res.send('<h1>CHAT APPLICATION:></h1><br><h2>error</h2>')
            // res.end()
        }
        else
        { 
            let signupresponsejson=
            {
                success : true
            }
            res.json(signupresponsejson);
            res.end();
            // res.send('<h1>CHAT APPLICATION:></h1><br><h2>success</h2>')
            // res.end()
        }
    });

});
app.post('/logout',checklogin,(req,res)=>{
    
    sessionStore.destroy(req.session.id, (error)=>{
        if(error)
        {
            console.log('error'+error.message)
            res.redirect('/dashoard')
        }
        else{
            res.clearCookie("realchat");
            console.log('logout');
            res.redirect('/');
        }
    })
})
app.get('*', function(req, res){
    // res.status(404).send('<h1>CHAT APPLICATION:></h1><br><h2>page not found</h2>')
    res.redirect('/404')
  })
app.listen(values.PORT,()=>{
    console.log(`visit https://localhost:${values.PORT}/ for chat application`)
    // console.log(process.env.PORT)
})