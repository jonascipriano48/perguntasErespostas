const express = require("express") //Importando o módulo express.
const app = express() //Criando uma instância do express.
const bodyParser = require('body-parser') //Importando o body-parser
const connection = require('./database/database') //Importando a conexão com o banco
const Pergunta = require('./database/Pergunta')

//Testando a conexão com o banco de dados
async function teste() {
  try {
    await connection.authenticate()
    console.log('Conexão OK!')
  } catch (error) {
    console.error('Erro na conexão:', error)
  }
}
teste()

//Configurandp o body-parser
app.use(bodyParser.urlencoded({exteded: false}))
app.use(bodyParser.json())

//Estou dizendo para o Express usar o EJS como view engine.
app.set("view engine", "ejs")

//Configuração para arquivos estaticos.
app.use(express.static('public'))

app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order:[
    ['id', 'DESC']
  ]}).then(perguntas => {
    res.render("index", {
      perguntas: perguntas
    }) 
  }) 
})

app.get('/perguntar', (req, res) => {
  res.render("perguntar")
})

app.post('/salvarpergunta', (req, res) => {
  var titulo = req.body.titulo
  var descricao = req.body.descricao
  
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect('/')
  })
})

app.get('/pergunta/:id', (req, res) => {
  var id = req.params.id
  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta => {
    if(pergunta != undefined) {
      res.render('pergunta')
    } else {
      res.redirect('/')
    }
    console.log(pergunta)
  })
})

app.listen(8081, () => {console.log("Servidor rodando") }) //Rodando o servidor.