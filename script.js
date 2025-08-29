function setPercentage(percent) {
    const circle = document.querySelector('.circle-progress');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    document.querySelector('.percentage').textContent = percent + '%';
}

async function streamText(text, outputId, speed = 20) {
    const output = document.getElementById(outputId);
    output.textContent = ""; // Clear previous text

    for (let i = 0; i < text.length; i++) {
        output.textContent += text[i];
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}





async function Analyze() {
    
  const code = document.getElementById("UserCode").value

  document.getElementById("output").innerText = "AI is analyzing your Code... Please wait"


  try{
    //put your link here
    const res = await fetch(" https://ai-backend-2snf.onrender.com/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }), 
  });

  const data = await res.json();
  const ans = data.msg


  const [percentLine, ...textLines] = ans.split('\n');

// Remove '%' and trim spaces
const percent = percentLine.replace('%','').trim(); // "75"

// Trim leading spaces from all text lines
  const text = textLines.map(line => line.trimStart()).join('\n');

  setPercentage(percent)

streamText(text, 'output', 10);


  }
  catch(e){
      document.getElementById("output").innerText = "AI is unable to analyze code at this moment"
      setPercentage(0)
  }
      

  
}

window.Analyze = Analyze