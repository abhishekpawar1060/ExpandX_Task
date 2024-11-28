const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const escapeHtml = require('escape-html');  
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());  
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect('mongodb://127.0.0.1:27017/registrationDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  });

  const registrationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    occupation: { type: String, required: true },
    organization: { type: String, required: false }, 
    education: { type: String, required: false },    
    skills: { type: String, required: false },      
    maritalStatus: { type: String, required: false }, 
    languagesKnown: { type: String, required: false }, 
    hobbies: { type: String, required: false },      
    linkedinProfile: { type: String, required: false }, 
    githubProfile: { type: String, required: false },  
    personalWebsite: { type: String, required: false }, 
    emergencyContactName: { type: String, required: true },
    emergencyContactPhone: { type: String, required: true },
    comment: { type: String, required: false },
  });
  
const Registration = mongoose.model('Registration', registrationSchema);
  
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match.');
    }

    const registration = new Registration(req.body);
    await registration.save();
    res.redirect('/report'); 
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data.');
  }
});
app.get('/report', async (req, res) => {
    try {
      const registration = await Registration.findOne().sort({ _id: -1 });
  
      if (!registration) {
        res.send('<h1>No registration found</h1>');
        return;
      }
  
      let reportHtml = `<h1>Registration Report</h1>
        <h2>Registration for ID: ${escapeHtml(registration._id)}</h2>
        <table border="1" cellpadding="10" style="margin: 20px auto; width: 90%; background-color: #f9f9f9;">
          <tbody>
            <tr><th>Name:</th><td>${escapeHtml(registration.fullName)}</td></tr>
            <tr><th>Email:</th><td>${escapeHtml(registration.email)}</td></tr>
            <tr><th>Phone Number:</th><td>${escapeHtml(registration.phoneNumber)}</td></tr>
            <tr><th>Date of Birth:</th><td>${escapeHtml(registration.dob)}</td></tr>
            <tr><th>Gender:</th><td>${escapeHtml(registration.gender)}</td></tr>
            <tr><th>Address:</th><td>${escapeHtml(registration.address)}</td></tr>
            <tr><th>City:</th><td>${escapeHtml(registration.city)}</td></tr>
            <tr><th>State:</th><td>${escapeHtml(registration.state)}</td></tr>
            <tr><th>Country:</th><td>${escapeHtml(registration.country)}</td></tr>
            <tr><th>Zip Code:</th><td>${escapeHtml(registration.zipCode)}</td></tr>
            <tr><th>Occupation:</th><td>${escapeHtml(registration.occupation)}</td></tr>
            <tr><th>Organization:</th><td>${escapeHtml(registration.organization || 'N/A')}</td></tr>
            <tr><th>Education:</th><td>${escapeHtml(registration.education || 'N/A')}</td></tr>
            <tr><th>Skills:</th><td>${escapeHtml(registration.skills || 'N/A')}</td></tr>
            <tr><th>Marital Status:</th><td>${escapeHtml(registration.maritalStatus || 'N/A')}</td></tr>
            <tr><th>Languages Known:</th><td>${escapeHtml(registration.languagesKnown || 'N/A')}</td></tr>
            <tr><th>Hobbies:</th><td>${escapeHtml(registration.hobbies || 'N/A')}</td></tr>
            <tr><th>LinkedIn Profile:</th><td>${escapeHtml(registration.linkedinProfile || 'N/A')}</td></tr>
            <tr><th>GitHub Profile:</th><td>${escapeHtml(registration.githubProfile || 'N/A')}</td></tr>
            <tr><th>Personal Website:</th><td>${escapeHtml(registration.personalWebsite || 'N/A')}</td></tr>
            <tr><th>Emergency Contact Name:</th><td>${escapeHtml(registration.emergencyContactName)}</td></tr>
            <tr><th>Emergency Contact Phone:</th><td>${escapeHtml(registration.emergencyContactPhone)}</td></tr>
            <tr><th>Comment:</th><td>${escapeHtml(registration.comment || 'N/A')}</td></tr>
          </tbody>
        </table>`;
  
      res.send(reportHtml);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data.');
    }
});
  
  
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
