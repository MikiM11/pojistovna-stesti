const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

// Parsuje JSON data z requestů
app.use(express.json());

//PŘIPOJENÍ K MONGODB
mongoose.connect('mongodb+srv://heslodomongodb:heslodomongodb@cluster0.eehxpgw.mongodb.net/insuranceDB')
  .then(() => console.log('Připojeno k MongoDB'))
  .catch(err => console.error('Chyba připojení k MongoDB:', err));

//SCHÉMATA A MODELY
//schéma pro pojištěnce
const insuredSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  street: String,
  city: String,
  postalCode: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  insurances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Insurance' }] // Reference na pojištění
});

//schéma pro typ pojištění
const insuranceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true } // Název typu pojištění (např. "Pojištění majetku")
});

//schéma pro konkrétní pojistku
const insuranceSchema = new mongoose.Schema({
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'InsuranceType' }, // Reference na typ pojištění
  amount: Number,
  insured: { type: mongoose.Schema.Types.ObjectId, ref: 'Insured' },
  subject: String, // Předmět pojištění
  validFrom: Date, // Platnost od
  validTo: Date  // Platnost do
});

const Insured = mongoose.model('Insured', insuredSchema);
const Insurance = mongoose.model('Insurance', insuranceSchema);
const InsuranceType = mongoose.model('InsuranceType', insuranceTypeSchema);

// Endpointy pro pojištěnce
app.get('/api/insureds', async (req, res) => {
  try {
    const insureds = await Insured.find();
    res.json(insureds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/insureds/:id', async (req, res) => {
  try {
    const insured = await Insured.findById(req.params.id).populate('insurances');
    if (insured == null) {
      return res.status(404).json({ message: 'Pojištěnec nenalezen' });
    }
    res.json(insured);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/insureds', async (req, res) => {
  const insured = new Insured(req.body);
  try {
    const newInsured = await insured.save();
    res.status(201).json(newInsured);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/insureds/:id', async (req, res) => {
  try {
    const updatedInsured = await Insured.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedInsured == null) {
      return res.status(404).json({ message: 'Pojištěnec nenalezen' });
    }
    res.json(updatedInsured);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/insureds/:id', async (req, res) => {
  try {
    const deletedInsured = await Insured.findByIdAndDelete(req.params.id);
    if (deletedInsured == null) {
      return res.status(404).json({ message: 'Pojištěnec nenalezen' });
    }
    res.json({ message: 'Pojištěnec smazán' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpointy pro pojištění (CRUD)
app.get('/api/insurances', async (req, res) => {
  try {
    const insurances = await Insurance.find().populate('insured').populate('type');
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/insurances/:id', async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id).populate('insured').populate('type');
    if (insurance == null) {
      return res.status(404).json({ message: 'Pojištění nenalezeno' });
    }
    res.json(insurance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/insurances', async (req, res) => {
  const insurance = new Insurance(req.body);
  try {
    const newInsurance = await insurance.save();
    res.status(201).json(newInsurance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/insurances/:id', async (req, res) => {
  try {
    const updatedInsurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedInsurance == null) {
      return res.status(404).json({ message: 'Pojištění nenalezeno' });
    }
    res.json(updatedInsurance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/insurances/:id', async (req, res) => {
  try {
    const deletedInsurance = await Insurance.findByIdAndDelete(req.params.id);
    if (deletedInsurance == null) {
      return res.status(404).json({ message: 'Pojištění nenalezeno' });
    }
    res.json({ message: 'Pojištění smazáno' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpointy pro typy pojištění (CRUD)
app.get('/api/insuranceTypes', async (req, res) => {
  try {
    const insuranceTypes = await InsuranceType.find();
    res.json(insuranceTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/insuranceTypes/:id', async (req, res) => {
  try {
    const insuranceType = await InsuranceType.findById(req.params.id);
    if (insuranceType == null) {
      return res.status(404).json({ message: 'Typ pojištění nenalezen' });
    }
    res.json(insuranceType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/insuranceTypes', async (req, res) => {
  const insuranceType = new InsuranceType(req.body);
  try {
    const newInsuranceType = await insuranceType.save();
    res.status(201).json(newInsuranceType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/insuranceTypes/:id', async (req, res) => {
  try {
    const updatedInsuranceType = await InsuranceType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedInsuranceType == null) {
      return res.status(404).json({ message: 'Typ pojištění nenalezen' });
    }
    res.json(updatedInsuranceType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/insuranceTypes/:id', async (req, res) => {
  try {
    const deletedInsuranceType = await InsuranceType.findByIdAndDelete(req.params.id);
    if (deletedInsuranceType == null) {
      return res.status(404).json({ message: 'Typ pojištění nenalezen' });
    }
    res.json({ message: 'Typ pojištění smazán' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  });

app.listen(PORT, () => console.log("Server běží na portu", PORT));