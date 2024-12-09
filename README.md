# Pojišťovna Štěstí

Testovací projekt k rekvalifikačnímu kurzu "Tvorba www aplikací v JavaScript - ITNetwork.cz"  
Webová aplikace pro správu pojištěnců, pojištění a typů pojištění. Umožňuje evidenci pojištěnců, přiřazení pojištění a správu typů pojištění.

## Funkcionalita

- **Seznam pojištěnců:**
  - Filtrování pojištěnců podle jména, adresy nebo PSČ.
  - Stránkování a zobrazení detailů pojištěnce.
  - Možnost úpravy a mazání pojištěnců.

- **Seznam pojištění:**
  - Filtrování pojištění podle typu nebo jména pojištěnce.
  - Stránkování pojištění.
  - Možnost úpravy pojištěnců přímo ze seznamu pojištění.

- **Seznam typů pojištění:**
  - Přehled dostupných typů pojištění.
  - Zobrazení počtu uzavřených pojištění pro každý typ.
  - Možnost úpravy typů pojištění.

- **Formuláře:**
  - Přidání a úprava pojištěnců, včetně validace zadaných dat.
  - Přidání a úprava typů pojištění.

## Technologie

### Backend
- **Node.js** – JavaScript runtime pro běh serveru.
- **Express.js** – Framework pro Node.js.
- **Mongoose** – Knihovna pro modelování a validaci MongoDB objektů.
- **CORS** – Middleware pro nastavení Cross-Origin Resource Sharing.
- **MongoDB** – Dokumentová databáze. Databáze běží na mongodb.com, není třeba instalovat lokální MongoDB server
 
### Frontend
- **React** – Knihovna pro tvorbu uživatelského rozhraní.
- **React Router** – Knihovna pro navigaci mezi stránkami.
- **Bootstrap** – CSS framework pro responzivní design.

## Instalace

1. Naklonujte repozitář:
2. Ve složce server nainstalujte závislosti příkazem "npm install"
3. Ve složce client nainstalujte závislosti příkazem "npm install"
4. V kořenové složce nainstalujte závislosti příkazem "npm install" (concurrently - nástroj pro paralelní spouštění příkazů)
5. V kořenovém adresáři spustíte projekt příkazem "npm start".


