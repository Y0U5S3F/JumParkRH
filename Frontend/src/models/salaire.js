class Salaire {
    constructor(id = "", employe = "", salaireBase = 0.00, jourHeureTravaille = 0.00, salaire = 0.00, tauxHeureSup = 0.00, heuresSup = 0.00,
       prixTotSup = 0.00, primeTransport = 0.00, primePresence = 0.00, acompte = 0.00, impots = 0.00, apoint = 0.00, css = 0.00, cnss = 0.00,
        jourFerie = 0, prixJourFerie = 0.00, prixTotFerie = 0.00, congePaye = 0, jourAbsence = 0, prixCongePaye = 0.00, prixTotConge = 0.00,
         salaireBrut = 0.00, salaireImposable = 0.00, salaireNet = 0.00, modePaiement = "virement bancaire", createdAt = "")
      {
      this.id = id;
      this.employe = employe;
      this.salaireBase = salaireBase;
      this.jourHeureTravaille = jourHeureTravaille;
      this.salaire = salaire;
      this.tauxHeureSup = tauxHeureSup;
      this.heuresSup = heuresSup;
      this.prixTotSup = prixTotSup;
      this.primeTransport = primeTransport;
      this.primePresence = primePresence;
      this.acompte = acompte;
      this.impots = impots;
      this.apoint = apoint;
      this.css = css;
      this.cnss = cnss;
      this.jourFerie = jourFerie;
      this.prixJourFerie = prixJourFerie;
      this.prixTotFerie = prixTotFerie;
      this.congePaye = congePaye;
      this.jourAbsence = jourAbsence;
      this.prixCongePaye = prixCongePaye;
      this.prixTotConge = prixTotConge;
      this.salaireBrut = salaireBrut;
      this.salaireImposable = salaireImposable;
      this.salaireNet = salaireNet;
      this.modePaiement = modePaiement;
      this.createdAt = createdAt;
    }
  }
  
  export default Salaire;
  