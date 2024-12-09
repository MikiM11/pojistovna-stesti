//API PRO SPRÁVU POJIŠTĚNÍ - SERVEROVÁ ČÁST

const express = require("express");
const cors = require("cors"); // Import cors
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;

// Parsuje JSON data z requestů
app.use(express.json());
app.use(cors()); // Použití cors middleware

//PŘIPOJENÍ K MONGODB
//beží na MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://heslodomongodb:heslodomongodb@cluster0.eehxpgw.mongodb.net/insuranceDB"
  )
  .then(() => console.log("Připojeno k MongoDB"))
  .catch((err) => console.error("Chyba připojení k MongoDB:", err));

//SCHÉMATA A MODELY
//schéma pro pojištěnce
//SCHÉMATA A MODELY
//schéma pro pojištěnce
const insuredSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Vyplňte jméno."], // Jméno
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Vyplňte příjmení."], // Příjmení
    trim: true,
  },
  street: { type: String, required: [true, "Vyplňte název ulice."], // Ulice
    trim: true,
   },
  city: {
    type: String,
    required: [true, "Vyplňte město."], // Město
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, "PSČ je povinné."], // PSČ
    trim: true,
    match: [/^\d{5}$/, "PSČ musí obsahovat přesně 5 číslic."], // Validace PSČ
  },
  email: {
    type: String,
    required: [true, "Výplňte email."], // Email
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email má nesprávný formát.", // Validace formátu emailu
    ],
  },
  phone: {
    type: String,
    required: [true, "Vyplňte telefonní číslo"], // Povinné pole
    trim: true,
    match: [
      /^\+?[0-9\s\-()]{7,15}$/,
      "Telefonní číslo není ve správném formátu).", // Validace čísla
    ],
  },
  insurances: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Insurance" }, // Reference na pojištění
  ],
});

//schéma pro typ pojištění
const insuranceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Název typu pojištění (např. "Pojištění vozidla")
});

//schéma pro konkrétní pojistku
const insuranceSchema = new mongoose.Schema({
  type: { type: mongoose.Schema.Types.ObjectId, ref: "InsuranceType" }, // Reference na typ pojištění
  amount: { type: Number, required: true }, // Pojištěná částka
  insured: { type: mongoose.Schema.Types.ObjectId, ref: "Insured" }, // Reference na pojištěnce
  subject: { type: String, required: true }, // Předmět pojištění - např. "Byt"
  validFrom: { type: Date, required: true }, // Platnost od
  validTo: { type: Date, required: true }, // Platnost do
});

const Insured = mongoose.model("Insured", insuredSchema);
const Insurance = mongoose.model("Insurance", insuranceSchema);
const InsuranceType = mongoose.model("InsuranceType", insuranceTypeSchema);

//ENDPOINTY API
// Endpointy pro pojištěnce

