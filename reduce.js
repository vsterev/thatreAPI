const play = [
    {
        users: [],
        id: '5ef8ddbb1de2354388a6b0e6',
        title: 'Voluptatem natus cu',
        description: 'Proident et ut at d',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Rubik%27s_cube.svg/1200px-Rubik%27s_cube.svg.png',
        isPublic: true,
        creatorId: '5ef8d04aa896832014948c67',
        createdAt: '2020-06-28T18:13:15.143Z',
        likesCount: 0,
    },
    {
        users: ['5ef8d04aa896832014948c67',3,4],
        id: '5ef8e3a93d67272810820654',
        title: 'Commodo nesciunt la',
        description: 'Ut id adipisicing e',
        imageUrl: 'https://media.timeout.com/images/103727744/380/285/image.jpg',
        isPublic: true,
        creatorId: '5ef8cfc2a896832014948c63',
        createdAt: '2020-06-28T18:38:33.350Z',
        likesCount: 1,
    },
    {
        users: [2,3,4,5],
        id: '5ef8f1668eaffc3f742d40c3',
        title: 'vasko',
        description: 'acasdasddsasdsad',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71WS9kb-JFL._AC_SX679_.jpg',
        isPublic: true,
        creatorId: '5ef8bca8e8cb8e34441c8a3f',
        createdAt: '2020-06-28T19:37:10.499Z',
        likesCount: 0,
    }
]
const playNew = play.reduce((acc, curr) => {
    const upd = { ...curr, likes: curr.users.length } //modify object using condition
    console.log(curr)
    acc.push(upd)
    console.log(upd)
    return acc;
}, [])

// console.log(playNew)