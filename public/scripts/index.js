//pagina modal fica oculta por padrão, quando clicar no buttonSearch irá remover a class=hide e o modal aparece
const buttonSearch = document.querySelector("#page-home main a")
const modal = document.querySelector("#modal")
const close = document.querySelector("#modal .header a")

buttonSearch.addEventListener("click", () => {
    modal.classList.remove("hide")
})

//Quando clicar no header a (X de fechar) irá adicionar o class=hide novamente e tela some
close.addEventListener("click", () => {
    modal.classList.add("hide")
})

