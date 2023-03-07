const birdsDataRu = require("./DB")
const birdsDataEn = require("./DBen")

const isLocalStorage = () => {
  return localStorage.getItem('language') ? true : false
}
const languageStorage = () => {
  let value = localStorage.getItem('language')
  
  if(value === "ru"){
    return birdsDataRu
  } else {
    return birdsDataEn
  }
}

let birdsData = isLocalStorage() ? languageStorage() : birdsDataRu;


const menuOptions = [];
let generalPoints = 0;
let step = {
  index: 0,
  questionId: 0,
  questionData: {
    defaultImage: "https://via.placeholder.com/200x150",
    defaultName: "******",
    image: "",
    name: "",
    audio: ""
  },
  optionsList: [],
  viewedOption: null,
  isButtonActive: false,
  points: 5
};

const shuffle = function(array) {
  // from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const birdsDataShuffled = shuffle(birdsData)

birdsDataShuffled.map(element => {
  switch(element[0].name) {
    case 'Ворон':
      menuOptions.push("Лесные птицы")
    break;
    case 'Воробей':
      menuOptions.push("Воробьиные")
    break;
    case 'Зяблик':
      menuOptions.push("Певчие птицы")
    break;
    case 'Жаворонок':
      menuOptions.push("Сухопутные птицы")
    break;
    case 'Орёл':
      menuOptions.push("Хищные птицы")
    break;
    case 'Альбатрос':
      menuOptions.push("Морские птицы")
    break;
    case 'Raven':
      menuOptions.push("Forest birds")
    break;
    case 'Sparrow':
      menuOptions.push("Sparrows")
    break;
    case 'Finch':
      menuOptions.push("Songbirds")
    break;
    case 'Lark':
      menuOptions.push("Land birds")
    break;
    case 'Eagle':
      menuOptions.push("Birds of prey")
    break;
    case 'Albatross':
      menuOptions.push("Seabirds")
    break;
  }
})

const setQuestionId = (max) => {
  const randomNumber = Math.floor(Math.random() * max);
  step.questionId = birdsDataShuffled[step.index][randomNumber].id;
  step.questionData.audio = birdsDataShuffled[step.index][randomNumber].audio;
  step.questionData.image = birdsDataShuffled[step.index][randomNumber].image;
  step.questionData.name = birdsDataShuffled[step.index][randomNumber].name;
}

const setOptionsList = () => {
  step.optionsList = birdsDataShuffled[step.index]
};

const getViewedBlock = () => {
  if (step.viewedOption) {
    return `<div class="answer__row_description">
              <img class="birdie__img birdie__img--viewed" src="${step.viewedOption.image}" alt="birdie">

              <div class="birdie__group_description">
                <div class="birdie__name birdie__name--viewed">${step.viewedOption.name}</div>
                <div class="birdie__latinize">${step.viewedOption.species}</div>
                <div class="birdie__audio-player birdie__audio-player--viewed">
                  <audio
                    controls
                    src="${step.viewedOption.audio}">
                  </audio>
                </div>
              </div>
            </div>

          <div class="answer__info">${step.viewedOption.description}</div>`
  } else {
    return `<p class="instruction"><span>Послушайте плеер. Выберите птицу из списка</span></p>`
  }
}

const setViewedBlock = () => {
  document.querySelector(".answer__description").innerHTML = getViewedBlock();
}

const onOptionClick = e => {
  if (step.isButtonActive) {
    return;
  }

  const element = e.target.closest(".answer__item");
  const elementId = +element.getAttribute('data-id');
  step.viewedOption = birdsDataShuffled[step.index].find(options => options.id === elementId);
  setViewedBlock();
  if (elementId === step.questionId) {
    if (!element.classList.contains('valid')) {
      winPlayer()
    }
    element.classList.add("valid");
    step.isButtonActive = true;
    document.querySelector(".birdie__img--curd").setAttribute("src", step.questionData.image);
    document.querySelector(".birdie__name--curd").innerHTML = step.questionData.name;
    document.querySelector('.btn').removeAttribute("disabled");
    
  } else {
    if (!element.classList.contains('invalid')) {
      step.points--;
      errorPlayer()
    }
    element.classList.add("invalid");
  }
}

const onButtonClick = () => {
  if (step.index === birdsDataShuffled.length - 1) {
    renderScopeTotal()
    return;
  }
  step.index++;
  document.querySelector('.btn').setAttribute("disabled", true);
  generalPoints += step.points;
  document.querySelector(".scope").innerHTML = `Scope: ${generalPoints}`
  step.points = 5;
  step.viewedOption = null;
  step.isButtonActive = false;
  computedValues();
  document.querySelector(".birdie__img--curd").setAttribute("src", step.questionData.defaultImage);
  document.querySelector(".birdie__name--curd").innerHTML = step.questionData.defaultName;
  renderItemCurd();
}

const renderStepsMenuHtml = () => {
  const stepsMenu =  document.querySelector('.question__menu');
  const stepsMenuItems = menuOptions.map((element, index) =>{
    return `<li class="question__item" data-uid="${index}"><a href="#" class="question__link">${element}</a></li>`
  }).join('');
  stepsMenu.innerHTML = stepsMenuItems;
  setTimeout(() => {
    const stepsItem =  document.querySelectorAll(".question__item");
    stepsItem.forEach(item => {
      const trackerUid = +item.getAttribute('data-uid')
      if(trackerUid === step.index){
        item.classList.add("active");
      }
    })
  }, 100 )
}


const renderItemCurd = () => {
  const item = `<img class="birdie__img birdie__img--curd" src="${step.questionData.defaultImage}" alt="birdie">
                <div class="birdie__group">
                  <div class="birdie__name birdie__name--curd">${step.questionData.defaultName}</div>
                  <div class="birdie__audio-player birdie__audio-player--curd">
                    <audio
                      controls
                      src="${step.questionData.audio}">
                    </audio>
                  </div>
                </div>`

  document.querySelector(".curd").innerHTML = item;
}

const renderAnswerOptions = () => {
  const answerOptions = birdsDataShuffled[step.index].map((element) =>{
    return `<li class="answer__item" data-id="${element.id}"><span class="answer__btn"></span>${element.name}</li>`
  }).join('');
  const answerMenu = document.querySelector('.answer__menu');
  setTimeout(() => {
    const answerItems =  document.querySelectorAll(".answer__item");
    answerItems.forEach(item => {
      item.addEventListener("click", onOptionClick);
    })
  }, 100 ) 
  
  answerMenu.innerHTML = answerOptions;
}

const renderScopeTotal = () => {
  const scopeTotal = document.querySelector(".main")
  const scopeTotalOption = `<div class="scope">
    <h1 class="h1">Поздарвляем!</h1>
    <h3 class="h3">Вы прошли викторину и набрали ${generalPoints} из 30 возможных баллов</h3>
    <div class="position__btn">
      <a class="btn" href="./index.html" >Попробовать еще раз!</a>
    </div>
    </div>`

  scopeTotal.innerHTML = scopeTotalOption
}

const winPlayer = () => {
  let winAudio = document.querySelector(".win");
  winAudio.play();
}

const errorPlayer = () => {
  let errorAudio = document.querySelector(".error");
  errorAudio.play();
}
const renderHtml = () => {
  renderStepsMenuHtml();
  renderAnswerOptions();
  setViewedBlock();
  document.querySelector(".btn").addEventListener("click", onButtonClick)
}

const computedValues = () => {
  setQuestionId(birdsDataShuffled[step.index].length);
  setOptionsList();
  renderHtml();
};

computedValues();
renderItemCurd();

const langRu = document.querySelector(".ru")
const langEn = document.querySelector(".en")

langRu.addEventListener("click", () => {
  localStorage.setItem('language', "ru")
  document.location.reload()
})
langEn.addEventListener("click", () => {
  localStorage.setItem('language', "en")
  document.location.reload()
})
