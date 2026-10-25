
const express = require('express')
const router = express.Router()

const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPostComments
} = require('../controllers/posts.controller')

router.get('/', getAllPosts)
router.get('/:id/comments', getPostComments)
router.get('/:id', getPostById)
router.post('/', createPost)
router.patch('/:id', updatePost)
router.delete('/:id', deletePost)
router.post('/:id/like', likePost)

module.exports = router
