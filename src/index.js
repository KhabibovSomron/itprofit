import './style.scss'
import {isEmpty, isEmailValid} from "./validation";
import IMask from "imask";
import {sendRequest} from "./ajax";


const button = document.querySelector("input[type=submit]")
const inputBoxes = document.querySelectorAll('div[class=input-box]')



const userNameError = document.querySelector("p[id=username-error]")
const emailError = document.querySelector("p[id=email-error]")
const phoneNumberError = document.querySelector("p[id=phone-error]")
const messageError = document.querySelector("p[id=message-error]")

const resetErrorLabel = (obj, box) => {
    obj.classList.remove()
    obj.classList.add('hidden')
    box.classList.remove('input-box-error')
}

const setErrorMessage = (obj, message, box) => {
    obj.innerHTML = message
    obj.classList.remove('hidden')
    obj.classList.add('error-label')
    box.classList.add('input-box-error')
}

// Модальное окно
const modal = document.querySelector('div[class=modal]')
const modalButton = document.querySelector('input[name=modal-btn]')
const modalHeader = document.getElementById('modal-header')
const modalContent = document.getElementById('modal-content')

const modalDataChangeAndOpen = (header, content) => {
    modalHeader.innerHTML = header
    modalContent.innerHTML = content
    modal.classList.add('open')
}

const onModalButtonClick = (event) => {
    event.preventDefault()
    modalDataChangeAndOpen('Модальное окно', 'Created by Somron Kahbibov')
}

document.querySelector('div[class=modal-box]').addEventListener('click', (event) =>{
    event._isClickWithInModal = true
})

const onOutsideModalClick = (event) => {
    event.preventDefault()
    if (event._isClickWithInModal) return
    modal.classList.remove('open')
}

modalButton.addEventListener('click', onModalButtonClick)
modal.addEventListener('click', onOutsideModalClick)



// Подключение маски для номера телефона
const phoneNumberInput = document.querySelector('input[name=Phone]')
const maskOptions = {
    mask: '+{375} (00) 000-00-00'
}

const mask = IMask(phoneNumberInput, maskOptions);


const onButtonClick = (event) => {
    event.preventDefault()

    // Изменение бордеров
    resetErrorLabel(userNameError, inputBoxes[0])
    resetErrorLabel(emailError, inputBoxes[1])
    resetErrorLabel(phoneNumberError, inputBoxes[2])
    resetErrorLabel(messageError, inputBoxes[3])

    let userName = document.FormFill.Username.value
    let email = document.FormFill.Email.value
    let phoneNumber = mask.value
    let message = document.FormFill.Message.value
    let isValid = true

    if(isEmpty(userName)) {
        setErrorMessage(userNameError, "Заполните поле!", inputBoxes[0])
        isValid = false
    }
    if (isEmpty(email)) {
        setErrorMessage(emailError, "Заполните поле!", inputBoxes[1])
        isValid = false
    } else if (!isEmailValid(email)) {
        setErrorMessage(emailError, "Неправильный адрес электронной почты!", inputBoxes[1])
        isValid = false
    }

    if (isEmpty(phoneNumber)) {
        setErrorMessage(phoneNumberError, "Заполните поле!", inputBoxes[2])
        isValid = false
    }

    if (isEmpty(message)) {
        setErrorMessage(messageError, "Заполните поле!", inputBoxes[3])
        isValid = false
    }

    if (isValid) {
        const body = {
            name: userName,
            email: email,
            phone: phoneNumber,
            msg: message
        }
        const requestURL = 'http://localhost:9090/api/registration'
        // Отправка запроса и обработка ответов
        sendRequest('POST',requestURL, body)
            .then((data) => {
                console.log(data)
                document.querySelector('input[name=Username]').value = ""
                document.querySelector('input[name=Email]').value = ""
                mask.updateValue()
                document.querySelector('textarea[name=Message]').value = ""
                modalDataChangeAndOpen(data.status, data.message)

            }).catch((err) => {
                modalDataChangeAndOpen(err.status, err.message)
        })
    }
}
button.addEventListener('click', onButtonClick)