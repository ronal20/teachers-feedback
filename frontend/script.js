const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const subject = document.getElementById('subject').value;
    const rating = document.getElementById('rating').value;
    const feedback = document.getElementById('feedback').value;
    const messageEl = document.getElementById('message');

    const data = {
        teacherName: name,
        subject: subject,
        rating: rating,
        feedbackText: feedback
    };

    fetch(API_URL + '/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        messageEl.className = 'message success';
        messageEl.innerHTML = 'Feedback submitted successfully!';
        document.getElementById('feedbackForm').reset();
        loadFeedback();
    })
    .catch(error => {
        messageEl.className = 'message error';
        messageEl.innerHTML = 'Error submitting feedback';
        console.log(error);
    });
});

function loadFeedback() {
    fetch(API_URL + '/feedback')
    .then(response => response.json())
    .then(data => {
        const feedbackList = document.getElementById('feedbackList');
        feedbackList.innerHTML = '';

        if (!data || data.length === 0) {
            feedbackList.innerHTML = '<p>No feedback yet</p>';
            return;
        }

        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            div.innerHTML = `
                <h3>${item.teacherName}</h3>
                <p><strong>Subject:</strong> ${item.subject}</p>
                <p><strong>Feedback:</strong> ${item.feedbackText}</p>
                <p><strong>Rating:</strong> ${item.rating}/5</p>
                <p><strong>Date:</strong> ${new Date(item.createdAt).toLocaleDateString()}</p>
                <button class="delete-btn" onclick="deleteFeedback('${item._id}')">Delete</button>
            `;
            feedbackList.appendChild(div);
        });
    })
    .catch(error => console.log(error));
}

function deleteFeedback(id) {
    if (confirm('Are you sure you want to delete this feedback?')) {
        fetch(API_URL + '/feedback?id=' + id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            loadFeedback();
        })
        .catch(error => console.log(error));
    }
}

window.onload = function() {
    loadFeedback();
};
