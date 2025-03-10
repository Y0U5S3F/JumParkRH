class FicheDePaie {
    constructor(
      employe = null,
      salaire_base = 0,
      jour_heure_travaille = 0,
      salaire = 0,
      taux_heure_sup = 0,
      heures_sup = 0,
      prix_tot_sup = 0,
      prime_transport = 0,
      prime_presence = 0,
      acompte = 0,
      impots = 0,
      apoint = 0,
      css = 0,
      cnss = 0,
      jour_ferie = 0,
      prix_jour_ferie = 0,
      prix_tot_ferie = 0,
      conge_paye = 0,
      jour_abcense = 0,
      prix_conge_paye = 0,
      prix_tot_conge = 0,
      salaire_brut = 0,
      salaire_imposable = 0,
      salaire_net = 0,
      mode_paiement = ""
    ) {
      this.employe = employe;
      this.salaire_base = salaire_base;
      this.jour_heure_travaille = jour_heure_travaille;
      this.salaire = salaire;
      this.taux_heure_sup = taux_heure_sup;
      this.heures_sup = heures_sup;
      this.prix_tot_sup = prix_tot_sup;
      this.prime_transport = prime_transport;
      this.prime_presence = prime_presence;
      this.acompte = acompte;
      this.impots = impots;
      this.apoint = apoint;
      this.css = css;
      this.cnss = cnss;
      this.jour_ferie = jour_ferie;
      this.prix_jour_ferie = prix_jour_ferie;
      this.prix_tot_ferie = prix_tot_ferie;
      this.conge_paye = conge_paye;
      this.jour_abcense = jour_abcense;
      this.prix_conge_paye = prix_conge_paye;
      this.prix_tot_conge = prix_tot_conge;
      this.salaire_brut = salaire_brut;
      this.salaire_imposable = salaire_imposable;
      this.salaire_net = salaire_net;
      this.mode_paiement = mode_paiement;
    }
  }
  
  export default FicheDePaie;