// Esses comandos devem ser executados no Terminal Node antes
// npm = Node Package manager
// No terminal >> npm init -y   >> Cria o arquivo package.json
// npm install express >>>  Criação do módulo (arquivo package-lock.json e pasta node_modules)
// npm install nodemon -D  >>> Instala um módulo que "mon" monitora alterações no "-D" Desenvolvimento e exclui a necessidade de ficar reiniciando o servidor a cada nova alteração 
// npm install nunjucks  >>> Template Engine - HTML com esteróids 
// intalada a extensão nunjucks template para mudar as cores - settings JSON

const express = require("express")    //puxa a dependencia, o pacote express da pasta node_modules
const server = express()

//Pegar o banco de dados:
const db = require("./database/db")


//configurar a pasta Public para poder carregar o .css, assets, scripts
server.use(express.static("public"))


//Configurar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))



//utilizado template engine 
const nunjucks = require("nunjucks")   //puxa a dependencia, o pacote nunjucks da pasta node_modules
nunjucks.configure("src/views", {
    express: server,
    noCache: true           //noCache: não salvar no cache alteraçoes recentes, pode dar bug 
})


// No arquivo package.json >> "scripts": { "start": "nodemon src/server.js"} o Start cria um atalho para o comando de iniciar o servidor. Depois é só digitar no terminal: npm start 


//configurar caminhos da minha aplicação
//Página inicial
// "/"  >>> Caminho solicitado, é a home por padrão 
//req: Requisição, Pedido
//res: Resposta

server.get("/", function(req, res) {
    //res.send("Cheguei aqui")    Essa é a resposta que o site vai ENVIAR/SEND ao pedido. Configuração de Rota
    // Se nao tivesse o nunjucks >> res.sendFile(__dirname + "/views/index.html")})
    return res.render("index.html", {title: "Um título"})  //O segundo argumento do .render é um objeto que pode alterar a variável do HTML
})

server.get("/create-point", function(req, res) {  
       

    // req.query: Query strings (?,&) da URL (que aparece depois de clicar no botão, que antes não mandava pra lugar nenhum)

    // console.log(req.query)

    return res.render("create-point.html")  
})


//O Post é parecido com o get, porém os dados não ficam expostos na URL
server.post("/savepoint", (req, res) => {

    // req.body: O corpo do nosso formulário
    // console.log(req.body)

    // Inserir dados no banco de dados

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);    
    `

    values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items

    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no Cadastro!")
        }

        console.log("Cadastrado com Sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true})

    }

    db.run(query, values, afterInsertData)







    
})



server.get("/search-results", function(req, res) {  
    
    
    const search = req.query.search

    if (search == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0 })  


    }
    
    // Pegar os dados do banco de dados
    // db.all(`SELECT * FROM places`, function(err, rows) {

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        console.log("Aqui estão seus registros: ")
        console.log(rows) 

        const total = rows.length


        //mostrar a pagina html com os dados do banco de dados   
        return res.render("search-results.html", { places: rows, total: total })  

    })  

})

//Como as rotas dos arquivos estão sendo configurados agora, é necessário voltar em todos os arquivos html e alterar os caminhos, retirando o .html do final dos endereços das pastas





//ligar o servidor na porta 3000
server.listen(3000)

