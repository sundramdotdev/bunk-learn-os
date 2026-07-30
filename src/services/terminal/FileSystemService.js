export class FSNode {
    constructor(name, isDir, parent = null) {
        this.name = name;
        this.isDir = isDir;
        this.parent = parent;
        this.children = {}; // name -> FSNode
        this.content = ''; // for files
    }
}

export class FileSystem {
    constructor() {
        this.root = new FSNode('/', true);
        this.pwd = this.root;
        this.initDefaultFS();
    }

    initDefaultFS() {
        const home = new FSNode('home', true, this.root);
        const user = new FSNode('user', true, home);
        const docs = new FSNode('documents', true, user);
        const txt = new FSNode('readme.txt', false, user);
        txt.content = 'Welcome to the Bunk & Learn OS Terminal.\nType "help" to see available commands.';
        
        this.root.children['home'] = home;
        home.children['user'] = user;
        user.children['documents'] = docs;
        user.children['readme.txt'] = txt;
        
        this.pwd = user;
    }

    // Resolve path string to node
    resolvePath(pathStr) {
        if (!pathStr || pathStr === '.') return this.pwd;
        if (pathStr === '..') return this.pwd.parent || this.root;
        if (pathStr === '~') return this.root.children['home'].children['user'];
        
        let curr = pathStr.startsWith('/') ? this.root : this.pwd;
        const parts = pathStr.split('/').filter(p => p.length > 0);
        
        for (let p of parts) {
            if (p === '.') continue;
            if (p === '..') {
                if (curr.parent) curr = curr.parent;
            } else {
                if (!curr.children[p]) return null;
                curr = curr.children[p];
            }
        }
        return curr;
    }

    getPwdString() {
        let curr = this.pwd;
        if (curr === this.root) return '/';
        const parts = [];
        while (curr !== this.root) {
            parts.unshift(curr.name);
            curr = curr.parent;
        }
        return '/' + parts.join('/');
    }

    mkdir(name) {
        if (this.pwd.children[name]) throw new Error(`mkdir: cannot create directory '${name}': File exists`);
        this.pwd.children[name] = new FSNode(name, true, this.pwd);
    }

    rmdir(name) {
        const node = this.pwd.children[name];
        if (!node) throw new Error(`rmdir: failed to remove '${name}': No such file or directory`);
        if (!node.isDir) throw new Error(`rmdir: failed to remove '${name}': Not a directory`);
        if (Object.keys(node.children).length > 0) throw new Error(`rmdir: failed to remove '${name}': Directory not empty`);
        delete this.pwd.children[name];
    }

    touch(name) {
        if (!this.pwd.children[name]) {
            this.pwd.children[name] = new FSNode(name, false, this.pwd);
        }
    }

    cat(name) {
        const node = this.resolvePath(name);
        if (!node) throw new Error(`cat: ${name}: No such file or directory`);
        if (node.isDir) throw new Error(`cat: ${name}: Is a directory`);
        return node.content;
    }

    echo(content, file) {
        if (!file) return content;
        if (!this.pwd.children[file]) {
            this.pwd.children[file] = new FSNode(file, false, this.pwd);
        }
        const node = this.pwd.children[file];
        if (node.isDir) throw new Error(`${file}: Is a directory`);
        node.content = content;
    }

    rm(name) {
        const node = this.resolvePath(name);
        if (!node) throw new Error(`rm: cannot remove '${name}': No such file or directory`);
        if (node.isDir) throw new Error(`rm: cannot remove '${name}': Is a directory`);
        delete node.parent.children[node.name];
    }

    cd(pathStr) {
        const node = this.resolvePath(pathStr);
        if (!node) throw new Error(`cd: ${pathStr}: No such file or directory`);
        if (!node.isDir) throw new Error(`cd: ${pathStr}: Not a directory`);
        this.pwd = node;
    }

    ls(pathStr) {
        const node = pathStr ? this.resolvePath(pathStr) : this.pwd;
        if (!node) throw new Error(`ls: cannot access '${pathStr}': No such file or directory`);
        if (!node.isDir) return node.name;
        return Object.values(node.children).map(c => c.name).sort().join('  ');
    }

    tree(node = this.pwd, prefix = '') {
        let res = '';
        const children = Object.values(node.children).sort((a,b)=>a.name.localeCompare(b.name));
        children.forEach((c, i) => {
            const isLast = i === children.length - 1;
            res += `${prefix}${isLast ? '└── ' : '├── '}${c.name}\n`;
            if (c.isDir) {
                res += this.tree(c, prefix + (isLast ? '    ' : '│   '));
            }
        });
        return res;
    }
}
