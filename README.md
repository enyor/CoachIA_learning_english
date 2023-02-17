# Coach AI for english learning using realtime Speech-To-Text

A small web application that seeks through the use of AI to improve the conversational skills of students, making use of AI algorithms such as speech-to-text can create a closed grammatical model that specifically evaluates the words or phrases of each exercise thus increasing the speed of processing and evaluation of the same.

The exercise is oriented to lead the student to not translate in his brain the words he sees on the screen, making use of the Neurolinguistics and Neuroplasticity program developed by Salvatore Marrone.

The objective of the test is to allow the evaluation of each exercise to be carried out autonomously by an AI algorithm and thus be able to massify this form of teaching through immersion, neurolinguistics and neuroplasticity.


## Install

Clone this repo
### Create env
python3 -m venv env
### Activate enviroment (Windows)
.\Scripts\activate

### Activate enviroment (Windows Power Shell)
 .\env\Scripts\Activate.ps1
### Activate enviroment (Linux)
source ./bin/activate

### Activate enviroment (Linux and fish)
source ./bin/activate.fish

### Install requirements
pip install -r ./requirements.txt

### Run in test mode
 python -m flask --app .\beta.py run

 or 

 python -m flask --app beta.py run -p 5001 -h 0.0.0.0

 or 

 python -m flask --app beta.py run -p 5001 -h 0.0.0.0 --cert <pathtocert>/fullchain.pem --key <pathtocert>/privkey.pem --reload 


 ## Usage

- Run app (before step)
- Execute video exercise
- Talk in Part 7
- Receive your score