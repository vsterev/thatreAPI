const { playModel, userModel } = require('../models')

module.exports = {
    get: {
        index: (req, res, next) => {
            const user = req.user;
            playModel.find({ isPublic: true })
                .then(plays => {
                    if (!user) {
                        let sorted = [...plays].sort((a, b) => { return b.users.length - a.users.length })
                        const topPlays = sorted.slice(0, 3);
                        // res.render('indexNotAuth.hbs', { title: 'Theatre | Home page', plays: topPlays, user });
                        res.status(200).send(topPlays)
                        return;
                    }
                    console.log(plays)
                    const sorted = [...plays].sort((a, b) => {
                        if (b.createdAt === a.createdAt) {
                            return a.title.localeCompare(b.title)
                        }
                        return b.createdAt - a.createdAt
                    })
                    res.status(201).send({ sorted, user })
                    // res.render('indexAuth.hbs', { title: 'Theatre | Home page', plays: sorted, user });
                    return
                })
                .catch(err => console.log(err))
        },
        details: (req, res, next) => {
            const id = req.params.id;
            const user = req.user || 'undefined';
            playModel.findById(id)
                .then(play => {
                    play.isCreator = play.creatorId.toString() === user.id;
                    play.isLiked = play.users.includes(user.id.toString());
                    res.send({ play, user })
                })
                .catch(err => res.send({ error: err.message }))
        },
        notFound: (req, res, next) => {
            const user = req.user;
            res.status(404).send({ message: `Not Found custom message ` })
        },
        sortByLikes: (req, res, next) => {
            const user = req.user;
            playModel.aggregate([
                {
                    $project: {
                        numberOfLikes: { $cond: { if: { $isArray: "$users" }, then: { $size: "$users" }, else: "NA" } }
                    },
                }
            ])
                .then(plays => console.log(plays))
                .catch(err => console.error(err))
            // playModel.find().sort({ 'usersLength': 1 })
            //     .then(plays => {
            //         // let sorted = [...plays].sort((a, b) => { return b.users.length - a.users.length })
            //         res.send({ plays })
            //     })
            //     .catch(err => {
            //         res.send({ error: err.message })
            //         console.log(err)
            //     })
        },
        sortByDate: (req, res, next) => {
            const user = req.user;
            const { from, to } = req.query
            playModel.find({ isPublic: true }).sort({ createdAt: -1 }).skip(+from).limit(+to) //paging
                .then(plays => {
                    // const sorted = [...plays].sort((a, b) => {
                    //     return b.createdAt - a.createdAt
                    // })
                    res.send({ plays })
                })
                .catch(err => send({ error: err.message }))

        },
        myPlays: (req, res, next) => {
            const user = req.user;
            playModel.find({ creatorId: req.user.id })
                .then(plays =>
                    res.send({ message: "My plays", plays })
                )
                .catch(err => console.log({ error: err.message }))
        }
    },
    post: {
        create: (req, res, next) => {
            const { title = null, description = null, imageUrl = null, isPublic } = req.body;
            const creatorId = req.user.id;
            const user = req.user;
            Promise.all(
                [
                    playModel.find(),
                    playModel.create({ title, description, imageUrl, isPublic, users: [], creatorId, createdAt: Date.now() })
                ]
            )
                .then(([allPlays, newPlay]) => {
                    if (req.query.all === "y") {
                        res.send({ message: 'New play are added', allPlays })
                        return
                    }
                    res.send({ message: 'New play are added', newPlay })
                })
                .catch(err => {
                    res.send({ error: err.message })
                    console.log(err)
                })
        }
    },
    delete: {
        delete: (req, res, next) => {
            const user = req.user;
            Promise.all([
                userModel.update({ plays: { $in: [req.params.id] } }, { $pull: { plays: req.params.id } }, { multi: true }),
                playModel.findByIdAndDelete(req.params.id)
            ])
                .then(([userUpdated, modelDeleted]) => {
                    res.send({ message: `Play ${modelDeleted.id} is deleted !` });
                })
                .catch(err => res.status(400).send(err.message))
        }
    },
    patch: {
        like: async (req, res, next) => {
            const user = req.user;
            const { playId } = req.body
            let isIncluded = await playModel.findOne({ _id: playId, users: { $in: [user.id] } })
            if (isIncluded) {
                res.send({ message: `User already liked play ${playId}` })
                return
            }
            Promise.all([
                userModel.findByIdAndUpdate(req.user.id, { $push: { plays: playId } }).lean(),
                playModel.findByIdAndUpdate(playId, { $push: { users: user.id }, $inc: { likesCount: +1 } }).lean()
            ])
                .then(([user, play]) => res.send({ message: `Play ${playId} is liked !` }))
                .catch(err => res.status(400).send({ error: err.message }))
        },
        edit: (req, res, next) => {
            const user = req.user;
            const { playId, title, description, imageUrl, isPublic } = req.body;
            const newData = {}
            title && (newData.title = title)
            description && (newData.description = description)
            imageUrl && (newData.imageUrl = imageUrl)
            isPublic && (newData.isPublic = isPublic)
            playModel.findByIdAndUpdate(playId, newData, { runValidators: true, new: true })
                .then(play => res.send({ message: `Play ${play.id} is updated`, play }))
                .catch(err => {
                    if (err.name == 'ValidationError') {
                        res.send({ massage: 'ValidationError', error: err.message })
                        return;
                    }
                    res.send({ error: err.message });
                    console.log(err)
                })
        }
    }
}

