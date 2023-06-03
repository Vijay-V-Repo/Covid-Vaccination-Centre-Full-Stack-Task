const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const centreRoutes = require('./routes/centres');
const adminRoutes = require('./routes/admin');

const app = express();
const path = require('path'); 
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/vaccination_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Connection to MongoDB : Established'); 
    seedDatabase();
}).catch((error) => console.error('Failed to connect to MongoDB', error));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/centres', centreRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});


// Seeding the Database 
const seedDatabase = async () => {
    const User = require('./models/user');
    const VaccinationCentre = require('./models/vaccinationCentre');
  
    await User.deleteMany();
    await User.insertMany([
      { 
        username: 'Ajay', 
        password: 'pass1' 
      },
      { username: 'Vijay', 
        password: 'pass2' ,
        isadmin: true
      },
      { username: 'Karthik', 
        password: 'pass3' 
      },
      { username: 'Ramu', 
        password: 'pass4' 
      },
    ]);
  
    await VaccinationCentre.deleteMany();
    await VaccinationCentre.insertMany([
      { 
        name: 'Government Hospital, Salem', 
        workingHours: '10:00 AM - 4:30 PM', 
        capacity: 10 
      },
      { name: 'Government Hospital, Karur', 
        workingHours: '8:00 AM - 4:30 PM', 
        capacity: 10 
      },
      { 
        name: 'Loyal Care, Trichy', 
        workingHours: '8:00 AM - 5:00 PM', 
        capacity: 10
      },
      { name: 'Central Healthcare Center, Madurai', 
        workingHours: '8:30 AM - 4:00 PM', 
        capacity: 10 
      },
      { 
        name: 'Texcity club centre, Salem', 
        workingHours: '10:00 AM - 5:00 PM', 
        capacity: 10 
      },
      { name: 'General Medical Center, Coimbatore', 
        workingHours: '11:00 AM - 4:00 PM', 
        capacity: 10 
      },
      { 
        name: 'Government Hospital, Erode', 
        workingHours: '9:00 AM - 5:00 PM', 
        capacity: 10 
      },
      { name: 'Richmond club centre, Salem', 
        workingHours: '8:00 AM - 4:00 PM', 
        capacity: 10 
      },
      { 
        name: 'Government Hospital, Theni', 
        workingHours: '9:00 AM - 5:00 PM', 
        capacity: 10 
      },
      { name: 'Centre of Medicine, Salem', 
        workingHours: '10:00 AM - 3:00 PM', 
        capacity: 10 
      },
    ]);
    console.log('Seeded the database.');
};
  