const OPENAI_API_KEY = 'sk-your-key-here'; // replace with your own secret key

function saveEntry() {
  const date = document.getElementById('date').value;
  const timeIn = document.getElementById('timeIn').value;
  const timeOut = document.getElementById('timeOut').value;
  const activity = document.getElementById('activity').value;
  const transpoTo = document.getElementById('transpoTo').value || 0;
  const transpoFrom = document.getElementById('transpoFrom').value || 0;
  const food = document.getElementById('food').value || 0;
  const foodFree = document.getElementById('foodFree').checked;
  const aiSummary = document.getElementById('aiSummary').textContent;

  if (!date || !timeIn || !timeOut || !activity) {
    alert("Please complete all required fields.");
    return;
  }

  const entry = {
    date,
    timeIn,
    timeOut,
    activity,
    transpoTo,
    transpoFrom,
    food,
    foodFree,
    aiSummary
  };

  const stored = JSON.parse(localStorage.getItem('ojtEntries')) || [];
  stored.unshift(entry);
  localStorage.setItem('ojtEntries', JSON.stringify(stored));

  renderLogs();
  clearInputs();
}

function renderLogs() {
  const container = document.getElementById('logContainer');
  container.innerHTML = '';

  const stored = JSON.parse(localStorage.getItem('ojtEntries')) || [];

  if (stored.length === 0) {
    container.innerHTML = 'No entries yet.';
    return;
  }

  stored.forEach(entry => {
    const summary =
      `📅 Date: ${entry.date}
🕒 Time: ${entry.timeIn} to ${entry.timeOut}
📝 Activity: ${entry.activity}
🚌 Transpo - To: ₱${entry.transpoTo}, From: ₱${entry.transpoFrom}
🍽️ Food: ${entry.foodFree ? "Free" : `₱${entry.food}`}
🤖 AI Summary: ${entry.aiSummary || "—"}`;

    const div = document.createElement('div');
    div.style.marginBottom = '20px';
    div.textContent = summary;

    container.appendChild(div);
  });
}

function clearInputs() {
  document.getElementById('date').value = '';
  document.getElementById('timeIn').value = '';
  document.getElementById('timeOut').value = '';
  document.getElementById('activity').value = '';
  document.getElementById('transpoTo').value = '';
  document.getElementById('transpoFrom').value = '';
  document.getElementById('food').value = '';
  document.getElementById('foodFree').checked = false;
  document.getElementById('aiSummary').textContent = '';
}

async function generateSummary() {
  const activity = document.getElementById('activity').value;
  const output = document.getElementById('aiSummary');

  if (!activity) {
    alert('Please enter your activity description.');
    return;
  }

  output.textContent = '⏳ Summarizing...';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes OJT daily activities for a report.'
          },
          {
            role: 'user',
            content: `Summarize this activity professionally: ${activity}`
          }
        ]
      })
    });

    const data = await response.json();
    const summary = data.choices[0].message.content;
    output.textContent = summary;
  } catch (error) {
    output.textContent = '⚠️ Failed to fetch AI summary.';
    console.error(error);
  }
}

window.onload = renderLogs;
