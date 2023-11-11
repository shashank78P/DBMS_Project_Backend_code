const express = require("express");
const app = express();
const fileUpload = require('express-fileupload')
const cors = require("cors")
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { urlencoded } = require("body-parser");
const axios = require("axios");
const { response } = require("express");
const e = require("express");
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(fileUpload())

// const db = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     database: "tutorial_mng_sys",
//     password: "password123"
// });
// host: "jdbc:mysql://sql2.freesqldatabase.com:3306/sql12661053",
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD
});

db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connected");
    }
})


const getAllDetails = async (req, res) => {
    try {
        const student_details = await db?.query("select * from students;",
            (err, resut) => {
                if (err) {
console.log(err);
return;
}
                else {
                    console.log(result);
                }
            })
    }
    catch (error) {
        console.log(error);
    }
}
// function call(){
//     const x = async(req,res)=>{
//         try{
//             db?.query("select * from students;",(err,result)=>{
//                 console.log(result);
//                 x=result;
//             })
//         }catch(error){
//             console.log(error)
//         }
//     } 

// }
// call()
// let baseurl = "https://quiet-springs-47127.herokuapp.com/productServer";
// let baseurl = "http://localhost:3000/";
app.get("/", (req, res) => {
    console.log("query");
    res.send("Server started");
})


app.post("/post", (req, res) => {
    console.log("post", req.body);
    res.send("done")
})

app.get("/get", (req, res) => {
    const body = req.body;
    console.log(body);
    body.name = "product 2"
    res.json(body)
})


app.post("/login", (req, res) => {
    try {
        const role = req.body.role;
        const user_name = req.body.user_name;
        const password = req.body.password;

        db?.query(
            "select name,password from " + role + " where name = ? and password=?", [user_name, password], (err, result) => {
                if (err) {
console.log(err);
return;
}
                if (result.length > 0) {
                    res.send({ message: "true" });
                }
                else {
                    res.send({ message: "false" })
                }
                console.log(result);
            })
    } catch (error) {
        console.log(error)
    }
})

app.get("/api/parent/", (req, res) => {
    try {

        db?.query("select * from parents;", (err, result) => {
            if (err) {
console.log(err);
return;
}
            console.log(result);
            res.send({ name: result });
        })
    } catch (error) {
        console.log(error)
    }
})

app.get("/api/student/", (req, res) => {
    try {

        db?.query("select * from students;", (err, result) => {
            if (err) {
console.log(err);
return;
}
            // console.log(result);
            res.send({ name: result });
        })
    } catch (error) {
        console.log(error)
    }
})
app.get("/api/teacher", (req, res) => {
    try {

        db?.query("select * from teachers;", (err, result) => {
            if (err) {
console.log(err);
return;
}
            // console.log(result);
            res.send({ name: result });
        })
    } catch (error) {
        console.log(error)
    }
})
app.get("/api/admin", (req, res) => {
    try {

        db?.query("select * from admin;", (err, result) => {
            if (err) {
console.log(err);
return;
}
            // console.log(result);
            res.send({ name: result });
        })
    } catch (error) {
        console.log(error)
    }
})

app.get("/api/fee", (req, res) => {
    try {
        console.log("called")
        let d= new Date()
        let date = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()
        db?.query('SELECT f.fid, f.sid, s.name, f.batch, f.total_fee, f.fee_balance, f.deadline FROM fee f, students s WHERE f.fee_balance <> 0 AND s.sid = f.sid;', (err, result) => {
            if (err) {
console.log(err);
return;
}
            console.log(result);
            res.send(result);
        })
    } catch (error) {
        console.log(error)
    }
})

