
const posts = require('../models/posts')
const comments = require('../models/comments')

// GET all posts + optional tag filter
const getAllPosts = (req, res) => {
    let result = posts

    if (req.query.tag) {
        result = posts.filter((post) =>
            post.tags.includes(req.query.tag)
        )
    }

    res.status(200).json({
        status: 'success',
        results: result.length,
        data: {
            posts: result
        }
    })
}

// GET post by ID
const getPostById = (req, res) => {
    const id = Number(req.params.id)
    const post = posts.find((post) => post.id === id)

    if (!post) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found'
        })
    }

    res.status(200).json({
        status: 'success',
        data: { post }
    })
}

// POST create a new post
const createPost = (req, res) => {
    const { userId, title, content, tags } = req.body

    if (
        userId === undefined ||
        !Number.isInteger(Number(userId)) ||
        Number(userId) <= 0 ||
        !title ||
        !content
    ) {
        return res.status(400).json({
            status: 'fail',
            message: 'userId, title, and content are required'
        })
    }

    if (tags !== undefined && !Array.isArray(tags)) {
        return res.status(400).json({
            status: 'fail',
            message: 'tags must be an array'
        })
    }

    const now = new Date().toISOString()

    const newPost = {
        id: posts.length > 0
            ? Math.max(...posts.map((post) => post.id)) + 1
            : 1,
        userId: Number(userId),
        title,
        content,
        tags: tags || [],
        likes: 0,
        createdAt: now,
        updatedAt: now
    }

    posts.push(newPost)

    res.status(201).json({
        status: 'success',
        data: { post: newPost }
    })
}

// PATCH update a post
const updatePost = (req, res) => {
    const id = Number(req.params.id)
    const post = posts.find((post) => post.id === id)

    if (!post) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found'
        })
    }

    const { title, content, tags } = req.body

    if (tags !== undefined && !Array.isArray(tags)) {
        return res.status(400).json({
            status: 'fail',
            message: 'tags must be an array'
        })
    }

    if (title !== undefined) post.title = title
    if (content !== undefined) post.content = content
    if (tags !== undefined) post.tags = tags

    post.updatedAt = new Date().toISOString()

    res.status(200).json({
        status: 'success',
        data: { post }
    })
}

// DELETE a post
const deletePost = (req, res) => {
    const id = Number(req.params.id)
    const index = posts.findIndex((post) => post.id === id)

    if (index === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found'
        })
    }

    posts.splice(index, 1)

    res.status(204).send()
}

// POST like a post
const likePost = (req, res) => {
    const id = Number(req.params.id)
    const post = posts.find((post) => post.id === id)

    if (!post) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found'
        })
    }

    post.likes += 1

    res.status(200).json({
        status: 'success',
        data: { post }
    })
}

// GET comments of a post
const getPostComments = (req, res) => {
    const id = Number(req.params.id)
    const post = posts.find((post) => post.id === id)

    if (!post) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found'
        })
    }

    const postComments = comments.filter(
        (comment) => comment.postId === id
    )

    res.status(200).json({
        status: 'success',
        results: postComments.length,
        data: {
            comments: postComments
        }
    })
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPostComments
}
