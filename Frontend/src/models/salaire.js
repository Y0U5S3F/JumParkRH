class Salaire {
  constructor(id = "", employe = "", salaire_base = 0.00, jour_heure_travaille = 0.00, salaire = 0.00, taux_heure_sup = 0.00, heures_sup = 0.00,
      prix_tot_sup = 0.00, prime_transport = 0.00, prime_presence = 0.00, acompte = 0.00, impots = 0.00, apoint = 0.00, css = 0.00, cnss = 0.00,
      jour_ferie = 0, prix_jour_ferie = 0.00, prix_tot_ferie = 0.00, conge_paye = 0, jour_absence = 0, prix_conge_paye = 0.00, prix_tot_conge = 0.00,
      salaire_brut = 0.00, salaire_imposable = 0.00, salaire_net = 0.00, mode_paiement = "virement bancaire", created_at = "") {
      this.id = id;
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
      this.jour_absence = jour_absence;
      this.prix_conge_paye = prix_conge_paye;
      this.prix_tot_conge = prix_tot_conge;
      this.salaire_brut = salaire_brut;
      this.salaire_imposable = salaire_imposable;
      this.salaire_net = salaire_net;
      this.mode_paiement = mode_paiement;
      this.created_at = created_at;
  }
}

export default Salaire;
