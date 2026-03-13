const formCadastro = document.getElementById("hotelForm");
const apiURL = "http://localhost:5173/api/Hoteis"

const divCards = document.getElementById("cards");

async function buscarHoteis() {
    try{
        const resposta = await fetch(apiURL);
        if(!resposta.ok){
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resposta.json();
        divCards.innerHTML = "";
        dados.forEach((dado) => {
            console.log("teste")
            //Criar elementos HTML para exibir os dados
            let card = document.createElement("div");
            card.innerHTML = `<h2>${dado.nome}</h2>
            <p>Cidade: ${dado.cidade}</p>
            <p>Quantidade de estrelas: ${dado.qtdEstrelas}</p>`;

            divCards.appendChild(card);
        });
    } catch (error){
        console.log("Erro ao buscar os dados:", error);
    }
}

async function cadastrarHotel(event){
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const cidade = document.getElementById("cidade").value;
    const qtdEstrelas = document.getElementById("qtdEstrelas").value;

    try{
        const resposta = await fetch(apiURL, {
            method: "POST", 
            headers:{
                "Content-Type" : "application/json" 
            },
            body: JSON.stringify({
                nome: nome,
                cidade: cidade,
                qtdEstrelas: qtdEstrelas,
            })
        });
        console.log("Resposta da API:", resposta)
        if(!resposta.ok){
            throw new Error ("Erro ao cadastrar o Hotel");
        }
        
        
        console.log("Hotel cadastrado com sucesso:", dados);
        formCadastro.reset();
        await buscarHoteis();
    } catch(error){
        console.log("Erro ao cadastrar o hotel:", error);
    }
}
formCadastro.addEventListener("submit", cadastrarHotel);
buscarHoteis();