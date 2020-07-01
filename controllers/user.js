const { userModel, tokenBlacklistModel } = require('../models')
const { createToken } = require('../utils/jwt');

function signin(req, res) {
    const token = createToken({ userID: req.user.id });
    // res.headers('aid', token)
    // res.cookie('auth-cookie', token)
    // .redirect('/');
    res.send({ message: 'User successufuly loged in', token, userId: req.user.id })
}

module.exports = {
    get: {
        login: (req, res) => {
            res.render('login.hbs')
        },
        register: (req, res) => {
            res.render('register')
        },
        logout: (req, res, next) => {
            const token = req.token || req.cookies['auth-cookie'];
            if (!token) {
                res.redirect('/');
                return;
            }
            tokenBlacklistModel.create({ token })
                .then(() => {
                    res.clearCookie('auth-cookie');
                    res.status(200).redirect('/');
                })
                .catch(err => next(err))
        }
    },
    post: {
        login: (req, res, next) => {
            const { username, password } = req.body;
            userModel.findOne({ username })
                .then(userData => {
                    if (!userData) {
                        return Promise.reject(new Error(`This user ${username} not exist !`))
                    }
                    const match = Promise.all([userData, userData.matchPassword(password)])   //promise in promise - mot nested
                        .then(([userData, match]) => {
                            if (!match) {
                                return Promise.reject(new Error('Password mismatch!'))
                            }
                            req.user = userData;
                            signin(req, res);
                            return;
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(404).send({error: err.message})
                        })
                })
                .catch(error => {
                    console.error(error);
                    res.status(404).send({error: error.message})
                })
        },
        register: (req, res, next) => {
            const { username, password, repeatPassword } = req.body;
            if (password !== repeatPassword) {
                res.render('register.hbs', { errors: { password: 'Password and repeatpassword don\'t match' } })
                return;
            }
            userModel.create({ username, password })
                .then((user) => {
                    req.user = user;
                    signin(req, res);
                    return;
                })
                .catch(err => {
                    if (err.code = 11000 && err.name === 'MongoError') {
                        res.render('register', { errors: { username: 'User already exist' } })
                        return;
                    }
                    if (err.name === 'ValidationError') {
                        res.render('register.hbs', { errors: err.errors });
                        console.log(err)
                        return;
                    }
                    next(err);
                })
        }
    }
}