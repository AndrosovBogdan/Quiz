let question_HTML = document.querySelector('.question')
let answers_HTML = document.querySelectorAll('.answer')
let main_HTML = document.getElementById('main')
let start_HTML = document.querySelector('.start')

start_HTML.addEventListener('click', function() {
    main_HTML.style.display = 'block'
    start_HTML.style.display = 'none'
    right_answers_HTML.style.transform = 'none'
    wrong_answers_HTML.style.transform = 'none'
    right_answers_HTML.textContent = 'Правильних відповідей: 0'
    wrong_answers_HTML.textContent = 'Неправильних відповідей: 0'
    accuracy_HTML.textContent = 'Точність: 0%'
    wrong_answers = 0
    right_answers = 0
    accuracy_HTML.style.top = '-60px'
    timer(30)    
    quiz_HTML.style.display = 'block'
})

function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min
}

let operators = ['+', '-', '*', '/']

function getRandomOperator() {
    return operators[Math.floor(Math.random() * operators.length)]
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) { 
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}


class Question {
    constructor() {
        let num1 = randint(1, 30)
        let num2 = randint(1, 30)
        let operator = getRandomOperator()

        if (operator == '/') {
            while (num1 % num2 != 0) { 
                num2 = randint(1, 30)
            }
        }

        this.question = `${num1} ${operator} ${num2}`

        let correctAnswer

        if (operator == '+') {
            correctAnswer = num1 + num2
        } else if (operator == '-') {
            correctAnswer = num1 - num2
        } else if (operator == '*') {
            correctAnswer = num1 * num2
        } else if (operator == '/') {
            correctAnswer = (num1 / num2)
        }

        let answersNotSuffled = [
            this.answer1 = randint(correctAnswer - 15, correctAnswer - 1),
            this.answer2 = randint(correctAnswer - 15, correctAnswer - 1),
            correctAnswer,
            this.answer3 = randint(correctAnswer - 15, correctAnswer - 1),
            this.answer4 = randint(correctAnswer - 15, correctAnswer - 1)
        ]

        this.correct = correctAnswer
        this.answers = shuffle(answersNotSuffled)
    }

    quiz() {
        question_HTML.textContent = this.question
        for (let i = 0; i < answers_HTML.length; i++) {
            answers_HTML[i].textContent = this.answers[i]
        }
    }
}

let isLocked = false
let current_question = new Question()
let right_answers_HTML = document.querySelector('.right-answers')
let wrong_answers_HTML = document.querySelector('.wrong-answers')
let right_answers = 0
let wrong_answers = 0

current_question.quiz()

for (let i = 0; i < answers_HTML.length; i++) {
    answers_HTML[i].addEventListener('click', function() {
        if (isLocked) return

        if (+answers_HTML[i].textContent == current_question.correct) {
            right_answers++
            right_answers_HTML.textContent = `Правильних відповідей: ${right_answers}`
            isLocked = true

            anime({
                targets: answers_HTML[i],
                backgroundColor: ['rgb(255, 255, 255)', 'rgb(16, 230, 48)'],
                duration: 400,
                easing: 'linear'
            })

            for (let y = 0; y < answers_HTML.length; y++) {  
                answers_HTML[y].style.pointerEvents = 'none'            
            }

            setTimeout(function() {
                current_question = new Question()

                for (let y = 0; y < answers_HTML.length; y++) {         
                    answers_HTML[y].style.backgroundColor = 'white'
                    answers_HTML[y].style.pointerEvents = 'auto'
                    answers_HTML[y].style.opacity = 1
                }

                current_question.quiz()
                isLocked = false
            }, 1200)
        } else {
            wrong_answers++
            wrong_answers_HTML.textContent = `Неправильних відповідей: ${wrong_answers}`

            answers_HTML[i].style.pointerEvents = 'none'
            answers_HTML[i].style.opacity = 0.8

            anime({
                targets: answers_HTML[i],
                backgroundColor: ['rgb(255, 255, 255)', 'rgb(255, 51, 51)'],
                duration: 400,
                easing: 'linear'
            })
        }
    })
}

let timer_HTML = document.querySelector('.timer') 
let quiz_HTML = document.getElementById('quiz')
let accuracy_HTML = document.querySelector('.accuracy')

function calculateAccuracy() {
    let totalAnswers = right_answers + wrong_answers
    if (totalAnswers > 0) {
        let accuracy = (right_answers / totalAnswers) * 100
        accuracy_HTML.textContent = `Точність: ${accuracy.toFixed(2)}%`
    } else {
        accuracy_HTML.textContent = 'Точність: 0%'
    }
}

function timer(duration) {
    let timeLeft = duration
    timer_HTML.textContent = timeLeft

    function updateTimer() {
        timeLeft--
        timer_HTML.textContent = timeLeft

        if (timeLeft > 0) {
            setTimeout(updateTimer, 1000)
        } else {
            timer_HTML.textContent = 'Час вийшов!'
            quiz_HTML.style.display = 'none'

            anime({
                targets: right_answers_HTML,
                translateY: '280px',
                duration: 600,
                easing: 'easeInQuad',
                complete: function() {
                    anime({
                        targets: right_answers_HTML,
                        translateX: '60px',
                        duration: 150,
                        easing: 'linear',
                        complete: function() {
                            anime({
                                targets: right_answers_HTML,
                                scale: 1.4,
                                duration: 150,
                                easing: 'linear'
                            })
                        }
                    })
                }
            })

            anime({
                targets: wrong_answers_HTML,
                translateY: '280px',
                duration: 600,
                easing: 'easeInQuad',
                complete: function() {
                    anime({
                        targets: wrong_answers_HTML,
                        translateX: '-60px',
                        duration: 150,
                        easing: 'linear',
                        complete: function() {
                            anime({
                                targets: wrong_answers_HTML,
                                scale: 1.4,
                                duration: 150,
                                easing: 'linear'
                            })
                        }
                    })
                }
            })

            setTimeout( function() {
                calculateAccuracy()

                anime({
                targets: accuracy_HTML,
                top: '210px',
                duration: 450,
                easing: 'easeInQuad'
                })

                start_HTML.style.display = 'block'
                start_HTML.style.margin = '310px auto'

                for (let y = 0; y < answers_HTML.length; y++) {         
                    answers_HTML[y].style.backgroundColor = 'white'
                    answers_HTML[y].style.pointerEvents = 'auto'
                    answers_HTML[y].style.opacity = 1
                }
            }, 1400)            
        }
    }

    setTimeout(updateTimer, 1000)
}