const express = require("express") //Importando o módulo express.
const app = express() //Criando uma instância do express.
const bodyParser = require('body-parser') //Importando o body-parser
const connection = require('./database/database') //Importando a conexão com o banco
const Pergunta = require('./database/Pergunta') //Importando o model, Pergunta
const Resposta = require('./database/Resposta') //Importando o model, Resposta

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

//Fazendo com que o Express use o EJS como view engine.
app.set("view engine", "ejs")

//Configuração para arquivos estaticos.
app.use(express.static('public'))

//Rota principal
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order:[
    ['id', 'DESC']
  ]}).then(perguntas => {
    res.render("index", {
      perguntas: perguntas
    }) 
  }) 
})

//Rota perguntar
app.get('/perguntar', (req, res) => {
  res.render("perguntar")
})

//Rota post, para salvar as perguntas
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

//Rota onde fica as perguntas
app.get('/pergunta/:id', (req, res) => {
  var id = req.params.id
  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta => {
    if(pergunta != undefined) {

      Resposta.findAll({
        where: {perguntaId: pergunta.id},
        order: [['id', 'DESC']]
      }).then(respostas => {
        res.render('pergunta', {
          pergunta: pergunta,
          respostas: respostas
        })
      })
    } else {
      res.redirect('/')
    }
  })
})

//Rota post, para puxar as respostas
app.post('/responder', (req, res) => {
  var corpo = req.body.corpo
  var perguntaId = req.body.pergunta
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect('/pergunta/'+perguntaId)
  })
})

//Rodando o servidor na porta 8081
app.listen(8081, () => {console.log("Servidor rodando") })