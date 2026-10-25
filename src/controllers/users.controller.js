
const users = require('../models/users')
const posts = require('../models/posts')

// GET all users
const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users: users
        }
    })
}

// GET user by ID
const getUserById = (req, res) => {
    const id = Number(req.params.id)

    const user = users.find((user) => user.id === id)

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }
    })
}


const createUser = (req, res) => {
    const { username, fullName, email, bio, avatar, role } = req.body

    if (!username || !fullName || !email) {
        return res.status(400).json({
            status: 'fail',
            message: 'username, fullName, and email are required'
        })
    }

    const newUser = {
        id: users.length > 0
            ? Math.max(...users.map((user) => user.id)) + 1
            : 1,
        username,
        fullName,
        email,
        bio: bio || '',
        avatar: avatar || '',
        role: role || 'member',
        createdAt: new Date().toISOString()
    }

    users.push(newUser)

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
}

// PATCH user by ID
const updateUser = (req, res) => {
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        })
    }

    const allowedFields = [
        'username',
        'fullName',
        'email',
        'bio',
        'avatar',
        'role'
    ]

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            user[field] = req.body[field]
        }
    })

    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }
    })
}

// DELETE user by ID
const deleteUser = (req, res) => {
    const id = Number(req.params.id)
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        })
    }

    users.splice(index, 1)

    res.status(204).send()
}

// GET posts by user ID
const getUserPosts = (req, res) => {
    const userId = Number(req.params.id)
    const user = users.find((user) => user.id === userId)

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        })
    }

    const userPosts = posts.filter(
        (post) => post.userId === userId
    )

    res.status(200).json({
        status: 'success',
        results: userPosts.length,
        data: {
            posts: userPosts
        }
    })
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserPosts
}

