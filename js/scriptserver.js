const cepInput = document.getElementById('cep');
const searchButton = document.getElementById('search-button');
const deleteButton = document.getElementById('deleteButton');
const table = document.getElementById('table');
const alertAdd = document.querySelector('.add-alert')
const alertRemove = document.querySelector('.remove-alert')

async function getCepApi(e) {
    e.preventDefault()
    await fetch(`https://viacep.com.br/ws/${cepInput.value}/json/`)
        .then(resp => resp.json())
        .then(data => postCep(data))
        .catch(err => console.log(err))
}

async function postCep(data) {
    await fetch('http://localhost:3000/Cep', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(() => getCepDb())
}

async function getCepDb() {
    await fetch('http://localhost:3000/Cep')
        .then(resp => resp.json())
        .then(data => renderTable(data))
        .catch(err => console.log(err))
}

async function deleteElement(e) {
    const target = e.target.parentNode.parentNode
    await fetch(`http://localhost:3000/Cep/${target.id}`, {
        method: 'DELETE'
    })
        .then(() => getCepDb())
}

async function deleteAll() {
    await fetch('http://localhost:3000/Cep', {
        method: 'DELETE'
    })
    .then(() => getCepDb())
}

function renderTable(data) {
    const itemTable = document.createElement('tbody')
    itemTable.id = "tableBody"
    table.lastChild.id == "tableBody" ? table.removeChild(table.lastChild) : ""
    console.log(data)
    data.map(element => {
        let tr = document.createElement('tr')
        tr.id = element.id
        tr.innerHTML = `
                <td>${element.cep}</td>
                <td>${element.logradouro == "" ? 'Indisponivel' : element.logradouro}</td>
                <td>${element.bairro == "" ? 'Indisponivel' : element.bairro}</td>
                <td>${element.localidade}</td>
                <td>${element.uf}</td>
                <td><button onclick="deleteElement(event)">X</button></td>
        `
        itemTable.appendChild(tr)
        table.appendChild(itemTable)
    })
}



searchButton.addEventListener('click', getCepApi)
deleteButton.addEventListener('click', deleteAll)
getCepDb()