app.post("/deleted", (req, res) => {
    try {

        console.log(req.body);
        if (req.body.table === "teacher") {
            db?.query("delete from teachers where tid=?", req.body.id, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send("Deleted Sucessfull")
                    console.log(result)
                }
            });

        }
        if (req.body.table === "student") {
            db?.query("delete from students where sid=?", req.body.id, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send("Record Not Deleted!!!");
                }
                else {
                    res.send("Deleted Sucessfull")
                    console.log(result)
                }
            });

        }
        if (req.body.table === "admin") {
            db?.query("delete from admin where aid=?", req.body.id, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send("Record Not Deleted!!!");
                }
                else {
                    res.send("Deleted Sucessfull")
                    console.log(result)
                }
            });

        }
    } catch (error) {
        console.log(error)
    }

})

app.post("/edit", (req, res) => {
    try {

        let id_var;
        console.log("edit is called", req.body)
        const table = (req.body.table);
        console.log(table)
        if (table == "teacher") {
            id_var = 'tid';
        }
        if (table == "admin") {
            id_var = 'aid';
        }
        if (table == "student") {
            id_var = 'sid';
        }

        const id = req.body.id;
        const name = req.body.name;
        const lname = req.body.lname;
        const DOB = req.body.DOB;
        const address = req.body.address;
        const phone = parseInt(req.body.phone);
        const email = req.body.email;
        console.log(req.body, table, id);
        if (table === 'admin') {
            db?.query("update admin set name = ? , address = ? , email = ? ,phone = ?, DOB = ? , lname = ? where aid=?",
                [name, address, email, phone, DOB, lname, id], (error, result) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log(result);
                    }
                })
        }
        if (table == 'teacher') {
            console.log("teacher is called", table)
            db?.query("update teachers set name = ? , address = ? , email = ? ,phone = ?, DOB = ? , lname = ? where tid=?",
                [name, address, email, phone, DOB, lname, id], (error, result) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log(result.message);
                    }
                })
        }
        else {
            db?.query(`update students set name = ? , address = ? , email = ? ,phone = ?, DOB = ? , lname = ? where sid=?`,
                [name, address, email, phone, DOB, lname, id], (error, result) => {
                    console.log("student is called", table)
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log(result.message);
                    }
                })

        }
    }
    catch (error) {
        console.log(error)
    }
})
app.post("/fee/edit", (req, res) => {
    try {

        let id_var;
        console.log("edit is called", req.body)
        const table = (req.body.table);

        // const id = req.body.id;
        // const date = req.body.id;
        // console.log(req.body, table, id);
        //     console.log("teacher is called", table)
        //     db?.query("update teachers set name = ? , address = ? , email = ? ,phone = ?, DOB = ? , lname = ? where tid=?",
        //         [name, address, email, phone, DOB, lname, id], (error, result) => {
        //             if (error) {
        //                 console.log(error)
        //             }
        //             else {
        //                 console.log(result.message);
        //             }
        //         })
    }
    catch (error) {
        console.log(error)
    }
})

app.post("/update", (req, res) => {
    try {

        console.log("dfhdfkudhefuieh", req.body);
        if (res) {
            if (req.body.table == "student") {
                db?.query("UPDATE students SET name=?, lname=?,DOB=?,address=? , phone = ?,email=? WHERE (sid = ?)",
                    [req.body.updating_data.name, req.body.updating_data.lname, req.body.updating_data.DOB, req.body.updating_data.address,
                    req.body.updating_data.phone, req.body.updating_data.email, req.body.id],
                    (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(result)
                        }
                    })
            }
            if (req.body.table == "teacher") {
                db?.query("UPDATE teachers SET name=?, lname=?,DOB=?,address=? , phone = ?,email=? WHERE (tid = ?)",
                    [req.body.updating_data.name, req.body.updating_data.lname, req.body.updating_data.DOB, req.body.updating_data.address,
                    req.body.updating_data.phone, req.body.updating_data.email, req.body.id],
                    (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(result)
                        }
                    })
            }
            if (req.body.table == "admin") {
                db?.query("UPDATE admin SET name=?, lname=?,DOB=?,address=? , phone = ?,email=? WHERE (aid = ?)",
                    [req.body.updating_data.name, req.body.updating_data.lname, req.body.updating_data.DOB, req.body.updating_data.address,
                    req.body.updating_data.phone, req.body.updating_data.email, req.body.id],
                    (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(result)
                        }
                    })
            }
            res.send("Updated sucessfully")
            console.log(req.body)
        }
        else {
            res.send("Not Updated")
        }
    }
    catch (error) {
        console.log(error)
    }
})

