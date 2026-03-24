const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    teacherName: String,
    subject: String,
    rating: Number,
    feedbackText: String,
    createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', schema);

module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.end();

    if (!process.env.MONGODB_URI) {
        return res.status(500).json({ error: 'Database not configured' });
    }

    mongoose.connect(process.env.MONGODB_URI, { 
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
    }).then(() => {
        if (req.method === 'GET'){ 
            return Feedback.find().sort({ createdAt: -1 }).then(d => res.json(d));
        }
        if (req.method === 'POST'){ 
            return new Feedback(req.body).save().then(d => res.json(d));
        }
        if (req.method === 'DELETE'){ 
            return Feedback.findByIdAndDelete(req.query.id).then(d => res.json(d));
        }
    }).catch(e => {
        console.error(e);
        res.status(500).json({ error: 'Database error' });
    });
}
