const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const shapes = [
  'trapezoid',
  'pentagon',
  'oval',
  'heart',
  'rectangle',
  'triangle',
  'circle',
  'arrow',
  'square',
  'star' /* … */,
];
const grammar = `#JSGF V1.0; grammar shapes; public <shape> = ${shapes.join(
  ' | '
)};`;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

const bg = document.querySelector('html');
const hints = document.querySelector('.hints');
const rflist = [
  'Square',
  'Circle',
  'Rectangle',
  'Triangle',
  'Oval',
  'Star',
  'Square',
  'Pentagon',
  'Arrow',
  'Rectangle',
  'Trapezoid',
  'Heart',
  'Star',
  'Triangle',
  'Square',
  'Pentagon',
  'Arrow',
  'Heart',
  'Trapezoid',
  'Circle',
  'Rectangle',
  'Oval',
  'Arrow',
  'Square',
  'Pentagon',
  'Rectangle',
  'Square',
  'Oval',
  'Heart',
  'Square',
  'Circle',
  'Rectangle',
  'Triangle',
  'Star',
  'Pentagon',
  'Rectangle',
  'Trapezoid',
  'Heart',
  'Square',
  'Circle',
  'Rectangle',
  'Triangle',
  'Oval',
  'Star',
  'Square',
  'Pentagon',
  'Arrow',
  'Rectangle',
  'Trapezoid',
  'Circle',
  'Rectangle',
  'Triangle',
  'Trapezoid',
  'Square',
  'Star',
  'Oval',
  'Heart',
  'Square',
  'Pentagon',
  'Arrow',
  'Rectangle',
];

const rflistw = [];
let start = true;
let end = true;
let transcripts = null;

//--------------------------------------- WORK VARIABLES --------------------------------------------------//
const minPercentage = 0.6; //Minimal percentage for approval
const minConfidence = 0.87; //Minimal confidence for good capture
const evaluation_method = 2; // 1= Lineal simple; 2= Matrix resume; 3=confidence average
//--------------------------------------- END WORK VARIABLES --------------------------------------------------//

//Only for request permisions in start
recognition.start();
recognition.stop();

function onup(event) {
  if ((event.currentTime > 536.92) & start) {
    recognition.start();
    console.log('Ready to receive a shape command.');
    start = !start;
    document.querySelector('.on-air').classList.add('active');
    document.querySelector('.button-rfc').classList.add('disabled');
  }
  if ((event.currentTime > 644.95) & end) {
    console.log('Stop to receive words.');
    end = !end;
    document.querySelector('.on-air').classList.remove('active');
    recognition.stop();
  }
  // console.log(`time : ${event.currentTime}`);
}

function setRFC() {
  const video = document.querySelector('#video');
  video.currentTime = 526;
  video.play();
}

function restart() {
  const video = document.querySelector('#video');
  const finalData = document.querySelector('.final-data');
  const buttonRFC = document.querySelector('.button-rfc');
  finalData.classList.add('d-none');
  buttonRFC.classList.remove('disabled');
  video.style.display = null;
  video.currentTime = 0;
  start = !start;
  end = !end;
  video.play();
}

recognition.onresult = (event) => {
  const word = event.results[event.results.length - 1][0].transcript;
  const confidence = event.results[event.results.length - 1][0].confidence;
  // diagnostic.textContent = `Result received: ${color}.`;
  // bg.style.backgroundColor = color;
  // console.log(event.results);
  if (event.results[event.results.length - 1].isFinal) {
    console.log(`Result received: ${word}.`);
    console.log(`Result confidence: ${confidence}.`);
    if ((confidence < minConfidence) & rflist.includes(word.trim())) {
      rflistw.push(word.trim());
    }
    if (confidence > minPercentage) {
      document.querySelector('.indicator').classList.add('pass');
      setTimeout(() => {
        document.querySelector('.indicator').classList.remove('pass');
      }, 500);
    } else {
      document.querySelector('.indicator').classList.add('fail');
      setTimeout(() => {
        document.querySelector('.indicator').classList.remove('fail');
      }, 500);
    }
  }
  // console.log(`Confidence: ${event.results[0][0].confidence}`);
  transcripts = event.results;
};

