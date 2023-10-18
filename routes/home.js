const express = require('express')
const router = express.Router()
const home = require('../controller/home')

router.get('/',home.indexPage)
router.get('/docs',home.docsPage)
router.get('/secure',home.secureDocsPage)
router.get('/signup', home.signup)

module.exports = router