const express = require('express');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/db_users');
const User = require('./models/userModel');
const PlayList = require('./models/playlistModel');
const Token = require('./models/tokenModel');
const Guest = require('./models/guestModel');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const crypto = require("crypto");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
var ageCalculator = require('age-calculator');
let {AgeFromDateString, AgeFromDate} = require('age-calculator');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cors())

//Admin login
app.post('/api/login/admin', (req, res) => {
    //validatios
    if (!req.body.email) {
        return res.status(400).send({
            message: 'User email can not be empty'
        });
    }
    if (!req.body.password) {
        return res.status(400).send({
            message: 'User password can not be empty'
        });
    }
    User.findOne({
        email: req.body.email,
        password: md5(req.body.password)
    }, function(err, user) {
        if(err){
            return res.status(500).send({ message: err});
        }else if (user == null) {
            return res.send({token: null});
        }else if(user.verified === 'No'){
            return res.status(403).send({ message: 'Usuario no verificado'});
        }else{
        jwt.sign({
                "id": user._id,
                "role": 'admin',
                "fullname": `${user.name} ${user.surnames}`
            }, 'tubekids', {
                expiresIn: '3d'
            }, (err, token) => {
                res.json({"_token": token,"id": user._id,"fullname": `${user.name} ${user.surnames}`,"role": 'admin'
                });
            });
    }
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving users'
        });
    });
});
//Verified User
app.post('/api/login/verified/:id', (req, res) => {
 //validatios
     if (!req.params.id) {
        return res.status(400).send({
            message: 'User password can not be empty'
        });
    }
    if (!req.body.email) {
        return res.status(400).send({
            message: 'User email can not be empty'
        });
    }
    if (!req.body.password) {
        return res.status(400).send({
            message: 'User password can not be empty'
        });
    }
    User.findOne({
        email: req.body.email,
        password: md5(req.body.password),
        verified: req.params.id
    }, function(err, user) {
        if (user == null) {
            return res.send({
                token: null
            });
        }else{
           
        // Find note and update it with the request body
    User.findByIdAndUpdate(user._id, {
            verified: 'Si'
        }, {
            new: true
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `User not found with id ${req.params.id}`
                });
            }
            jwt.sign({
                "id": user._id,
                "role": 'admin',
                "fullname": `${user.name} ${user.surnames}`
            }, 'tubekids', {
                expiresIn: '3d'
            }, (err, token) => {
                res.json({
                    "_token": token,
                    "id": user._id,
                    "fullname": `${user.name} ${user.surnames}`,
                    "role": 'admin'
                });
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `User not found with id ${req.params.id}`
                });
            }
            return res.status(500).send({
                message: `Error updating user with id ${req.params.id}`
            });
        });
    }
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving users'
        });
    });
});
//Guest login
app.post('/api/login/guest', (req, res) => {
    let _guest;
    //validatios
    if (!req.body.username) {
        return res.status(400).send({
            message: 'Guest username can not be empty'
        });
    }
    if (!req.body.pin) {
        return res.status(400).send({
            message: 'Guest pin can not be empty'
        });
    }
    Guest.findOne({
        username: req.body.username,
        pin: md5(req.body.pin)
    }, function(err, guest) {
        if (guest == null) {
            return res.send({
                token: null
            });
        } else {
            jwt.sign({
                id: guest._id,
                role: 'guest'
            }, 'tubekids', {
                expiresIn: '3d'
            }, (err, token) => {
                res.json({
                    _token: token,
                    fullname: guest.fullname,
                    role: 'guest',
                    tokentru: 'true'
                });
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving users'
        });
    });
});
//Get the users of the db
app.get('/api/users', verifyToken, (req, res) => {
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if(authData.role !== 'admin'){res.sendStatus(403);}
            User.find().then(users => {
                res.send(users);
            }).catch(err => {
                res.status(500).send({
                message: err.message || 'Some error occurred while retrieving users'
            });
        });
        }
    });
});
//saves the user in the db
app.post('/api/users', (req, res) => {
    //validatios
    if (!req.body.name) {
        res.status(400).send({
            message: 'User name can not be empty'
        });
    }
    if (!req.body.surnames) {
        res.status(400).send({
            message: 'User surnames can not be empty'
        });
    }
    if (!req.body.country) {
        res.status(400).send({
            message: 'User country can not be empty'
        });
    }
    if (!req.body.birthDate) {
        res.status(400).send({
            message: 'User birthDate can not be empty'
        });
    }
    if (!req.body.email) {
        res.status(400).send({
            message: "User email can not be empty"
        });
    }
    if (!req.body.password) {
        res.status(400).send({
            message: 'User password can not be empty'
        });
    }
    if(new AgeFromDate(new Date(req.body.birthDate)).age <= 17){
    	return res.status(400).send({
            message: 'Age incorrect'
        });
    }

    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (user !== null) {
            res.status(400).send({
            message: 'Email resgistrado'
        });
        }else{
            let code = randomstring.generate();
        let user = new User();
        user.name = req.body.name;
        user.surnames = req.body.surnames;
        user.email = req.body.email;
        user.country = req.body.country;
        user.birthDate = req.body.birthDate;
        user.password = md5(req.body.password);
        user.verified = code;
        user.save()
            .then(data => {
                const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '2011.peswainer.1996@gmail.com',
                    pass: '61502036'
                    }
                });
                const mailOptions = {
                  from: '2011.peswainer.1996@gmail.com',
                  to: req.body.email,
                  subject: 'TubeKids',
                  html: `<p>BIENVEDIO A TubeKids ${req.body.name} ${req.body.surnames}, para completar tu registro debes de vericar tu cuenta haciendo click en <a href="http://localhost:4200/verificar-usuario/${code}">este enlace</a></p>`
                };
                transporter.sendMail(mailOptions, function (err, info) {
                   if(err){ res.send(data);}
                });
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'ome error occurred while creating the User'
                });
            });

    }
});
});
//Guest user by id
app.get('/api/users/id', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if(authData.role !== 'admin'){
                res.sendStatus(403);
        }
            User.findById(authData.id, function(err, guests) {
                if (err) {
                    res.send(err);
                }else{
                    res.json(guests);
                }
            });
        }
    });
});
//Delete user by id of the db
app.delete('/api/users/:id', verifyToken, (req, res) => {
    //token validation
    let obj;
    jwt.verify(req.token, 'secret_key_goes_here', function(err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            obj = data;
        }
    });
    if (obj.role !== 'admin') {
        res.status(403);
    }
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `Note not found with id ${req.params.id}`
                });
            }
            res.send({
                message: 'Note deleted successfully!'
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: `User not found with id ${req.params.id}`
                });
            }
            return res.status(500).send({
                message: `Could not delete user with id ${req.params.id}`
            });
        });
})
//Update user by id
app.put('/api/users', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if(authData.role !== 'admin'){
                res.sendStatus(403);
        }
        // Validate Request
        if (!req.body.name) {
            res.status(400).send({
                message: 'User name can not be empty'
            });
        }
        if (!req.body.surnames) {
             res.status(400).send({
                message: 'User surnames can not be empty'
            });
        }
        if (!req.body.country) {
             res.status(400).send({
                message: 'User country can not be empty'
            });
        }
        if (!req.body.birthDate) {
             res.status(400).send({
                message: 'User birthDate can not be empty'
            });
        }
        if (!req.body.email) {
             res.status(400).send({
                message: 'User email can not be empty'
            });
        }
        if (!req.body.password) {
             res.status(400).send({
                message: 'User password can not be empty'
            });
        }
        // Find note and update it with the request body
        User.findByIdAndUpdate(authData.id, {
                name: req.body.name,
                surnames: req.body.surnames,
                email: req.body.email,
                country: req.body.country,
                birthDate: req.body.birthDate
            }, {
                new: true
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: `User not found with id ${req.params.id}`
                    });
                }
                res.send(user);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                     res.status(404).send({
                        message: `User not found with id ${req.params.id}`
                    });
                }
                 res.status(500).send({
                    message: `Error updating user with id ${req.params.id}`
                });
            });
        }
    });
})
//Update user by id, but without the password
app.put('/api/users/password', verifyToken, (req, res) => {
        //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if(authData.role !== 'admin'){
                res.sendStatus(403);
        }
        // Validate Request
        if (!req.body.name) {
            res.status(400).send({
                message: 'User name can not be empty'
            });
        }
        if (!req.body.surnames) {
             res.status(400).send({
                message: 'User surnames can not be empty'
            });
        }
        if (!req.body.country) {
             res.status(400).send({
                message: 'User country can not be empty'
            });
        }
        if (!req.body.birthDate) {
             res.status(400).send({
                message: 'User birthDate can not be empty'
            });
        }
        if (!req.body.email) {
             res.status(400).send({
                message: 'User email can not be empty'
            });
        }
        if (!req.body.password) {
             res.status(400).send({
                message: 'User password can not be empty'
            });
        }
        // Find note and update it with the request body
        User.findByIdAndUpdate(authData.id, {
                name: req.body.name,
                surnames: req.body.surnames,
                email: req.body.email,
                country: req.body.country,
                birthDate: req.body.birthDate,
                password: md5(req.body.password)
            }, {
                new: true
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: `User not found with id ${req.params.id}`
                    });
                }
                res.send(user);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                     res.status(404).send({
                        message: `User not found with id ${req.params.id}`
                    });
                }
                 res.status(500).send({
                    message: `Error updating user with id ${req.params.id}`
                });
            });
        }
    });
});



