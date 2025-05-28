const { createServer } = require("https")
const { parse } = require("url")
const next = require("next")
const fs = require("fs")
const path = require("path")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

// Check if certificates exist, otherwise use HTTP
const certsPath = path.join(__dirname, "certificates")
const certExists = fs.existsSync(path.join(certsPath, "cert.pem"))
const keyExists = fs.existsSync(path.join(certsPath, "key.pem"))

const PORT = process.env.PORT || 3000

// Add this function to handle requests with no-cache headers
const handleWithNoCache = (req, res, parsedUrl) => {
    // Add no-cache headers for CSS files
    if (req.url.endsWith(".css") || req.url.includes(".css?")) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
        res.setHeader("Pragma", "no-cache")
        res.setHeader("Expires", "0")
        res.setHeader("Surrogate-Control", "no-store")
    }

    // Handle the request
    handle(req, res, parsedUrl)
}

app.prepare().then(() => {
    let server

    if (certExists && keyExists) {
        // HTTPS server
        const httpsOptions = {
            key: fs.readFileSync(path.join(certsPath, "key.pem")),
            cert: fs.readFileSync(path.join(certsPath, "cert.pem")),
        }

        server = createServer(httpsOptions, (req, res) => {
            const parsedUrl = parse(req.url, true)
            handleWithNoCache(req, res, parsedUrl) // Use our modified handler
        })

        server.listen(PORT, (err) => {
            if (err) throw err
            console.log(`> Ready on https://localhost:${PORT}`)
        })
    } else {
        // Fallback to HTTP if certificates don't exist
        const { createServer } = require("http")

        server = createServer((req, res) => {
            const parsedUrl = parse(req.url, true)
            handleWithNoCache(req, res, parsedUrl) // Use our modified handler
        })

        server.listen(PORT, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${PORT}`)
            console.log("> Note: Running in HTTP mode. For HTTPS, create certificates in the certificates directory.")
        })
    }
})
