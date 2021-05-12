/* global tm */
var media = document.querySelector('video')
media.classList.add("hidden")
var controls = document.querySelector('.controls')


function playPauseMedia () {
  if (media.paused) {
    play.setAttribute('data-icon', 'u')
    media.play()
  } else {
    play.setAttribute('data-icon', 'P')
    media.pause()
  }
}
// stop.addEventListener('click', stopMedia)
media.addEventListener('ended', stopMedia)
function stopMedia () {
  media.pause()
  media.currentTime = 0
  play.setAttribute('data-icon', 'P')
}

const mainEl = document.querySelector('#container')

const wizard = new tm.Wizard({
  introduction: {
    title: tm.html`让我们用动作控制人物的动作吧！`,
    description: tm.html`点击 "开始", 准备看着摄像头哈`,
  },
  classes: [
    {
      name: '选择你想要的向左动作，比如',
      title: '“记录你的动作',
      description: '一直按着这个按钮，直到至少收集20张图片',
    },
    {
      name: '选择你想要的暂停动作，比如握拳',
      title: '记录你的动作.',
      description: '一直按着这个按钮，直到至少收集20张图片.',
    },
    {
      name: '什么都不做',
      title: '记录你的动作.',
      description: '一直按着这个按钮，直到至少收集20张图片.',
    },
  ],
  onLoad: () => {
    console.log('model has loaded')
  },
  onPrediction: (predictions) => {
    const images = document.querySelectorAll('.prediction-image')
    let highestProb = Number.MIN_VALUE
    let highestIndex = -1
    predictions.forEach((pred, i) => {
      if (pred.probability > highestProb) {
        highestProb = pred.probability
        highestIndex = i
      }
    })
    if (highestIndex == 0) {
      if (media.paused) {
        media.play()
        media.classList.remove("hidden")
      }
    }
    if (highestIndex == 1) {
      if (media.played) {
        media.pause()
        media.classList.add("hidden")
      }
    }
    if (highestIndex == 2) {
      //什么都不做
    }

    images.forEach((img, i) => {
      if (i === highestIndex) {
        img.classList.remove('hidden')
      } else {
        img.classList.add('hidden')
      }
    })
  },
  onSampleAdded: (added) => {
    console.log(added)
  },
  onTrain: () => console.log('train begins'),
  onReady: () => {

    const inferenceCamera = wizard.createInferenceCamera({
      size: 270,
    })
    const cameraContainer = document.querySelector(
      '#inference-camera-container'
    )
    cameraContainer.appendChild(inferenceCamera)
    mainEl.classList.add('ready')
  },
})

document
  .querySelector('#train-model-button')
  .addEventListener('click', () => wizard.open())
var sheet = new CSSStyleSheet()
sheet.replaceSync(`ta-card {
    width: 1024px;
  }`)
// host.shadowRoot.adoptedStyleSheets = [sheet]