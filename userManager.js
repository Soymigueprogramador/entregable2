const fs = require('fs');
class userManager {
    constructor(path) {
        this.path = path;
    }
    async getUsers() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
        } else {
            return [];
        }
    }
    async addUser(nombre, apellido, email) {
        let usuarios = await this.getUsers();
        if (usuarios.length > 0) {
            let existe = usuarios.findIndex(usuario => usuario.email === email);
            if (existe !== -1) {
                console.log(`Tu ${email} ya existe maquina!!`);
                return;
            }
        }
        let nuevoUsuario = {
            nombre: `${nombre}`,
            apellido: `${apellido}`,
            email: `${email}`
        };
        if (usuarios.length === 0) {
            nuevoUsuario.id = 1;
        } else {
            nuevoUsuario.id = usuarios[usuarios.length - 1].id + 1;
        }
        usuarios.push(nuevoUsuario);
        await fs.promises.writeFile(this.path, JSON.stringify(usuarios, null, 5));
    }
}
const entorno = async () => {
    let path = "./user.json";
    let manager = new userManager(path);
    await manager.addUser('nombre1', 'apellido1', 'email1@example.com');
    await manager.addUser('nombre2', 'apellido2', 'email2@example.com');
    await manager.addUser('nombre3', 'apellido3', 'email3@example.com');
    console.log(await manager.getUsers());
};
entorno();