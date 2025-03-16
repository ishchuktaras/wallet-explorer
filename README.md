Wallet Explorer

## Přehled projektu

Wallet Explorer je jednoduchá webová aplikace pro průzkum blockchainových peněženek, která umožňuje uživatelům procházet obsah kryptoměnových peněženek, včetně tokenů a NFT. Aplikace je nasazena na platformě Vercel a zdrojový kód je dostupný na GitHubu.

## Klíčové funkce

- **Vyhledávání peněženek**: Uživatelé mohou zadat adresu peněženky a zobrazit její obsah
- **Základní informace o peněžence**: Zobrazení základních údajů o peněžence
- **Zobrazení ERC-20 tokenů**: Přehled všech ERC-20 tokenů vlastněných peněženkou
- **Procházení NFT kolekcí**: Vizuální zobrazení NFT, které peněženka vlastní
- **Jednoduchý UI**: Zaměření na funkčnost a přehlednost


## Technický stack

- **Frontend**: React.js s TypeScriptem
- **Navigace**: React Router pro správu routování v aplikaci
- **Blockchain interakce**: Knihovna Ethers.js pro komunikaci s blockchainem
- **Stylování**: Základní CSS bez použití pokročilých frameworků
- **Data**: Veřejná blockchain API pro získávání dat


## Architektura a implementace

Aplikace je strukturována jako moderní React aplikace s následujícími klíčovými komponenty:

1. **Vstupní formulář**: Jednoduchý formulář pro zadání adresy peněženky
2. **API vrstva**: Komponenty pro volání blockchain API a získávání dat
3. **Zobrazovací komponenty**:

1. Komponenta pro zobrazení základních informací o peněžence
2. Komponenta pro zobrazení ERC-20 tokenů
3. Komponenta pro zobrazení NFT kolekcí



4. **TypeScript rozhraní**: Definice datových struktur pro typovou bezpečnost


## Technické detaily implementace

- **Proof-of-concept aplikace**: Vytvořena jako demonstrace základních schopností blockchain dat
- **Minimální ošetření chyb**: Základní stavy načítání a chybové stavy
- **Omezená funkcionalita**: Nezahrnuje pokročilé funkce jako historie transakcí nebo sledování portfolia
- **Typová bezpečnost**: Využití TypeScript rozhraní pro definici datových struktur


## Známé problémy a omezení

- **Problémy s vykreslováním NFT**: Některé NFT obrázky se nezobrazují správně kvůli CORS problémům nebo neplatným metadatům
- **Omezené informace o peněžence**: Aplikace zobrazuje pouze základní informace o tokenech a NFT


## Potenciální vylepšení

Pro budoucí vývoj bych zvážil následující vylepšení:

1. **Rozšíření funkcionality**: Přidání historie transakcí a analýzy portfolia
2. **Vylepšení UI/UX**: Implementace responzivního designu a pokročilejších vizuálních prvků
3. **Řešení problémů s NFT**: Implementace proxy serveru pro obcházení CORS omezení
4. **Rozšíření podpory sítí**: Přidání podpory pro více blockchainových sítí (Polygon, Solana, atd.)
5. **Optimalizace výkonu**: Implementace cachování a optimalizace načítání dat


## Technické výzvy a řešení

Během vývoje jsem se setkal s několika výzvami:

1. **Interakce s blockchainem**: Využití knihovny Ethers.js pro zjednodušení komunikace s Ethereum blockchainem
2. **Zobrazování NFT**: Implementace komponenty pro zobrazení NFT s ošetřením chybějících nebo neplatných metadat
3. **Typová bezpečnost**: Vytvoření TypeScript rozhraní pro zajištění konzistence dat napříč aplikací


## Závěr

Wallet Explorer je jednoduchá, ale funkční aplikace demonstrující základní schopnosti práce s blockchain daty. Přestože má své limity, slouží jako dobrý základ pro budoucí rozšíření a vylepšení. Projekt ukazuje mé schopnosti pracovat s moderními webovými technologiemi a blockchain API.

Installation

Clone the repository:

bashCopygit clone https://github.com/ishchuktaras/wallet-explorer.git
cd wallet-explorer

Install dependencies:

bashCopynpm install

Start the development server:

bashCopynpm start

Open http://localhost:3000 to view the application in your browser.


License
This project is available as open source under the terms of the MIT License.