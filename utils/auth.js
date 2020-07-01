const jwt = require('./jwt');
const { userModel, tokenBlacklistModel } = require('../models')

function auth() {
    return function (req, res, next) {
        // const token = req.cookies['auth-cookie']; //for cookie in browser
        const authHeaders = req.get('Authorization')
        if (!authHeaders) {
            res.send({ error: 'Please enter token!' })
            return
        }
        const token = authHeaders.split(' ')[1]; //for api auth
        // if (!token) {
        //     res.redirect('/');
        //     return;
        // }
        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token })
        ]).then(([data, blackListToken]) => {
            if (blackListToken) {
                return Promise.reject(new Error('blacklisted token'))
            }
            userModel.findById(data.userID)
                .then(user => {
                    req.user = user;
                    next();
                })
        }).catch(err => {
            if ([
                'token expired',
                'blacklisted token',
                'jwt must be provided',
                'jwt malformed'
            ].includes(err.message)
            ) {
                res.send({ error: 'Token is invalid or expired' })
                return;
            }
            // next(err)
            res.send({ error: err })
        })
    }
}
module.exports = auth; 