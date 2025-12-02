const http = require('http');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {

  let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);

  const ext = path.extname(filePath);

  let contentType = 'text/html';

  if (ext === '.css') contentType = 'text/css';
  else if (ext === '.js') contentType = 'application/javascript';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });

  readFiles();
});


function readFiles() {
   
    const folder_name =  './public'

    fs.readdir(folder_name, (err, files) => {
        if(err) {
            console.log('Error while reading files');
        }
        else {
            const filesData = [];
            files.forEach((file) => {

                const filePath = path.join('./public', file);
                const stats = fs.statSync(filePath)
                 
                filesData.push({
                    Name : file,
                    Size : `${stats.size} bytes`,
                    BirthTime : stats.birthtime,
                    last_M_Time : stats.mtime
                })
                
                console.table(filesData)
            })
        }
    })
}


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
