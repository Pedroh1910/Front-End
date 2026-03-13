const formcadastro = document.getElementById("quartoform");
const apiUrl = "http://localhost:5173/api/Quartos";
const apiUrl2 = "http://localhost:5173/api/Hoteis";
const divCards = document.getElementById("cards");
const selectHotel = document.getElementById("hotel");

async function buscarQuartos() {
    try {
        const resposta = await fetch(apiUrl);
        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

        const dados = await resposta.json();
        divCards.innerHTML = "";

        dados.forEach((dado) => {
            let card = document.createElement("div");
            card.className = "exame-card"; 
            card.innerHTML = `
                <h3>Hotel ID: ${dado.hotelId}</h3>
                <p><strong>Tipo:</strong> ${dado.tipo}</p>
                <p><strong>Preço:</strong> R$ ${dado.preco}</p>
            `;
            divCards.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}

async function listarHoteis() {
    try {
        const response = await fetch(apiUrl2);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const hoteis = await response.json();
        selectHotel.innerHTML = "<option value=''>Selecione o Hotel</option>";
        
        hoteis.forEach((hotel) => {
            const option = document.createElement("option");
            option.value = hotel.id; 
            option.textContent = `ID: ${hotel.id} - ${hotel.nome}`; 
            selectHotel.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

async function cadastrarQuarto(event) {
    event.preventDefault();

    const hotelIdSelecionado = selectHotel.value;

    if (!hotelIdSelecionado) return;

    const corpoDados = {
        hotelId: Number(hotelIdSelecionado),
        tipo: document.getElementById("tipoInput").value,
        preco: Number(document.getElementById("precoInput").value)
    };

    try {
        const resposta = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpoDados),
        });

        if (!resposta.ok) throw new Error("Erro ao realizar o cadastro");

        formcadastro.reset();
        await buscarQuartos();
        
    } catch (error) {
        console.error(error);
    }
}

formcadastro.addEventListener("submit", cadastrarQuarto);
buscarQuartos();
listarHoteis();