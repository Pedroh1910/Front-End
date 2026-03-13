const formCadastro = document.getElementById("hotelForm");
const apiURL = "http://localhost:5173/api/Hoteis";
const divCards = document.getElementById("cards");

async function buscarHoteis() {
    try {
        const resposta = await fetch(apiURL);
        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

        const dados = await resposta.json();
        divCards.innerHTML = "";

        dados.forEach((dado) => {
            let card = document.createElement("div");
            card.className = "hotel-card";
            
            // Usando dado.id diretamente conforme solicitado
            card.innerHTML = `
                <h2>${dado.nome}</h2>
                <p>Cidade: ${dado.cidade}</p>
                <p>Quantidade de estrelas: ${dado.qtdEstrelas}</p>
                <button onclick="mostrarDetalhes(${dado.id})">Ver Detalhes</button>
                <div id="detalhes_hotel_${dado.id}" style="display: none; margin-top: 10px;"></div>
            `;
            divCards.appendChild(card);
        });
    } catch (error) {
        console.log("Erro ao buscar os dados:", error);
    }
}

async function mostrarDetalhes(hotelId) {
    const detalhesDiv = document.getElementById(`detalhes_hotel_${hotelId}`);

    if (detalhesDiv.style.display === "none") {
        detalhesDiv.style.display = "block";
        detalhesDiv.innerHTML = "<p>Carregando quartos...</p>";
        buscarDetalhesHotel(hotelId);
    } else {
        detalhesDiv.style.display = "none";
        detalhesDiv.innerHTML = "";
    }
}

async function buscarDetalhesHotel(hotelId) {
    try {
        const response = await fetch(`${apiURL}/${hotelId}`);
        if (response.ok) {
            const hotel = await response.json();
            const detalhesDiv = document.getElementById(`detalhes_hotel_${hotelId}`);

            if (!hotel.quartos || hotel.quartos.length === 0) {
                detalhesDiv.innerHTML = "<p>Nenhum quarto encontrado.</p>";
                return;
            }

            let quartosHTML = "<h3>Quartos:</h3>";
            hotel.quartos.forEach((quarto) => {
                quartosHTML += `
                    <div class="quartos-card"> 
                        <p><strong>Tipo:</strong> ${quarto.tipo}</p>
                        <p><strong>Preço:</strong> R$ ${quarto.preco}</p>
                    </div>
                `;
            });
            detalhesDiv.innerHTML = quartosHTML;
        }
    } catch (error) {
        console.log("Erro ao buscar detalhes:", error);
    }
}

async function cadastrarHotel(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const cidade = document.getElementById("cidade").value;
    const qtdEstrelas = document.getElementById("qtdEstrelas").value;

    try {
        const resposta = await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: nome,
                cidade: cidade,
                qtdEstrelas: Number(qtdEstrelas)
            })
        });

        if (!resposta.ok) throw new Error("Erro ao cadastrar o Hotel");

        formCadastro.reset();
        await buscarHoteis();
    } catch (error) {
        console.log("Erro no cadastro:", error);
    }
}

formCadastro.addEventListener("submit", cadastrarHotel);
buscarHoteis();