recognition.onspeechend = (event) => {
  const video = document.querySelector('#video');
  video.pause();
  video.style.display = 'none';
  recognition.stop();
  console.log('speech ended');
  console.log(transcripts);
  document.querySelector('.final-data').classList.remove('d-none');
  document.querySelector('.on-air').classList.remove('active');
  //Method 1: Lineal simple
  if (evaluation_method === 1) {
    let points = 0;
    console.log('--------------------');
    console.log('EVALUATION METHOD: LINEAL SIMPLE');
    console.log(`Target words: ${rflist.length}.`);
    let words = [];
    if (transcripts != null) {
      for (let i = 0; i < transcripts.length; i++) {
        //Check if multiples words in same recognition
        if (!this.hasWhiteSpace(transcripts[i][0].transcript.trim())){
            words.push(transcripts[i][0].transcript);
        } else {
            wordsplit = transcripts[i][0].transcript.trim().split(' ');
            for (let i = 0; i < wordsplit.length; i++) {
                words.push(wordsplit[i]);
            }
        }
      }
    }

    for (let index = 0; index <= rflist.length; index++) {
      const str1 = rflist[index];
      const str2 = words[index];
      console.log(`comparing words: ${str1} vs ${str2}.`);
      if (words.length > 0 && typeof str2 !== 'undefined') {
        if (str1.trim().toLowerCase() === str2.trim().toLowerCase()) {
          points += 1;
        }
      }
    }
    console.log(`Total points: ${points}.`);

    const diagnostic = document.querySelector('.output');
    let accurancy = points / rflist.length;
    if (accurancy > minPercentage) {
      console.log(
        `Congratulations excersice approved with: ${accurancy * 100}%`
      );
      this.approved(points, accurancy);
    } else {
      console.log(`Oops excersice not approved with: ${accurancy * 100}%`);
      this.not_approved(points, accurancy, rflistw);
    }
  } else if (evaluation_method === 2) {
    console.log('--------------------');
    console.log('EVALUATION METHOD: MATRIX RESUME');

    let words = [];
    if (transcripts != null) {
      for (let i = 0; i < transcripts.length; i++) {
        //Check if multiples words in same recognition
        if (!this.hasWhiteSpace(transcripts[i][0].transcript.trim())){
            words.push(transcripts[i][0].transcript);
        } else {
            wordsplit = transcripts[i][0].transcript.trim().split(' ');
            for (let i = 0; i < wordsplit.length; i++) {
                words.push(wordsplit[i]);
            }
        }
      }
    }
    const uniques_shapes = [
      'Arrow',
      'Circle',
      'Heart',
      'Oval',
      'Pentagon',
      'Rectangle',
      'Square',
      'Star',
      'Trapezoid',
      'Triangle',
    ];
    let points = 0;
    for (let i = 0; i < uniques_shapes.length; i++) {
      points += this.count(uniques_shapes[i], words);
    }

    let accurancy = points / rflist.length;
    if (accurancy > minPercentage) {
      console.log(
        `Congratulations excersice approved with: ${accurancy * 100}%`
      );
      this.approved(points, accurancy);
    } else {
      console.log(`Oops excersice not approved with: ${accurancy * 100}%`);
      this.not_approved(points, accurancy, rflistw);
    }
  } else if (evaluation_method === 3) {
    console.log('--------------------');
    console.log('EVALUATION METHOD: CONFIDENCE AVERAGE');

    let words = [];
    if (transcripts != null) {
      for (let i = 0; i < transcripts.length; i++) {

        //Check if multiples words in same recognition
        if (!this.hasWhiteSpace(transcripts[i][0].transcript.trim())){
            words.push({
                word: transcripts[i][0].transcript,
                confidence: transcripts[i][0].confidence,
              });
        } else {
            wordsplit = transcripts[i][0].transcript.trim().split(' ');
            for (let i = 0; i < wordsplit.length; i++) {
                words.push({
                    word: wordsplit[i],
                    confidence: transcripts[i][0].confidence,
                });
            }
        }
      }
    }
    let points = 0;
    let count = 0;
    for (let i = 0; i < words.length; i++) {
      if (rflist.includes(words[i].word.trim().toLowerCase())) {
        points += words[i].confidence;
        count += 1;
      }
    }

    let accurancy = points / count;
    if (accurancy > minConfidence) {
      console.log(
        `Congratulations excersice approved with: ${accurancy * 100}%`
      );
      this.approved(points, accurancy);
    } else {
      console.log(`Oops excersice not approved with: ${accurancy * 100}%`);
      this.not_approved(points, accurancy, rflistw);
    }
  }
};

//--------------------------------------------- FUNCTIONS ------------------------------------------//

function approved(points, accurancy) {
  const diagnostic = document.querySelector('.output');
  const userPoints = document.querySelector('.user-points');
  const hitPercentage = document.querySelector('.hit-percentage');
  diagnostic.textContent =
    'Felicidades!!! has aprobado este ejercicio con una puntuación de ' +
    accurancy * 100 +
    '%.';
  userPoints.textContent = `${Number(points)} / ${rflist.length}`;
  hitPercentage.textContent = parseInt(accurancy * 100);
}

function not_approved(points, accurancy, elist) {
  const diagnostic = document.querySelector('.output');
  const userPoints = document.querySelector('.user-points');
  const hitPercentage = document.querySelector('.hit-percentage');
  if (elist.length > 0) {
    diagnostic.textContent =
      'Debes mejorar la pronunciación de las siguientes formas: ' +
      rflistw.toString();
  } else {
    diagnostic.textContent = 'Aún falta un poco más, sigue intentandolo!!!';
  }
  userPoints.textContent = `${Number(points)} / ${rflistw.length}`;
  hitPercentage.textContent = parseInt(accurancy * 100);
}

function count(shape, list) {
  var sum = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].trim().toLowerCase() === shape.trim().toLowerCase()) {
      sum = sum + 1;
    }
  }
  return sum;
}

function hasWhiteSpace(s) {
    return (/\s/).test(s);
}
//--------------------------------------------- END FUNCTIONS ------------------------------------------//

recognition.onerror = (event) => {
  console.log(`Speech recognition error detected: ${event.error}`);
  console.log(`Additional information: ${event.message}`);
};

recognition.onnomatch = (event) => {
  console.log("I didn't recognize that shape.");
};

recognition.onsoundend = () => {
  console.log("I didn't recognize more shapes");
};

recognition.end = () => {
  console.log('Recognition service has been stopped');
};
