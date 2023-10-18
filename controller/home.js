const site = {
    url : process.env.URL,
    getHeaders:'',
    otherHeaders:''
}

const secureSite = {
    url : site.url+'secure/',
    authurl:site.url,
    getHeaders:",\n{ headers:{'Content-Type':'application/json','Authorization':'Bearer token'}} <br>",
    otherHeaders:",\nheaders:{'Content-Type':'application/json','Authorization':'Bearer token'}",
    delHeaders:",\nheaders:{'Content-Type':'application/json','Authorization':'Bearer token'}"
}

module.exports.indexPage = (req,res) => {
    res.render('home/index',{site:site})
}

module.exports.docsPage = (req,res) => {
    res.render('home/docs',{site:site})
}

module.exports.secureDocsPage = (req,res) => {
    res.render('home/docs',{site:secureSite})
}

module.exports.signup = (req,res) => {
    res.render('home/signup',{site:site})
}