app.post("/getById", (req, res) => {
    try {

        console.log("first or entered");
        if (req.body.table == "student") {
            db?.query("select * from students where sid=?", [req.body.id], (error, result) => {
                if (error) {
                    console.log(error)
                    res.send(error)
                };
                if (result) {
                    console.log("resulSt from mysql ", result)
                    res.send(result)
                }

            })
        }
        if (req.body.table == "teacher") {
            db?.query("select * from teachers where tid=?", [req.body.id], (error, result) => {
                if (error) {
                    console.log(error)
                    res.send(error)
                };
                if (result) {
                    console.log("resulSt from mysql ", result)
                    res.send(result)
                }

            })
        }
        if (req.body.table == "admin") {
            db?.query("select * from admin where aid=?", [req.body.id], (error, result) => {
                if (error) {
                    console.log(error)
                    res.send(error)
                };
                if (result) {
                    console.log("resulSt from mysql ", result)
                    res.send(result)
                }

            })
        }
        // res.send(result)
        console.log("sdfhfi");
    }
    catch (error) {
        console.log(error)
    }

})


app.post("/insert", (req, res) => {
    try {
        console.log(req.body.table)
        if (req) {
            let x;
            console.log(req.body.role.role)
            if (req.body.role.role === "parent") {
                console.log(req.body.formData.sid);
                db?.query("INSERT INTO parents (PID,FATHER_NAME, MOTHER_NAME, FATHER_PHONE, MOTHER_PHONE, PARENT_EMAIL, STUD_ID) VALUES (?,?,?,?,?,?,?);",
                    [req.body.formData.pid, req.body.formData.fatherName, req.body.formData.motherName, req.body.formData.fatherPhone, req.body.formData.MotherPhone, req.body.formData.parentEmail, req.body.formData.sid]
                    , (error, result) => {
                        if (error) {
                            console.log(error);
                            res.send({ msg: error.sqlMessage, status: false });
                        }
                        else {
                            console.log("result", result);
                            res.send({ msg: "Sucessfully Submited !!!!", status: true });
                        }
                    }
                )
            }
            if (req.body.role.role === "other") {
                console.log(req.body.formData.sid);
                db?.query("INSERT INTO fee (fid, parent_income, batch, total_fee, fee_paid, fee_balance, deadline, sid, par_id) VALUES (?,?,?,?,?,?,?,?,?);",
                    [req.body.formData.fid, req.body.formData.parentIncome, req.body.formData.batch, req.body.formData.totalFee, req.body.formData.PaidFee, (req.body.formData.totalFee - req.body.formData.PaidFee), req.body.formData.deadline_pay, req.body.formData.sid, req.body.formData.pid]
                    , (error, result) => {
                        if (error) {
                            console.log(error);
                            res.send({ msg: error.sqlMessage, status: false });
                        }
                        else {
                            console.log("result", result);
                            res.send({ msg: "Sucessfully Submited !!!!", status: true });
                        }
                    }

                )
            }
            if (req.body.role.role === "student") {
                db?.query("INSERT INTO students (sid,name,lname,DOB,address,email,phone,password) VALUES (?,?, ?, ?, ?, ?, ?, ?);",
                    [req.body.formData.sid, req.body.formData.name, req.body.formData.lname, req.body.formData.DOB, req.body.formData.address, req.body.formData.email, req.body.formData.phone, req.body.formData.password],
                    (error, result) => {
                        if (error) {
                            console.log(error);
                            res.send({ msg: error.sqlMessage, status: false });
                        }
                        else {
                            console.log(result);
                            res.send({ msg: "Sucessfully Submited !!!!", status: true })
                        }
                    })
            }
        }
        else {
            console.log(res);
        }
    }
    catch (error) {
        console.log(error)
    }
})