// app.get('/api/protected', ensureToken, (req, res) => {
//     jwt.verify(req.token, 'secret_key_goes_here', function (err, data) {
//         if (err) {
//             res.sendStatus(403);
//         } else {
//             res.json({
//                 data: data
//             });
//         }
//     });
// });

//Get guest of the db
app.get('/api/guest', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if(authData.role !== 'admin'){res.sendStatus(403);
        }
        Guest.find({user_id: authData.id})
            .then(guests => {res.send(guests)})
                .catch(err => {
                    res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving guests'
                });
            });
        }
    });
});
//Guest guest by id
app.get('/api/guest/:id', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
        if(authData.role !== 'admin'){
           return res.sendStatus(403);
        }
        //check if is exist
        if (!req.params.id) {
            return res.status(400).send({
                message: 'Guest id can not be empty'
            });
        }
        Guest.findById(req.params.id, function(err, guests) {
            if (err) {
                res.send(err);
            } else {
                res.json(guests);
            }
        });
    }
});

});
//save guest in the db
app.post('/api/guest', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
        res.sendStatus(403);
        } else {
        if(authData.role !== 'admin'){
           return res.sendStatus(403);
        }
        if (authData.id == null) {
             res.status(400).send({
                message: 'User id can not be empty'
            });
        }
        if (!req.body.fullname) {
             res.status(400).send({
                message: 'Guest fullname can not be empty'
            });
        }
        if (!req.body.username) {
             res.status(400).send({
                message: 'Guest username can not be empty'
            });
        }
        if (!req.body.pin) {
             res.status(400).send({
                message: 'Guest pin can not be empty'
            });
        }
        if (!req.body.age) {
             res.status(400).send({
                message: "Guest age can not be empty"
            });
        }
         if (req.body.age >= 18) {
             res.status(400).send({
                message: 'Guest age error'
            });
        }
         Guest.findOne({
        username: req.body.username
    }, function(err, guest) {
        if (guest !== null) {
            res.status(400).send({
            message: 'Usuario ya esta resgistrado'
        });
        }else{



        var guest = new Guest();
        guest.fullname = req.body.fullname;
        guest.username = req.body.username;
        guest.pin = md5(req.body.pin);
        guest.age = req.body.age;
        guest.user_id = authData.id;
        guest.save()
            .then(data => {
                    res.send(guest);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while creating the User'
                });
            });
        }
    });
        }
    });
});
//Delete guest by id
app.delete('/api/guest/:id', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
        if(authData.role !== 'admin'){
           return res.sendStatus(403);
        }
        Guest.findByIdAndRemove(req.params.id)
            .then(guest => {
                if (!guest) {
                    res.status(404).send({
                        message: `Guest not found with id ${req.params.id}`
                    });
                }
                res.send({message: "Guest deleted successfully!"});})
            .catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    res.status(404).send({
                        message: `Guest not found with id ${req.params.id}`
                    });
                }
                return res.status(500).send({
                    message: `Could not delete guest with id ${req.params.id}`
                });
            });
        }
    });
});
//Update guest by id without pin
app.put('/api/guest/:id', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
        if(authData.role !== 'admin'){
           return res.sendStatus(403);
        }
        if (!req.body.fullname) {
            res.status(400).send({
                message: 'Guest fullname can not be empty'
            });
        }
        if (!req.body.username) {
            res.status(400).send({
                message: 'Guest username can not be empty'
            });
        }
        if (!req.body.pin) {
            res.status(400).send({
                message: 'Guest pin can not be empty'
            });
        }
        if (!req.body.age) {
            res.status(400).send({
                message: 'Guest age can not be empty'
            });
        }
        // Find note and update it with the request body
        Guest.findByIdAndUpdate(req.params.id, {
                fullname: req.body.fullname,
                username: req.body.username,
                age: req.body.age
            }, {
                new: true
            })
            .then(guest => {
                if (!guest) {
                    return res.status(404).send({
                        message: `Guest not found with id ${req.params.id}`
                    });
                }else{return res.send(guest);}
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: `Guest not found with id ${req.params.id}`
                    });
                }
                return res.status(500).send({
                    message: `Error updating guest with id ${req.params.id}`
                });
            });
        }
    });    
});
//Update guest by id with passworc
app.put('/api/guest/pin/:id', verifyToken, (req, res) => {
     //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
        if(authData.role !== 'admin'){
           return res.sendStatus(403);
        }
        if (!req.body.fullname) {
            return res.status(400).send({
                message: 'Guest fullname can not be empty'
            });
        }
        if (!req.body.username) {
            return res.status(400).send({
                message: 'Guest username can not be empty'
            });
        }
        if (!req.body.pin) {
            return res.status(400).send({
                message: 'Guest pin can not be empty'
            });
        }
        if (!req.body.age) {
            return res.status(400).send({
                message: 'Guest age can not be empty'
            });
        }
        // Find note and update it with the request body
        Guest.findByIdAndUpdate(req.params.id, {
                fullname: req.body.fullname,
                username: req.body.username,
                age: req.body.age,
                pin:md5(req.body.pin),
            }, {
                new: true
            })
            .then(guest => {
                if (!guest) {
                    return res.status(404).send({
                        message: `Guest not found with id ${req.params.id}`
                    });
                }else{return res.send(guest);}
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: `Guest not found with id ${req.params.id}`
                    });
                }
                return res.status(500).send({
                    message: `Error updating guest with id ${req.params.id}`
                });
            });
        }
    });    
})
//save the video in db
app.post('/api/playlist', verifyToken, (req, res) => {
    //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
        if(authData.role !== 'admin'){
           return res.sendStatus(403);
        }
        //validatios
        if (!req.body.url) {
            return res.status(400).send({
                message: 'User url can not be empty'
            });
        }
        if (!req.body.guest) {
            return res.status(400).send({
                message: 'User guest can not be empty'
            });
        }
        if (!req.body.name) {
            return res.status(400).send({
                message: 'User name can not be empty'
            });
        }
        var playlist = new PlayList();
        playlist.url = req.body.url;
        playlist.name = req.body.name;
        playlist.guestId = req.body.guest;
        playlist.userId = authData.id;
        playlist.save()
            .then(playlists => {
                res.send(playlists);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while creating the playlist'
                });
            });
        }
    });    
});