/// Vrátí pojištěnce s podporou filtrování a stránkování
app.get("/api/insureds", async (req, res) => {
  try {
    const { firstName, lastName, street, city, postalCode, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (firstName) filter.firstName = { $regex: firstName, $options: "i" };
    if (lastName) filter.lastName = { $regex: lastName, $options: "i" };
    if (street) filter.street = { $regex: street, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (postalCode) filter.postalCode = { $regex: postalCode, $options: "i" };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const offset = (pageNum - 1) * limitNum;

    const insureds = await Insured.find(filter)
      .skip(offset)
      .limit(limitNum)
      .populate({
        path: "insurances", // Načte pojištění z jiné kolekce
        populate: { path: "type" }, // Načte typ pojištění
      });

    const totalRecords = await Insured.countDocuments(filter); // Celkový počet záznamů
    const totalPages = Math.ceil(totalRecords / limitNum); // Celkový počet stránek

    res.json({
      data: insureds, // Kompletní pojištěnci s detaily pojištění
      totalPages,
      totalRecords,
    });
  } catch (err) {
    console.error("Chyba při načítání pojištěnců:", err);
    res.status(500).json({ message: "Chyba při načítání pojištěnců." });
  }
});

// Vrátí detaily pojištěnce podle ID
app.get("/api/insureds/:id", async (req, res) => {
  try {
    // Načte pojištěnce podle ID a populací jeho pojištění
    const insured = await Insured.findById(req.params.id).populate({
      path: "insurances", // Načte pojištění
      populate: { path: "type" }, // Načte typ pojištění
    });

    // Pokud pojištěnec neexistuje, vrátí 404
    if (!insured) {
      return res.status(404).json({ message: "Pojištěnec nenalezen" });
    }

    // Vrátí detail pojištěnce
    res.json(insured);
  } catch (err) {
    console.error("Chyba při načítání detailů pojištěnce:", err);
    res.status(500).json({ message: "Nepodařilo se načíst data pojištěnce." });
  }
});

// Přidání nového pojištěnce
app.post("/api/insureds", async (req, res) => {
  try {
    const newInsured = new Insured(req.body); // Vytvoří nový dokument z dat v těle požadavku
    await newInsured.save(); // Uloží do databáze

    res.status(201).json(newInsured); // Vrátí uložený dokument s kódem 201 (Created)
  } catch (err) {
    console.error("Chyba při přidávání pojištěnce:", err);
    res.status(400).json({ message: err.message }); // Vrátí chybu
  }
});

// Aktualizuje pojištěnce podle ID
app.put("/api/insureds/:id", async (req, res) => {
  try {
    const updatedInsured = await Insured.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedInsured == null) {
      return res.status(404).json({ message: "Pojištěnec nenalezen" });
    }
    res.json(updatedInsured);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Smaže pojištěnce podle ID
app.delete("/api/insureds/:id", async (req, res) => {
  try {
    const deletedInsured = await Insured.findByIdAndDelete(req.params.id);
    if (deletedInsured == null) {
      return res.status(404).json({ message: "Pojištěnec nenalezen" });
    }
    res.json({ message: "Pojištěnec smazán" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpointy pro pojištění

// Vrátí pojištění s podporou filtrování a stránkování
app.get("/api/insurances", async (req, res) => {
  try {
    const { type, insuredName, page = 1, limit = 10 } = req.query;

    // Filtr pro vyhledávání
    const filter = {};

    // Filtrování podle typu pojištění
    if (type && mongoose.Types.ObjectId.isValid(type)) { // Ověření, zda je ID validní ObjectId - musí být ObjectId, jinak se neprovede filtr
      filter.type = type; // Předpokládá validní ObjectId
    }

    // Filtrování podle jména pojištěnce
    if (insuredName) {
      const insureds = await Insured.find({
        $or: [
          { firstName: { $regex: insuredName, $options: "i" } }, // Hledá v poli `firstName` s daným regulárním výrazem i znamená, že je to case-insensitive
          { lastName: { $regex: insuredName, $options: "i" } },
        ],
      }).select("_id");
      filter.insured = { $in: insureds.map((insured) => insured._id) };
    }

    // Stránkování
    const pageNum = parseInt(page, 10); // Číslo stránky
    const limitNum = parseInt(limit, 10); // Limit záznamů na stránku
    const offset = (pageNum - 1) * limitNum; // Offset pro stránkování - počet záznamů, které se mají přeskočit

    // Načtení pojištění
    const insurances = await Insurance.find(filter)
      .skip(offset)
      .limit(limitNum)
      .populate("insured")
      .populate("type");

    // Celkový počet záznamů
    const totalRecords = await Insurance.countDocuments(filter); // Počet záznamů dle filtru
    const totalPages = Math.ceil(totalRecords / limitNum); // Celkový počet stránek

    // Odpověď
    res.json({
      data: insurances,
      totalPages,
      totalRecords,
    });
  } catch (err) {
    console.error("Chyba při načítání pojištění:", err);
    res.status(500).json({ message: "Chyba při načítání pojištění." });
  }
});

// Vytvoří novou pojistku
// Endpoint pro přidání pojištění
app.post("/api/insurances", async (req, res) => {
  try {
    // Vytvoření nového pojištění
    const newInsurance = await Insurance.create(req.body);

    // Aktualizace pojištěnce - přidání ID pojištění
    await Insured.findByIdAndUpdate(req.body.insured, {
      $push: { insurances: newInsurance._id },
    });

    res.status(201).json(newInsurance);
  } catch (error) {
    console.error("Chyba při přidávání pojištění:", error);
    res.status(500).json({ message: "Chyba při přidávání pojištění." });
  }
});

// Endpoint pro úpravu pojištění
app.put("/api/insurances/:id", async (req, res) => {
  try {
    // Najdeme původní pojištění
    const oldInsurance = await Insurance.findById(req.params.id);

    // Pokud se změnil pojištěnec, aktualizujeme propojení
    if (oldInsurance.insured.toString() !== req.body.insured) {
      // Odebereme ID pojištění z původního pojištěnce
      await Insured.findByIdAndUpdate(oldInsurance.insured, {
        $pull: { insurances: oldInsurance._id },
      });

      // Přidáme ID pojištění novému pojištěnci
      await Insured.findByIdAndUpdate(req.body.insured, {
        $push: { insurances: oldInsurance._id },
      });
    }

    // Aktualizace samotného pojištění
    const updatedInsurance = await Insurance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedInsurance);
  } catch (error) {
    console.error("Chyba při úpravě pojištění:", error);
    res.status(500).json({ message: "Chyba při úpravě pojištění." });
  }
});

// Smaže pojistku podle ID
app.delete("/api/insurances/:id", async (req, res) => {
  try {
    const deletedInsurance = await Insurance.findByIdAndDelete(req.params.id); // Smaže pojištění
    if (deletedInsurance == null) {
      return res.status(404).json({ message: "Pojištění nenalezeno" });
    }
    res.json({ message: "Pojištění smazáno" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpointy pro typy pojištění

// Vrátí všechny typy pojištění
app.get("/api/insuranceTypes", async (req, res) => {
  try {
    const insuranceTypes = await InsuranceType.aggregate([
      {
        $lookup: {
          from: "insurances", // Kolekce pojištění
          localField: "_id", // Propojení na základě ID typu pojištění
          foreignField: "type", // Pole v kolekci pojištění
          as: "insurances", // Název výsledného pole
        },
      },
      {
        $addFields: {
          insuranceCount: { $size: "$insurances" }, // Přidání pole s počtem pojištění
        },
      },
      {
        $project: {
          insurances: 0, // Skryjeme pole `insurances`
        },
      },
    ]);

    res.json(insuranceTypes);
  } catch (err) {
    console.error("Chyba při načítání typů pojištění:", err);
    res.status(500).json({ message: "Chyba při načítání typů pojištění." });
  }
});

// Vrátí typ pojištění podle ID
app.get("/api/insuranceTypes/:id", async (req, res) => {
  try {
    const insuranceType = await InsuranceType.findById(req.params.id);
    if (insuranceType == null) {
      return res.status(404).json({ message: "Typ pojištění nenalezen" });
    }
    res.json(insuranceType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vytvoří nový typ pojištění
app.post("/api/insuranceTypes", async (req, res) => {
  const insuranceType = new InsuranceType(req.body);
  try {
    const newInsuranceType = await insuranceType.save();
    res.status(201).json(newInsuranceType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Aktualizuje typ pojištění podle ID
app.put("/api/insuranceTypes/:id", async (req, res) => {
  try {
    const updatedInsuranceType = await InsuranceType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedInsuranceType == null) {
      return res.status(404).json({ message: "Typ pojištění nenalezen" });
    }
    res.json(updatedInsuranceType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Smaže typ pojištění podle ID
const { ObjectId } = mongoose.Types;

app.delete("/api/insuranceTypes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Ověření, zda ID je validní ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Neplatné ID typu pojištění." });
    }

    // Zkontroluje, zda je typ pojištění použitý v některé pojistce
    const isUsed = await Insurance.findOne({ type: new ObjectId(id) });
    if (isUsed) {
      return res.status(400).json({
        message:
          "Typ pojištění nelze smazat, protože je použitý v některé pojistce.",
      });
    }

    // Pokud není použitý, smaže typ pojištění
    const deletedInsuranceType = await InsuranceType.findByIdAndDelete(id);
    if (!deletedInsuranceType) {
      return res.status(404).json({ message: "Typ pojištění nenalezen." });
    }

    res.json({ message: "Typ pojištění byl úspěšně smazán." });
  } catch (err) {
    res.status(500).json({ message: "Chyba při mazání typu pojištění." });
  }
});

app.listen(PORT, () => console.log("Server běží na portu", PORT));
