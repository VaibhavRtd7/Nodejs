
const timerValue = 2 * 60 * 60;
let timeLeft = timerValue;
let timeInterval = null;

function format(seconds) {
    const h = String(Math.floor(seconds / (60 * 60))).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600 ) / 60)).padStart(2, "0");
    const s = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${h}:${m}:${s}`
}

document.getElementById('startBtn').addEventListener('click', function() {
     
    if(this.innerText == 'Start Again') {
        timeLeft = timerValue;
        document.getElementById('timer').innerText = format(timeLeft);
        this.innerText = "Start";
    }

    this.disabled = true;
      
    let timeInterval = setInterval(() => {
        
        timeLeft--;
        document.getElementById('timer').innerText = format(timeLeft);

        if(timeLeft <= 0) {
          clearInterval(timeInterval);
          document.getElementById('timer').innerText = "Time is completed!";
          document.getElementById('startBtn').innerText = "Start Again";
          this.disabled = false;
        }
    }, 1000)

})