//get the admin video from db
app.get('/api/playlist/admin', verifyToken, (req, res) => {

    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
             if(authData.role !== 'admin'){res.sendStatus(403);}
            PlayList.find({'userId': authData.id})
            .then(playlists => {
                res.send(playlists);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving playlists.'
                });
            });
        }
    })
});

//get the admin video from db
app.get('/api/playlist/admin/:name', verifyToken, (req, res) => {
	if(!req.params.name){
		res.status(400).send({
            message: 'Id is empty'
        });
	}
	
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
             if(authData.role !== "admin"){res.sendStatus(403);}
            PlayList.find({userId: authData.id, name:{$regex:req.params.name,$options:"$i"}})
            .then(playlists => {
                res.send(playlists);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving playlists'
                });
            });
        }
    })
});

//get the admin video from db
app.get('/api/playlist/guest/:name', verifyToken, (req, res) => {
	if(!req.params.name){
		res.status(400).send({
            message: 'Id is empty'
        });
	}
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
             if(authData.role !== 'guest'){res.sendStatus(403);}
            PlayList.find({guestId: authData.id, name:{$regex:req.params.name,$options:"$i"}})
            .then(playlists => {
                res.send(playlists);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving playlists'
                });
            });
        }
    })
});


//get the admin video from db
app.get('/api/playlist/admin', verifyToken, (req, res) => {

    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
             if(authData.role !== 'admin'){res.sendStatus(403);}
            PlayList.find({'userId': authData.id})
            .then(playlists => {
                res.send(playlists);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving playlists'
                });
            });
        }
    })
});



