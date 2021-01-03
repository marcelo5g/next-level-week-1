function populateUFs () {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    //o fetch retorna uma Promisse, pode ou não ter alguma informação
    // .then( (res) => { return res.json() })  Versão longa da linha abaixo 
    // transforma o resultado do fetch num json e coloca na variável res
    .then( res => res.json() )
    .then( states => {

        for(const state of states) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    } )
}

populateUFs()


//Arrow_function - função anonima
// function() {}
// () => {}

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")


    const ufValue = event.target.value 

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text


    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true


    fetch(url)    
    .then( res => res.json() )
    .then( cities => {
        for(const city of cities) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    } )


}



document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)  //Passa a função por referencia, sem abrir parenteses, senão ela executaria imediatamente, só quero que execute quando "change"     


//Ítens de coleta
//Pegar todos os Li's 
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)     
}


const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target

    // Adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id  

    console.log('ITEM ID: ', itemId)

    //Verficar se existem itens selecionados, se sim
    // pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( function(item) {
        const itemFound = item == itemId   //Será true ou false
        return itemFound
    } )

    //Se já estiver selecionado,
    if( alreadySelected >= 0) {
            //tirar da seleção
        const filteredItems = selectedItems.filter( function(item) {
            const itemIsDifferent = item != itemId  //False
            return itemIsDifferent
        })

        selectedItems = filteredItems
    } else {
        // Se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)
    }

    console.log('selectedItems: ', selectedItems)

        
    // Atualizar o campo escondido com os itens selecionados

    collectedItems.value = selectedItems
}

