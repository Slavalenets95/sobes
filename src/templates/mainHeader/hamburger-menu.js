const hamburger = document.querySelector('.hamburger')
const hamburgerBtn = document.querySelector('.menu')
const opacityBlock = document.querySelector('.opacity')

hamburgerBtn.addEventListener('click', () => {
    if(hamburger.dataset.visible === 'false') {
        hamburger.dataset.visible = 'true'
        hamburgerBtn.dataset.toggle = 'true'
        opacityBlock.classList.add('opacity-visible')
        opacityBlock.addEventListener('click', opacityClickHandler)
    } else {
        hamburger.dataset.visible = 'false'
        hamburgerBtn.dataset.toggle = 'false'
        opacityBlock.classList.remove('opacity-visible')
        opacityBlock.removeEventListener('click', opacityClickHandler)
    }
})

opacityClickHandler = () => {
    hamburger.dataset.visible = 'false'
    hamburgerBtn.dataset.toggle = 'false'
    opacityBlock.classList.remove('opacity-visible')
    opacityBlock.removeEventListener('click', opacityClickHandler)
}