//Get the guest video from db
app.get('/api/playlist/guest', verifyToken, (req, res) => {
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if(authData.role !== 'guest'){res.sendStatus(403);}
            PlayList.find({'guestId': authData.id})
            .then(playlists => {
                res.send(playlists);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving playlists'
                });
            });
        }
    });
});








//Get the guest video from db
app.get('/api/playlist/:id', verifyToken, (req, res) => {
	if(!req.params.id){
		res.status(400).send({
            message: 'Id is empty'
        });
	}
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
             PlayList.find({'_id': req.params.id})
            .then(playlists => {
                res.send(playlists);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occurred while retrieving playlists'
                });
            });
        }
    });
});








//delete video by id 
app.delete('/api/playlist/:id', verifyToken, (req, res) => {
    //token validation 
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if(authData.role !== 'admin'){res.sendStatus(403);}
            if(!req.params.id){res.sendStatus(403);}
            PlayList.findByIdAndRemove(req.params.id)
            .then(playlist => {
                if (!playlist) {
                    res.status(404).send({
                        message: `Note not found with id ${req.params.id}`
                    });
                }else{
                    res.send({message: 'Playlist deleted successfully!'});   
                }   
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    res.status(404).send({
                        message: `User not found with id ${req.params.id}`
                    });
                }
                res.status(500).send({
                    message: `Could not delete user with id ${req.params.id}`
                });
            });
        }
    });
})










