class Employe {
  constructor(
    matricule = "", nom = "", prenom = "", email = "", password="", date_de_naissance = "", lieu_de_naissance = "",
    nationalite = "", genre_legal = "", situation_familiale = "", CIN = "",uid = "",num_telephone = "", adresse = "",
    ville = "", code_postal = "", nom_urgence = "", num_telephone_urgence = "", role = "", departement_id = "",
    service_id = "",salaire_base = "",cnss = "",compte_bancaire = "", rib_bancaire = ""
  ) {
    this.matricule = matricule;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.password = password;
    this.date_de_naissance = date_de_naissance;
    this.lieu_de_naissance = lieu_de_naissance;
    this.nationalite = nationalite;
    this.genre_legal = genre_legal;
    this.situation_familiale = situation_familiale;
    this.CIN = CIN;
    this.uid = uid;
    this.num_telephone = num_telephone;
    this.adresse = adresse;
    this.ville = ville;
    this.code_postal = code_postal;
    this.nom_urgence = nom_urgence;
    this.num_telephone_urgence = num_telephone_urgence;
    this.role = role;
    this.departement_id = departement_id;
    this.service_id = service_id;
    this.salaire_base = salaire_base;
    this.cnss = cnss;
    this.compte_bancaire = compte_bancaire;
    this.rib_bancaire = rib_bancaire;
  }
}

export default Employe;
