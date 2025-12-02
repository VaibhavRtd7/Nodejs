const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {


    if (req.method === 'GET' && req.url === '/') {
        console.log('if-loop')
        // serve a basic html form for upload
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
        <h2> File Upload Server </h2>
        <form action='/upload' method="POST" enctype="multipart/form-data">
           <input type="file" name="file" />
           <button type="submit" style="cursor:pointer"> Upload </button>
        </form>
        <pre>${JSON.stringify({ method: req.method, url: req.url, headers: req.headers }, null, 2)}</pre>
     `);
    }
    else if (req.method === 'POST' && req.url === '/upload') {

          console.log('else-if-loop')
        // Save uploaded file to disk
        const boundary = req.headers['content-type'].split('boundary=')[1];
        
        // console.log(req.headers['content-type'])

        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            // Extract file data from multipart form
            const parts = data.split(`--${boundary}`);
            const filePart = parts.find(p => p.includes('Content-Disposition: form-data;') && p.includes('filename='));

            if (!filePart) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('No file uploaded.');
            }

            // Extract filename and content
            const matchFilename = filePart.match(/filename="(.+)"/);
            const filename = matchFilename ? matchFilename[1] : 'uploaded_file';

            // Extract file binary data
            const fileContent = filePart.split('\r\n\r\n')[1];
            const fileData = fileContent.slice(0, fileContent.lastIndexOf('\r\n'));

            // Write to disk
            const filePath = path.join(__dirname, 'uploads', filename);
            fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
            fs.writeFileSync(filePath, fileData, 'binary');

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`✅ File "${filename}" uploaded successfully!`);
        });

        req.on('error', err => {
            console.error('Upload error:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server error during upload.');
        });
    }
    else {
        console.log('else-loop')
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
    }
})


// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});