const express = require('express')
const app = express()

// import projects data file
const { projects } = require('./data.json')

// middleware
app.set('view engine', 'pug')
app.use(express.static('public'))

// routes
app.get('/', (req, res) => {
   res.render('index', { projects }) 
})
app.get('/about', (req, res, next) => {
    // test error for checking global error handler
    // const err = new Error()
    // err.status = 500
    // next(err)
    res.render('about') 
})
app.get('/projects/:id', (req, res, next) => {
    const projectID = req.params.id
    const project = projects[projectID]
    if(project) {
        res.render('project', { project })
    // handle 404 errors at /project/noroute
    } else {
        const err = new Error()
        err.status = 404
        err.message =  "Oops. Looks like that project doesn't exist."
        res.render('error', { err })
    }
})

// error handling

// handle 404 errors at /noroute
app.use((req, res, next) => {
    const err = new Error()
    err.status = 404
    err.message = "Oops. Looks like that page doesn't exist."
    res.render('page-not-found', { err })
})
// global error
app.use((err, req, res, next) => {
    err.status = err.status || 500
    err.message = err.message || "Oops. Looks like something went wrong on the server." 
    res.render('error', { err })
})

// start server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})