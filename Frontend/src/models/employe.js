class Employe {
  constructor(
    matricule, nom, prenom, email, date_de_naissance, lieu_de_naissance, nationalite, genre_legal,
    situation_familiale, CIN, num_telephone, adresse, ville, code_postal, nom_urgence, num_telephone_urgence, 
    role, departement_id, service_id, compte_bancaire, rib_bancaire
  ) {
    this.matricule = matricule;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.date_de_naissance = date_de_naissance;  // Updated field name
    this.lieu_de_naissance = lieu_de_naissance;  // Updated field name
    this.nationalite = nationalite;
    this.genre_legal = genre_legal;  // Updated field name
    this.situation_familiale = situation_familiale;
    this.CIN = CIN;  // Updated field name
    this.num_telephone = num_telephone;  // Updated field name
    this.adresse = adresse;
    this.ville = ville;
    this.code_postal = code_postal;
    this.nom_urgence = nom_urgence;  // Updated field name
    this.num_telephone_urgence = num_telephone_urgence;  // Updated field name
    this.role = role;
    this.departement_id = departement_id;
    this.service_id = service_id;
    this.compte_bancaire = compte_bancaire;
    this.rib_bancaire = rib_bancaire;
  }
}

export default Employe;
