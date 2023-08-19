const fs = require('fs');
class UserManager {
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
                console.log(`El email ${email} ya existe.`);
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
    async getProductById(id) {
        const usuarios = await this.getUsers();
        return usuarios.find(usuario => usuario.id === id);
    }
    async updateProduct(id, nombre, apellido, email) {
        let usuarios = await this.getUsers();
        const usuarioIndex = usuarios.findIndex(usuario => usuario.id === id);
        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex] = {
                id,
                nombre,
                apellido,
                email
            };
            await fs.promises.writeFile(this.path, JSON.stringify(usuarios, null, 5));
        } else {
            console.log(`El usuario con ID ${id} no existe.`);
        }
    }
    async deleteProduct(id) {
        let usuarios = await this.getUsers();
        const usuarioIndex = usuarios.findIndex(usuario => usuario.id === id);
        if (usuarioIndex !== -1) {
            usuarios.splice(usuarioIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(usuarios, null, 5));
        } else {
            console.log(`El usuario con ID ${id} no existe.`);
        }
    }
}
const entorno = async () => {
    let path = "./user.json";
    let manager = new UserManager(path);
    
    await manager.addUser('nombre1', 'apellido1', 'email1@example.com');
    await manager.addUser('nombre2', 'apellido2', 'email2@example.com');
    await manager.addUser('nombre3', 'apellido3', 'email3@example.com');
    
    console.log(await manager.getUsers());
    const usuario = await manager.getProductById(2);
    console.log("Usuario con ID 2:", usuario);
    await manager.updateProduct(2, 'nombre_modificado', 'apellido_modificado', 'email2_modificado@example.com');
    console.log("Usuarios después de la actualización:");
    console.log(await manager.getUsers());
    await manager.deleteProduct(1);
    console.log("Usuarios después de la eliminación:");
    console.log(await manager.getUsers());
};
entorno();