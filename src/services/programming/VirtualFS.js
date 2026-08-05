export class VirtualFS {
    constructor() {
        this.files = {
            'main.js': 'console.log("Hello World!");',
            'main.py': 'print("Hello World!")',
            'query.sql': 'SELECT * FROM users;',
            'main.c': '#include <stdio.h>\n\nint main() {\n    printf("Hello World!");\n    return 0;\n}'
        };
    }

    getFile(name) {
        return this.files[name] || '';
    }

    setFile(name, content) {
        this.files[name] = content;
    }

    listFiles() {
        return Object.keys(this.files);
    }

    createFile(name, content = '') {
        if (!this.files[name]) {
            this.files[name] = content;
        }
    }

    deleteFile(name) {
        delete this.files[name];
    }
}

export const virtualFS = new VirtualFS();
