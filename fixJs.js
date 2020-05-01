const { readdirSync } = require('fs')
const fs = require('fs')

const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

const fixDirectory = function (DirectoryStr) {

    fs.readdir(DirectoryStr, (err, files) => {
        files.forEach(file => {
            if (file === "index.html") {

                const fileName = `${DirectoryStr}index.html`;

                try {
                    fs.readFile(fileName, 'utf8', function (err, data) {
                        if (err) {
                            return console.log(err);
                        } else {
                            var result = data.replace(/script src\=\"(?!http)([a-zA-Z])/g, 'script src="/$1');
                            fs.writeFile(fileName, result, 'utf8', function (err) {
                                if (err) return console.log(err);
                            });
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        });
    });

}

const loop = function (DirectoryString) {

    if (fs.existsSync(DirectoryString)) {
        fixDirectory(DirectoryString);
    }

    const Dirs = getDirectories(DirectoryString);

    if (Dirs.length) {

        Dirs.forEach(folderName => {

            const DirectoryStr = './dist/beehive/browser/' + folderName + '/';

            if (fs.existsSync(DirectoryStr)) {

                console.log(DirectoryStr + 'index.html Fixed');

                loop(DirectoryStr);

                fixDirectory(DirectoryStr);

            }

        });

    }

}

loop('./dist/beehive/browser/');
