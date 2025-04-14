    const express=require("express");
    const mysql=require("mysql2");
    const app=express();
    const path=require("path");
    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"/views"));
    app.use(express.urlencoded({ extended: true }));

    const connect=mysql.createConnection({
        host:"localhost",
        user:"root",
        database:"cep_donation",
        password:"vedms1345"
    });

    connect.connect((err)=>{
        if(err){
            console.log("database connection failed...");
            return;
        }
        console.log("Connected to mysql database");
    })

    app.get("/", (req, res) => {
        res.render("home"); 
    });

    app.get("/user_login",(req,res)=>{
        res.render("user_login");
    })

    app.post("/user_signup",async(req,res)=>{
        const{username,email,password}=req.body;
        let q=`insert into ulogin(uusername,uemail,upassword) values(?,?,?)`;
        connect.query(q, [username, email, password], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error signing up");
            }
            let qu=`select * from ulogin where uemail=?`;
            connect.query(qu,[email],(err,result1)=>{
                if(err) throw err;
                if(result1.length>0) {
                    const ress=result1[0];
                    res.redirect(`/user_home/${ress.uid}`);
                }
            })
        });
    });

    app.post("/user_login",(req,res)=>{
        const {email,password}=req.body;
        const q="select * from ulogin where uemail=?";
        
        connect.query(q,[email],(err,result)=>{
            if (err) throw err;
            if (result.length > 0) {
                const ress = result[0];
                if(password == ress.upassword){
                    res.redirect(`/user_home/${ress.uid}`);
                }
                else{
                    res.render("user_login",{ message: "Invalid Username or Password..." });
                }
            } else {
                res.render("user_login",{ message: "No such User found..." });
            }
        })
    });

    app.get("/user_home/:uid",(req,res)=>{
        let {uid}=req.params;
        let q=`select * from ulogin where uid=?`;
        connect.query(q,[uid],(err,result)=>{
            if (err) throw err;
            let user=result[0];
            qu=`select * from events where uid=?`;
            connect.query(qu,[uid],(err,result1)=>{
                if (err) throw err;
                let events=result1;
                console.log(user);
                res.render(`user_home`,{user,events});
            })
            
        })
    })

    app.post("/user_home/:uid/submitform",(req,res)=>{
        let {uid}=req.params;
        let {name,events,address,event_date,discription,volunteers,phone_no,attendent}=req.body;
        let q=`insert into events(uid,uusername,event_type,address,event_date,disc,no_volunteers,phone_no,no_attendents) values (?,?,?,?,?,?,?,?,?)`;
        connect.query(q,[uid,name,events,address,event_date,discription,volunteers,phone_no,attendent],(err,result)=>{
            if (err) throw err;
            console.log("event added successfully...");
            res.redirect(`/user_home/${uid}`);
        })
    })

    app.get("/volunteer_login",(req,res)=>{
        res.render("volunteer_login");
    })

    app.post("/volunteer_signup",(req,res)=>{
        const{username,email,password}=req.body;
        let q=`insert into vlogin(vusername,vemail,vpassword) values(?,?,?)`;
        connect.query(q, [username, email, password], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error signing up");
            }
            let qu=`select * from vlogin where vemail=?`;
            connect.query(qu,[email],(err,result1)=>{
                if(err) throw err;
                if(result1.length>0) {
                    const user=result1[0];
                    res.redirect(`/volunteer_home/${user.tid}`);
                }
            })
        });
    });

    app.post("/volunteer_login",(req,res)=>{
        const {email,password}=req.body;
        const q="select * from vlogin where vemail=?";
        
        connect.query(q,[email],(err,result)=>{
            if (err) throw err;
            if (result.length > 0) {
                const ress = result[0];
                if(password == ress.vpassword){
                    res.redirect(`/volunteer_home/${ress.vid}`);
                }
                else{
                    res.render("volunteer_login",{ message: "Invalid Username or Password..." });
                }
            } else {
                res.render("volunteer_login",{ message: "No such volunteer found..." });
            }
        })
    
    });

    app.get("/volunteer_home/:vid",(req,res)=>{
        let {vid}=req.params;
        q=`select distinct event_type from events`;
        connect.query(q,(err,result)=>{
            if (err) throw err;
            qu=`select * from vlogin where vid=?`;
            connect.query(qu,[vid],(err,result1)=>{
                if (err) throw err;
                let events=result;
                let volunteer=result1[0];
                res.render("volunteer_home",{events,volunteer});
            })
        })
    })
    app.post("/volunteer_home/:vid/:event_type",(req,res)=>{
        let {vid,event_type}=req.params;

        if(event_type=="blood_donation"){
            q=`select * from events where event_type=?`;
            connect.query(q,[event_type],(err,result)=>{
                if(err) throw err;
                qu=`select * from vlogin where vid=?`;
                connect.query(qu,[vid],(err,result1)=>{
                    if (err) throw err;
                    let events=result;
                    let volunteer=result1[0];
                    res.render("blood_donation",{events,volunteer});
                })
            })
        }
        if(event_type=="tree_plantation"){
            q=`select * from events where event_type=?`;
            connect.query(q,[event_type],(err,result)=>{
                if(err) throw err;
                qu=`select * from vlogin where vid=?`;
                connect.query(qu,[vid],(err,result1)=>{
                    if (err) throw err;
                    let events=result;
                    let volunteer=result1[0];
                    res.render("tree_plantation",{events,volunteer});
                })
            })
        }
        if(event_type=="cloth_donation"){
            q=`select * from events where event_type=?`;
            connect.query(q,[event_type],(err,result)=>{
                if(err) throw err;
                qu=`select * from vlogin where vid=?`;
                connect.query(qu,[vid],(err,result1)=>{
                    if (err) throw err;
                    let events=result;
                    let volunteer=result1[0];
                    res.render("cloth_donation",{events,volunteer});
                })
            })
        }
    })
    app.listen('3200',()=>{
        console.log("server is  running on port 3200....");
    });