app.post("/adds/teacheroradmin", (req, res) => {
    try {

        console.log(req.body.details.id, req.body.table);
        if (req.body.table == "teacher") {
            // console.lo);
            db?.query('INSERT INTO teachers (tid,name,password,address,email,phone,DOB,lname,aid) VALUES (?,?,?,?,?,?,?,?,?);',
                [req.body.details.id, req.body.details.name, req.body.details.password, req.body.details.address, req.body.details.email, req.body.details.phone, req.body.details.DOB, req.body.details.lname, 1],
                (error, result) => {
                    if (result) {
                        console.log(result);
                        res.send({ msg: "Sucessfully inserted !!!!", status: true });
                    }
                    else {
                        console.log(error)
                        console.log()
                        res.send({ msg: error.sqlMessage, status: false });
                    }
                })

        }
        if (req.body.table == "admin") {
            db?.query('INSERT INTO admin (aid , name , lname , email, phone , DOB , address , password) VALUES (?,?,?,?,?,?,?,?);',
                [req.body.details.id, req.body.details.name, req.body.details.lname, req.body.details.email, req.body.details.phone, req.body.details.DOB, req.body.details.address, req.body.details.password],
                (error, result) => {
                    if (result) {
                        console.log(result);
                        res.send({ msg: "Sucessfully inserted !!!!", status: true });
                    }
                    else {
                        console.log(error.sqlMessage)
                        res.send({ msg: error.sqlMessage, status: false });
                    }
                })

        }
    }
    catch (error) {
        console.log(error)
    }
})

app.post("/update/fee", (req, res) => {
    try {
        console.log("requested", req.body);
        db?.query("UPDATE fee SET fee_balance = ?, deadline = ?,fee_paid = ? WHERE (fid = ?);",
            [req.body.fee_to_pay, req.body.deadline, req.body.paid, req.body.id]
            , (error, result) => {
                if (result) {
                    res.send({ status: true, msg: "Sucessfully Updated" });
                    console.log(result);
                }
                else {
                    res.send({ status: false, msg: error.sqlMessage });
                    console.log(error);
                }
            })
    }
    catch (err) {

    }
})

app.post("/Students_details", (req, res) => {
    try {
        if (req) {
            console.log(req.body)
            db?.query("SELECT * FROM fee as f, students s,parents p where s.sid=? and f.sid=s.sid and s.sid=p.stud_id;", [req.body.id], (error, result) => {
                if (result) {
                    console.log(result);
                    res.send(result)
                }
                else {
                    console.log(error)
                }
            })
        }
        else {
            console.log(err)
        }
    }
    catch (err) {

    }
})


app.post("/add_class", (req, res) => {
    try {
        if (req) {
            console.log(req.body)
            db?.query('INSERT INTO class (cdate, ctime, room_no, tid, cEndTime,subject,description) VALUES (?,?,?,?,?,?,?);',
                [req.body.date, req.body.start_time, req.body.room_no, req.body.id, req.body.end_time, req.body.subject, req.body.description],
                (error, result) => {
                    if (error) {
                        console.log(error)
                        res.send({ msg: "not sucessfull" });
                    }
                    else {
                        console.log(result);
                        res.send({ msg: "sucessfull" });
                    }
                })
        }
    } catch (error) {
        console.log(error)
    }
})

app.post("/get_message", (req, res) => {
    if (req) {
        console.log(req.body.id);
        db?.query("SELECT cdate,ctime,cdate,room_no,cEndTime,subject,description FROM teachers as t , class as c where c.tid=? and t.tid=? and t.password = ? order by cdate asc;",
            [req.body.id, req.body.id, req.body.password],
            (error, result) => {
                if (error) {
                    console.log(error)
                    res.send("No Message")
                }
                else {
                    console.log(result)
                    res.send(result);
                }
            })
    }
})


app.listen(3001, () => {
    console.log("listening to 3001 server");
})
