
const comments = require('../models/comments')

// GET all comments + optional postId filter
const getAllComments = (req, res) => {
    let result = comments

    if (req.query.postId !== undefined) {
        const postId = Number(req.query.postId)

        if (!Number.isInteger(postId) || postId <= 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'postId must be a positive integer'
            })
        }

        result = comments.filter(
            (comment) => comment.postId === postId
        )
    }

    res.status(200).json({
        status: 'success',
        results: result.length,
        data: {
            comments: result
        }
    })
}

// GET comment by ID
const getCommentById = (req, res) => {
    const id = Number(req.params.id)
    const comment = comments.find(
        (comment) => comment.id === id
    )

    if (!comment) {
        return res.status(404).json({
            status: 'fail',
            message: 'Comment not found'
        })
    }

    res.status(200).json({
        status: 'success',
        data: { comment }
    })
}

// POST create a comment
const createComment = (req, res) => {
    const { postId, userId, text } = req.body

    if (
        postId === undefined ||
        userId === undefined ||
        !Number.isInteger(Number(postId)) ||
        Number(postId) <= 0 ||
        !Number.isInteger(Number(userId)) ||
        Number(userId) <= 0 ||
        typeof text !== 'string' ||
        !text.trim()
    ) {
        return res.status(400).json({
            status: 'fail',
            message: 'Valid postId, userId, and text are required'
        })
    }

    const newComment = {
        id: comments.length > 0
            ? Math.max(...comments.map((comment) => comment.id)) + 1
            : 1,
        postId: Number(postId),
        userId: Number(userId),
        text: text.trim(),
        createdAt: new Date().toISOString()
    }

    comments.push(newComment)

    res.status(201).json({
        status: 'success',
        data: { comment: newComment }
    })
}

// PATCH update a comment
const updateComment = (req, res) => {
    const id = Number(req.params.id)
    const comment = comments.find(
        (comment) => comment.id === id
    )

    if (!comment) {
        return res.status(404).json({
            status: 'fail',
            message: 'Comment not found'
        })
    }

    const { text } = req.body

    if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({
            status: 'fail',
            message: 'A non-empty text field is required'
        })
    }

    comment.text = text.trim()

    res.status(200).json({
        status: 'success',
        data: { comment }
    })
}

// DELETE a comment
const deleteComment = (req, res) => {
    const id = Number(req.params.id)
    const index = comments.findIndex(
        (comment) => comment.id === id
    )

    if (index === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Comment not found'
        })
    }

    comments.splice(index, 1)

    res.status(204).send()
}

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
}