//Update guest by id with passworc
app.put('/api/playlist/:id', verifyToken, (req, res) => {
     //token validation
    jwt.verify(req.token, 'tubekids', (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
        if(authData.role !== 'admin'){
           return res.sendStatus(403);
        }
       //validatios
        if (!req.body.url) {
            return res.status(400).send({
                message: 'User url can not be empty'
            });
        }
        if (!req.body.guest) {
            return res.status(400).send({
                message: 'User guest can not be empty'
            });
        }
        if (!req.body.name) {
            return res.status(400).send({
                message: 'User name can not be empty'
            });
        }
        // Find note and update it with the request body
        PlayList.findByIdAndUpdate(req.params.id, {
                url: req.body.url,
                name: req.body.name,
                guest: req.body.guest
            }, {
                new: true
            })
            .then(playlist => {
                if (!playlist) {
                    return res.status(404).send({
                        message: `Playlist not found with id ${req.params.id}`
                    });
                }else{return res.send(playlist);}
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: `Playlist not found with id ${req.params.id}`
                    });
                }
                return res.status(500).send({
                    message: `Error updating PLaylist with id ${req.params.id}`
                });
            });
        }
    });    
})






//root route
app.use(function(req, res, next) {
    res.status(404);
    res.send({
        error: 'Not found'
    });
    return;
});
//check if API work
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}
