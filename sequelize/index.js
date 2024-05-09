const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
app.use(bodyParser.json());
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'  // Caminho para o arquivo do banco de dados
});
const Livro = sequelize.define('Livro', {
    titulo: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    autor: { type: DataTypes.STRING, allowNull: false },
    editora: { type: DataTypes.STRING, allowNull: false },
    ano: { type: DataTypes.INTEGER, allowNull: false }
});
(async () => {
    await sequelize.sync({ force: true });
    console.log("Modelos sincronizados com o banco de dados.");
})();
app.get('/livros', async (req, res) => {
    const livros = await Livro.findAll();
    res.json(livros);
});
app.get('/livros/:titulo', async (req, res) => {
    const { titulo } = req.params;
    const livro = await Livro.findOne({ where: { titulo } });
    if (livro) {
        res.json(livro);
    } else {
        res.status(404).json({ message: 'Livro não encontrado.' });
    }
});
app.post('/livros', async (req, res) => {
    const { titulo, autor, editora, ano } = req.body;
    try {
        const livro = await Livro.create({ titulo, autor, editora, ano });
        res.status(201).json({ message: 'Livro cadastrado com sucesso.', livro });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.put('/livros/:titulo', async (req, res) => {
    const { titulo } = req.params;
    const { autor, editora, ano } = req.body;
    try {
        const [updated] = await Livro.update({ autor, editora, ano }, { where: { titulo } });
        if (updated) {
            const updatedlivro = await Livro.findOne({ where: { titulo } });
            res.json({ message: 'Informações do Livro atualizadas com sucesso.', livro: updatedlivro });
        } else {
            res.status(404).json({ message: 'Livro não encontrado.' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.delete('/livros/:titulo', async (req, res) => {
    const { titulo } = req.params;
    try {
        const deleted = await Livro.destroy({ where: { titulo } });
        if (deleted) {
            res.json({ message: 'Livro excluído com sucesso.' });
        } else {
            res.status(404).json({ message: 'Livro não encontrado.' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
